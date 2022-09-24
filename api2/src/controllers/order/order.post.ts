import { PrismaService } from "../../services/prisma.service.js";
import { createOrder } from "../../dal/dto/order.dto.js";
import { createUser } from "../../dal/dto/user.dto.js";

export const orderSchema = {
    response: {
        200: {
            type: "object",
            properties: {
                reponse: {type: 'string'}
            },
        },
    }
}

export async function order(req: any, rep: any) {
    const { name ,mail , flights } = req.body;

    await PrismaService.$transaction(async () => {
        const userId = await createUser(
            name,
            mail,
        );

        if (userId === null) {
            rep.statusCode = 403;
            rep.send();
        } else {
            const orderId = await createOrder(userId,flights);
            
            try {
                //envoie de mail 
            } catch (err) {
                console.log(err);
            }

            rep.statusCode = 200;
            rep.send(orderId);
        }
    });
}
