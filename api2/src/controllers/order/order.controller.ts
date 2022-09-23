import { FastifyInstance } from "fastify";
import { order} from "./order.post.js";


export function orderController(fastify: FastifyInstance) {
    fastify.post('/order/createOrder',order)
}