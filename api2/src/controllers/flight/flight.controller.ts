import { flights, flightsSchema } from "./flights.get.js";

import { FastifyInstance } from "fastify";

export function flightController(fastify: FastifyInstance) {
    fastify.get('/flight/flights', { schema: flightsSchema }, flights);
}