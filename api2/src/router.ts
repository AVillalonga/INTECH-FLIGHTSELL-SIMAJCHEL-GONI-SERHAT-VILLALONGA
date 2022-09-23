import { FastifyInstance } from "fastify";
import { flightController } from "./controllers/flight/flight.controller.js";
import { orderController } from "./controllers/order/order.controller.js";
import { utilsController } from "./controllers/utils/utils.controller.js";
import { ratesController } from "./controllers/rates/rates.controller.js";

export default async function router(fastify: FastifyInstance) {
    const controllers: Array<(f: FastifyInstance) => void> = [
        flightController,
        utilsController,
        orderController,
        ratesController
    ];

    console.log("[fastify] registering routes..");

    for (const controller of controllers) controller(fastify);
}
