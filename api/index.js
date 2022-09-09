import Fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import flightController from "./flight.controller.js";

// ****************************
// Boot
// ****************************

require('dotenv').config()

async function bootPrisma() {
    const prisma = new PrismaClient();
    return prisma;
}

async function bootFastify() {
    const fastify = Fastify({
        logger: true,
    });

    flightController(fastify);
    return fastify;
}

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

(() => {
    const __FASTIFY__ = bootFastify();
    const __PRISMA__ = bootPrisma();
    startServer(__FASTIFY__);
})();
