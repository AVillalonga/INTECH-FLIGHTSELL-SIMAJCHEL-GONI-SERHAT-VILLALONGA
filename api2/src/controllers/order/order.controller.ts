import { FastifyInstance } from "fastify";
import { createOrder } from "./createOrder.post.js";
import { order } from "./order.get.js";

export function orderController(fastify: FastifyInstance) {
    fastify.post("/order/createOrder", createOrder);
    fastify.get("/order/:orderId", order)
}
