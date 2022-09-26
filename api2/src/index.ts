import Fastify, { FastifyInstance } from "fastify";

import cors from "@fastify/cors";
import { cronPushLocalPlanesToBroder } from "./cron/remoteapi.cron.js";
import dbService from "./services/db.service.js";
import { config as dotEnvConfig } from "dotenv";
import fastifyCron from "fastify-cron";
import { fetchEurofxref } from "./cron/eurofxref.daily.js";
import router from "./router.js";
import { syncOpenApiFlights } from "./cron/openapi.daily.js";

dotEnvConfig();
console.log(`\n`.repeat(20));

async function boot() {
    const fastify = Fastify({ logger: true });
    await fastify.register(cors, { origin: "*" });
    await fastify.register(router);
    await fastify.register(fastifyCron, {
        // https://github.com/kelektiv/node-cron#api
        jobs: [
            {
                cronTime: "0 0 * * *",
                onTick: fetchEurofxref,
                runOnInit: true
            },
            {
                cronTime: "*/10 * * * *",
                onTick: syncOpenApiFlights,
                runOnInit: true
            },
            {
                cronTime: "*/10 * * * *",
                onTick: cronPushLocalPlanesToBroder,
                runOnInit: true
            }
        ],
    });

    await dbService.initializeDatabase();
    const port = Number(process.env["API_PORT"]) || Number("3000");
    fastify.listen({ port }, onLoad.bind(null, fastify));
}

async function onLoad(
    fastify: FastifyInstance,
    err: Error | null,
    address: string
) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }

    console.log(`\n\nServer listening on '${address}'`, `\n`.repeat(4));
    fastify.cron.startAllJobs();
}

(async () => await boot())();
