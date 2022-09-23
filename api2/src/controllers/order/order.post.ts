import { PrismaClient } from "@prisma/client";
import { getFlightsDTO } from "../../dal/dto/flight.dto.js";
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
    const prisma = new PrismaClient();
    const { name ,mail , flights } = JSON.parse(req.body);
    //const { name, mail } = userInfo;

    await prisma.$transaction(async () => {
        const userId = await createUser(
            name,
            mail,
        );

        if (userId === null) {
            rep.statusCode = 403;
            rep.send();
        } else {
            const orderId = await createOrder(
                userId,
                getFlightsDTO(flights)

            );
            
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
