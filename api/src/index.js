import Fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import cors from "@fastify/cors";
import { config as dotEnvConfig } from "dotenv";
import flightController from "./controller/flight.controller.cjs";

// ****************************
// Global configuration
// ****************************

dotEnvConfig();

// ****************************
// Boot
// ****************************

/**
 * Create Prisma instance
 * @returns {PrismaClient}
 */
const bootPrisma = () => new PrismaClient();

/**
 * Create Fastify instance
 * @returns {Fastify}
 * @type {import('fastify').FastifyInstance} Instance of Fastify
 */
const bootFastify = () => Fastify({ logger: true });

/**
 * Configure and run fastify
 * @param {Fastify} fastify
 */
function startServer(fastify) {

    // Configuration

    __FASTIFY__.register(cors, {
        origin: (origin, cb) => {
            const hostname = new URL(origin).hostname;
            if (hostname === "localhost" || hostname === "127.0.0.1") {
                cb(null, true);
                return;
            }
            cb(new Error("Not allowed"), false);
        },
    });
    __FASTIFY__.register(flightController);
    __FASTIFY__.__PRISMA__ = __PRISMA__;

    // Run Forest, run !

    fastify.listen({ port: process.env.FASTIFY_PORT }, function (err, address) {
        if (err) {
            fastify.log.error(err);
            process.exit(1);
        }
    });
}

/**
 * Main script
 * @return {void}
 */
(async () => {
    const __FASTIFY__ = await bootFastify();
    const __PRISMA__ = await bootPrisma();
    startServer(__FASTIFY__);
})();
