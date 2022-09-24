import { FastifyInstance } from "fastify";
import { rates } from "./currency_rates.get.js";

export function ratesController(fastify: FastifyInstance) {
    fastify.get('/rates', rates);
}