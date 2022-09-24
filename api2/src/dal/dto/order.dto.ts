import { PrismaService } from "../../services/prisma.service.js";

/**
     * Create  new order
     *
     * @param {*} userId
     * @param {*} flights
     * @return
     */
export async function createOrder(userId:number, flights:any[]) {
    const order = await PrismaService.order.create({
        data: {
            user: userId
        }
    });

    const tickets = [];

    for (const flight of flights) {
        let flightDB = await PrismaService.flight.findUnique({
            where:{ reference: flight.reference }
        })
        if (flightDB !== null){
            tickets.push(
                await PrismaService.ticket.create({
                    data: {
                        flight: flightDB.id,
                        order: order.id,
                        price : "1784"
                    },
                })
            );
        }
        
    }

    return order.id;
}