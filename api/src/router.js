import flight from "./controller/flight.controller.js";

/**
 * Api Router
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
export default async function(fastify) {
    await flight(fastify);
};
