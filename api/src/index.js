import Fastify, { fastify } from "fastify";

import CustomerService from "./service/customer.service.js";
import FlightService from "./service/flight.service.js";
import OrderService from "./service/order.service.js";
import { PrismaClient } from "@prisma/client";
import TicketService from "./service/ticket.service.js";
import cors from "@fastify/cors";
import { config as dotEnvConfig } from "dotenv";
import router from "./router.js";

var FLIGHT_SELL_ASCII = `

⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀                                ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣺⣷⠙⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀                                ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠏⣼⣖⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣠⠟⣛⠼⠓⠿⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀                                ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠿⠞⠧⣜⠻⣅⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣠⣾⡷⠋⢀⣤⢄⠀⠘⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀                                ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠏⠀⡠⣤⡄⠑⢾⣷⣄⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢀⣿⠟⠀⡄⡻⠇⠀⢡⠀⢹⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀                                ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡞⠀⡀⠀⠺⢿⢢⡀⠻⡻⡄⠀⠀⠀⠀
⠀⠀⠀⣠⢋⠎⠀⡼⠀⡇⠀⠂⡀⠁⡀⢳⡀⠀⠀⠀⠀⠀⠀⠀⠀                                ⠀⠀⠀⠀⠀⠀⠀⠀⢀⡼⢀⠌⢀⠑⠦⢸⠀⣧⠀⠱⡜⢆⠀⠀⠀
⠀⠀⡰⠁⡞⠀⣼⡃⠀⣧⡄⠚⢷⡄⠈⠀⠳⣄⠀⠀⠀⠀⠀⠀⠀                                ⠀⠀⠀⠀⠀⠀⠀⣠⠾⠗⠁⢰⣾⠟⢀⣼⡀⢸⣷⠀⢱⠈⢧⠀⠀
⠀⡸⠁⣸⠁⢠⠇⡅⢰⣿⢡⡇⠀⠻⣿⣦⡰⢌⡑⠢⢤⣤⡀⠀⠀                                ⠀⠀⢀⣤⣤⠴⢊⡡⢆⢴⣿⠟⠀⢸⡄⣿⡇⢸⠘⡄⠀⢧⠈⢧⠀
⢀⣇⠴⡇⠀⢸⠀⡇⢸⢿⣏⣧⡇⠀⠙⠛⠿⢦⣬⡓⢄⣉⠛⣄⠀                                ⠀⣠⠞⢋⡠⢒⣉⣴⡿⠛⠃⠀⢸⣾⣿⡿⡇⢰⠀⢇⠀⠸⠧⣘⡆
⠘⠁⢸⠀⠀⡇⢴⠁⠈⡆⢻⣿⣦⡀⣷⣰⡤⠈⠛⢻⣴⣿⡿⠛⠃                                ⠘⠛⢿⣷⣶⡿⠛⡁⢴⣶⣿⢀⣾⣿⡟⢀⠃⢸⣄⢸⠀⠀⠇⠈⠃
⠀⠀⡄⠀⢸⠁⢸⡇⠀⡇⠀⢻⠻⠿⠿⣿⣡⣿⣶⣶⢈⡌⡅⣶⣆          FLIGHT SELL          ⢰⣶⢨⠰⡉⣷⣦⣻⣾⣿⠿⠿⠟⡻⠀⢸⠀⢸⡇⠀⡇⠀⢸⠀⠀
⠀⠀⡇⢀⠇⠀⠈⣇⠀⢹⠀⠀⣆⠀⡄⠀⣨⠿⠿⢿⣿⣷⣆⣽⠃                                ⠘⣿⣴⣴⣿⡿⠿⠿⢇⠀⢠⢄⣰⠃⠀⡎⠀⣸⠁⠀⠸⡀⢸⠀⠀
⠀⠀⣇⣼⠀⠀⠀⣿⠀⠈⡄⠀⠸⡄⠃⠰⠁⠀⣴⡾⠘⣿⠛⠟⠀                                ⠀⠻⠿⣿⡇⢷⣤⣄⠈⢇⢸⢀⠇⠀⢀⠃⠀⣿⠀⠀⠀⣧⣸⡇⠀
⠀⠀⡿⢹⠀⠀⠀⡿⡇⠀⢡⠀⠀⢹⣗⣿⢠⣿⣿⡇⠀⡇⠀⠀⠀                                ⠀⠀⠀⢸⠁⢸⣿⣼⡄⣺⢾⡟⠀⠀⡜⠀⢰⢿⠀⠀⠀⡟⠻⠇⠀
⠀⠀⠀⠘⡆⠀⠀⠁⠸⠀⠀⡆⠀⠈⢿⠹⠛⠛⠿⣷⣀⡇⠀⠀⠀                                ⠀⠀⠀⢸⡄⣼⠿⠏⠛⠟⡿⠁⠀⢰⠁⠀⡎⢸⠀⠀⠀⡇⠀⠀⠀
⠀⠀⠀⠀⡇⠀⠀⠀⠀⢧⠀⠸⡀⠀⠈⢇⠀⠀⠀⠙⣿⡁⠀⠀⠀                                ⠀⠀⠀⠀⣿⠏⠀⠀⠀⣰⠃⠀⢀⠏⠀⡸⠀⢸⠀⠀⢸⠁⠀⠀⠀
⠀⠀⠀⠀⣧⠀⠀⠆⠀⠘⡆⠀⢣⠀⠀⠘⡆⠀⠀⠀⠈⠀⠀⠀⠀                                ⠀⠀⠀⠀⠉⠀⠀⠀⢠⠇⠀⠀⡼⠀⢰⠃⠀⢸⠀⠀⣸⠀⠀⠀⠀
⠀⠀⠀⠀⢹⠀⠀⡇⠀⠀⠸⡄⠈⡆⠀⠀⢻⡀⠀⠀⠀⠀⠀⠀⠀                                ⠀⠀⠀⠀⠀⠀⠀⠀⡟⠀⠀⢠⠃⢀⠏⠀⠀⢸⠀⠀⡏⠀⠀⠀⠀
⠀⠀⠀⠀⠈⣆⢸⣧⠀⠀⠀⠱⡀⠸⡄⠀⠘⡇⠀⠀⠀⠀⠀⠀⠀                                ⠀⠀⠀⠀⠀⠀⠀⢸⠃⠀⢀⠇⠀⡞⠀⠀⠀⣼⡇⢰⠃⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠘⣾⠈⢧⠀⠀⠀⢡⠀⠹⣄⠀⢧⠀⠀⠀⠀⠀⠀⠀                                ⠀⠀⠀⠀⠀⠀⠀⠸⠀⢠⡎⠀⡜⠀⠀⠀⡰⠁⣧⠏⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠉⠀⠈⢣⡀⠀⠀⢇⠀⢻⣦⣸⠀⠀⠀⠀⠀⠀⠀                                ⠀⠀⠀⠀⠀⠀⢀⣇⡰⡿⠀⠰⠁⠀⢀⡜⠁⠀⠉⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠱⡄⠀⠸⡄⠈⡆⠙⠃⠀⠀⠀⠀⠀⠀                                ⠀⠀⠀⠀⠀⠀⠘⠛⢡⠁⢀⠇⠀⢠⠞⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣆⠀⢣⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀                                ⠀⠀⠀⠀⠀⠀⠀⠀⡎⠀⡜⠀⣠⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢆⠘⡟⠲⠇⠀⠀⠀⠀⠀⠀⠀                                ⠀⠀⠀⠀⠀⠀⠀⠸⠗⢺⠃⡰⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢧⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀                                ⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⡴⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣻⠀⠀⠀⠀⠀⠀⠀⠀⠀                                ⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀

`;

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
 */
