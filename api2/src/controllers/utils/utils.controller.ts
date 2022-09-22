import { FastifyInstance } from "fastify";
import { ping } from "./ping.get.js";

export function utilsController(fastify: FastifyInstance) {
    fastify.get('/utils/ping', ping);
}