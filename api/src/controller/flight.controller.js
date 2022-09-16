/**
 * Reply list of flights
 * @param {FastifyRequest} req
 * @param {FastifyReply} res
 */
async function postOrder(fastify, req, res) {

    const { customerInfo, flights } = req.body;

    try{
        await prisma.$transaction(async (tx) => {
            // Todo: remplacer par des schema une fois la validation coté front
            // Todo: utiliser une giga-transaction

                if (customerInfo !== undefined || typeof flights === "array") {

                const { name, mail, password } = customerInfo;
                const rule = (data) => typeof data === "string" && data.length > 3;

                if ([name, mail, password].filter(rule)) {
                    let customer = await fastify.prisma.customer.findUnique({
                        where: { mail },
                    });

                if (
                    (customer !== null && customer.password === password) ||
                    customer === null
                ) 
                {
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

                    res.send(tickets);
                } else res.statusCode = 403;
            } else res.statusCode = 422;
        } else res.statusCode = 400;
        res.send(null);
    });
    }
    catch(err) {
        res.send(err);
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
                flight_option: true
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
