import orderService from "../../services/order.service.js";
import { parseOrderToDTO } from "../../dal/dto/order.dto.js";

export const orderSchema = {
    response: {
        200: {
            type: "object",
            properties: {
                reponse: { type: "string" },
            },
        },
    },
};

export async function createOrder(req: any, rep: any) {
    const order = await orderService.createOrder(req.body);
    rep.send(parseOrderToDTO(order));
}
