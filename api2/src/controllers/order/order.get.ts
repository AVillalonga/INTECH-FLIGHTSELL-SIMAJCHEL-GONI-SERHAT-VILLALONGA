import { PrismaService } from "../../services/prisma.service.js";

export async function order(req: any, rep: any) {
    const { orderId: id } = req.params;

    console.log(`\n`.repeat(2), id, `\n`.repeat(2));

    return await PrismaService.order.findUnique({
        select: {
            created_at: true,
            ticket: {
                select: {
                    flight: true,
                    price: true,
                    ticket_option: {
                        select: {
                            flight_option_flight_optionToticket_option: {
                                select: {
                                    name: true,
                                    value: true,
                                    value_type: true,
                                },
                            },
                        },
                    },
                },
            },
        },
        where: { id: Number(id) },
    });
}
