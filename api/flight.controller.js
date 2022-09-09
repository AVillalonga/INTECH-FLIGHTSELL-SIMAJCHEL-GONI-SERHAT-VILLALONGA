/**
 * Flight controller
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
async function flightController(fastify) {
    /**
     * Get list of flights
     */
    fastify.get("/flights/list", function (request, response) {
        return {
            flight: {
                ref: "A3456",
                departureName: "CDG",
                arrivalName: "JFK",
                price: "17",
            },
        };
    });

    /**
     * Order a booking
     */
    fastify.post("flights/order", function (request, response) {
        return {};
    });
}

module.exports = routes;