const bootFastify = () => Fastify({ logger: true });

/**
 * Configure and run fastify
 * @param {Fastify} fastify
 * @param {PrismaClient} prisma
 */
function startServer(fastify, prisma) {
    // Cors

    fastify.register(cors, () => {
        return (req, callback) => {
            const corsOptions = {
                // This is NOT recommended for production as it enables reflection exploits
                origin: "*",
            };

            // do not include CORS headers for requests from localhost
            if (/^localhost$/m.test(req.headers.origin)) {
                corsOptions.origin = false;
            }

            // callback expects two parameters: error and options
            callback(null, corsOptions);
        };
    });

    fastify.register(router);
    fastify.prisma = prisma;

    configureServices(fastify);

    // Run Forest, run !

    fastify.listen({ port: process.env.FASTIFY_PORT }, function (err, address) {
        if (err) {
            fastify.log.error(err);
            process.exit(1);
        }

        console.log(FLIGHT_SELL_ASCII);
        fastify.log.info(`server listening on ${address}`);
    });
}

function configureServices(fastify) {
    fastify.services = {};

    const services = [
        ["order", OrderService],
        ["customer", CustomerService],
        ["ticket", TicketService],
        ["flight", FlightService],
    ];

    services.forEach((service) => {
        if (service instanceof OrderService) {
            fastify.services[service[0]] = new service[1](fastify.prisma, fastify.services.ticket);
        } else {
            fastify.services[service[0]] = new service[1](fastify.prisma);
        }
    });

    console.log(fastify.services);
}

/**
 * Main script
 * @return {void}
 */
(async () => {
    const __FASTIFY__ = await bootFastify();
    const __PRISMA__ = await bootPrisma();
    startServer(__FASTIFY__, __PRISMA__);
})();
