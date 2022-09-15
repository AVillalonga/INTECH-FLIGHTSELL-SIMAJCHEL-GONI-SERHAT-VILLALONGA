import Fastify from "fastify";
import { PrismaClient } from "@prisma/client";
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
                origin: '*',
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

/**
 * Main script
 * @return {void}
 */
(async () => {
    const __FASTIFY__ = await bootFastify();
    const __PRISMA__ = await bootPrisma();
    startServer(__FASTIFY__, __PRISMA__);
})();
