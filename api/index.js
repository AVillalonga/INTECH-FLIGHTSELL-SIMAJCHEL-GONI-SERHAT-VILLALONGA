import Fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import cors from "@fastify/cors";
import flightController from "./flight.controller.cjs";
import nodeMailController from "./nodemailController.cjs"

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
 *  * Create Fastify instance
 * @returns {Fastify}
 * @type {import('fastify').FastifyInstance} Instance of Fastify
 */
async function bootFastify() {
    const fastify = Fastify({
        logger: true,
    });

    fastify.register(cors, {
        origin: (origin, cb) => {
            const hostname = new URL(origin).hostname;
            if (hostname === "localhost" || hostname === "127.0.0.1") {
                cb(null, true);
                return;
            }
            cb(new Error("Not allowed"), false);
        },
    });

    fastify.register(flightController);

    return fastify;
}

/**
 * Configure and run fastify
 * @param {Fastify} fastify
 */
function startServer(fastify) {
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
