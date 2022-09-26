import { FastifyInstance } from "fastify";
import { calc } from "./calc.post.js";
import { createOrder } from "./createOrder.post.js";
import { createOrderBroker } from "./createOrderBroker.js";
import { order } from "./order.get.js";

export function orderController(fastify: FastifyInstance) {
    fastify.post("/order/createOrder", createOrder);
    fastify.get("/order/:orderId", order);
    fastify.post("/order/calc", calc);
    fastify.post("/order/createOrderBroker",createOrderBroker )
}
