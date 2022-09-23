import { PrismaClient } from "@prisma/client";

/**
     * Create  new order
     *
     * @param {*} userId
     * @param {*} flights
     * @return
     */
export async function createOrder(userId:number, flights:any[]) {
    const prisma = new PrismaClient();
    const order = await prisma.order.create({
        data: {
            user: userId
        }
    });

    const tickets = [];

    for (const flight of flights) {
        let flightDB = await prisma.flight.findUnique({
            where:{ reference: flight.reference }
        })
        if (flightDB !== null){
            tickets.push(
                await prisma.ticket.create({
                    data: {
                        flight: flightDB.id,
                        order: order.id
                    },
                })
            );
        }
        
    }

    return order.id;
}