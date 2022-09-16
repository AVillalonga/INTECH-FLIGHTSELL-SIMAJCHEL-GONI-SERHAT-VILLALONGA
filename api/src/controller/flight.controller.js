import mailer from "../service/nodemail.service.js";
// import nodemailer from "nodemailer";
// // const nodemailer = require("nodemailer");

/**
 * Reply list of flights
 * @param {FastifyRequest} req
 * @param {FastifyReply} res
 */
async function postOrder(fastify, req, res) {
    let mail_log;

    const { customerInfo, flights } = JSON.parse(req.body);

    try {
        await fastify.prisma.$transaction(async () => {
            // Todo: remplacer par des schema une fois la validation coté front
            // Todo: utiliser une giga-transaction

            const { name, mail, password } = customerInfo;
            const rule = (data) => typeof data === "string" && data.length > 3;

            if ([name, mail, password].filter(rule)) {
                let customer = await fastify.prisma.customer.findUnique({
                    where: { mail },
                });

                if (
                    (customer !== null && customer.password === password) ||
                    customer === null
                ) {
                    if (customer === null) {
                        customer = await fastify.prisma.customer.create({
                            data: { name, mail, password },
                        });
                    }

                    const order = await fastify.prisma.order.create({
                        data: {
                            customer_id: customer.id,
                        },
                    });

                    const tickets = [];
                    for (const flightId of flights) {
                        tickets.push(
                            await fastify.prisma.ticket.create({
                                data: {
                                    flight_id: flightId,
                                    order_id: order.id,
                                    created_at: new Date(Date.now()),
                                },
                            })
                        );
                    }

                    res.statusCode = 200;
                    res.send();
                    console.log(
                        await mailer(
                            customerInfo.mail,
                            "Ticket",
                            "Voici l'id de votre commande : 1",
                            ""
                        )
                    );
                    
                } else res.statusCode = 403;
            } else res.statusCode = 422;
        });
    } catch (err) {
        fastify.log.info(err);
        res.statusCode = 450;
    }
}

/**
 * Reply list of flights
 * @param {FastifyRequest} req
 * @param {FastifyReply} res
 */
async function getFlights(fastify, req, res) {
    res.send(
        await fastify.prisma.flight.findMany({
            include: {
                location_flight_departure_idTolocation: true,
                location_flight_destination_idTolocation: true,
                flight_option_meta: {
                    include: {
                        flight_option_meta_type_flight_option_metaToflight_option_meta_type: true,
                    },
                },
            },

            // Todo: Pagination skip: | take:
        })
    );
}

/**
 * FlightController
 * @param {FastifyInstance} fastify
 */
export default async function (fastify) {
    const routes = [
        ["GET", "/flights", getFlights],
        ["POST", "/order", postOrder],
    ];

    const b = (method, url, handler) => new Object({ method, url, handler });

    for (let route of routes)
        fastify.route(b(route[0], route[1], route[2].bind(null, fastify)));
}
