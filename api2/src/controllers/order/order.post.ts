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

export async function order(req: any, rep: any) {
    const { name, mail, flights } = req.body;
    const order = await orderService.createOrder(name, mail, flights);

    rep.send(parseOrderToDTO(order));
}
