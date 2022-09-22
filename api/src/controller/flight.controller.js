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
    const { name, mail, password } = customerInfo;

    await fastify.prisma.$transaction(async () => {
        const customerId = await fastify.services.customer.create(
            name,
            mail,
            password
        );

        if (customerId === null) {
            res.statusCode = 403;
            res.send();
        } else {
            const orderId = await fastify.services.order.create(
                customerId,
                flights
            );
            
            try {
                await mailer(
                    customerInfo.mail,
                    "Ticket",
                    "Voici l'id de votre commande : 1",
                    ""
                );
            } catch (err) {
                console.log(err);
            }

            res.statusCode = 200;
            res.send(orderId);
        }
    });
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
