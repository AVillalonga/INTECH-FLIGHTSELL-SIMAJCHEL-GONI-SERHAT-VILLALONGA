/**
 * Constructeur de requete
 */

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
async function flightController(fastify) {
    /**
     * Contain and synchronize all schema of flight controller
     * @param {FastifyInstance} fastify
     */
    async function loadSchemas(fastify) {
        const schemas = [
            {
                $id: "orderSchema",
                type: "object",
                properties: {
                    ref: { type: "string" },
                    user_name: { type: "string" },
                    user_mail: { type: "string" },
                    allerRetour: { type: "boolean" },
                    option: { type: "boolean" },
                },
            },
            {
                $id: "flightContractSchema",
                type: "object",
                properties: {
                    ref1: { type: "string" },
                    departureName: { type: "string" },
                    arrivalName: { type: "string" },
                    price: { type: "string" },
                },
            },
        ];

        for (const schema of schemas) fastify.addSchema(schema);
    }

    function loadRoutes(fastify) {
        const routes = [
            {
                method: "POST",
                url: "/validation",
                schema: {
                    body: { $ref: "orderSchema#" },
                    response: {
                        200: {
                            type: "object",
                            properties: {
                                response: { type: "string" },
                            },
                        },
                    },
                },
                handler: async (request, reply) => {
                    return { response: "Billets achetés " };
                },
            },
            {
                method: "GET",
                url: "/flights",
                schema: {
                    response: {
                        200: {
                            type: "object",
                            properties: {
                                ref1: { type: "string" },
                                departureName: { type: "string" },
                                arrivalName: { type: "string" },
                                price: { type: "string" },
                            },
                        },
                    },
                },
                handler: async (request, reply) => {
                    return {
                        ref1: "A3456",
                        departureName: "CDG",
                        arrivalName: "JFK",
                        price: "17",
                    };
                },
            },
        ];

        for (const route of routes) fastify.route(route);
    }
    
    loadSchemas(fastify);
    loadRoutes(fastify);
}

module.exports = flightController;
