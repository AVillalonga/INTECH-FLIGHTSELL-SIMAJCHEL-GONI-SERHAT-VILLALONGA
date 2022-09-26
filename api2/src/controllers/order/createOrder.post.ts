import mailService from "../../services/mail.service.js";
import orderService from "../../services/order.service.js";
import { parseOrderIdToDTO } from "../../dal/dto/order.dto.js";

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
    if (typeof req.body === "string") {
        req.body = JSON.parse(req.body);
    }
    const order = await orderService.createOrder(req.body);

    // await PrismaService.order.findUnique({
    //     select: {
    //         ticket: {
    //             select: {
    //                 id: true,
    //                 flight_flightToticket: {
    //                     select: {
    //                         direction_directionToflight: {
    //                             select: {
    //                                 location_direction_departureTolocation: {
    //                                     select: {name: true}
    //                                 }
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     },
    //     where: { id: order.id }
    // });

    rep.send(parseOrderIdToDTO(order));
    //Send mail after req.send to not block the UI
    await mailService.sendMail(
        order.user_orderTouser.mail,
        `Votre commande à été confirmé (#${order.id})`,
        `Merci d\'avoir commander chez nous ${
            order.ticket.length
        } tickets.\n ${order.ticket.map((t) => t.price).join("€ ")}`
    );
}
