import Fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import flightController from "./flight.controller.cjs";

config();

// ****************************
// Boot
// ****************************

/**
 * Create Prisma instance
 * @returns {PrismaClient}
 */
async function bootPrisma() {
    const prisma = new PrismaClient();

    return prisma;
}

/**
 * Create Fastify instance
 * @returns {Fastify}
 */
async function bootFastify() {
    const fastify = Fastify({
        logger: true,
    });
    // flightController(fastify);
    return fastify;
}

/**
 * Configure and run fastify
 * @param {Fastify} fastify
 */
function startServer(fastify) {
    console.log(fastify);

    fastify.listen({ port: process.env.FASTIFY_PORT }, function (err, address) {
        if (err) {
            fastify.log.error(err);
            process.exit(1);
        }
    });
}

// ****************************
// Main script
// ****************************

(async () => {
    const __FASTIFY__ = await bootFastify();
    const __PRISMA__ = await bootPrisma();

    __FASTIFY__.__PRISMA__ = __PRISMA__;
    startServer(__FASTIFY__);
})();
