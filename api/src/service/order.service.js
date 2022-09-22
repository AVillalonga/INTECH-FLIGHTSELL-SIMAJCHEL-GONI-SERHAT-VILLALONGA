import { PrismaClient } from "@prisma/client";

export default class OrderService {
    prisma;
    ticketService;

    constructor(prisma, ticketService) {
        this.prisma = prisma;
        this.ticketService = ticketService;
    }

    /**
     * Create  new order
     *
     * @param {*} customer
     * @param {*} flightsId
     */
    async create(customerId, flights) {
        const order = await this.prisma.order.create({
            data: {
                customer_id: customerId
            }
        });

        const tickets = [];

        for (const flightId of flights) {
            tickets.push(
                await this.prisma.ticket.create({
                    data: {
                        flight_id: flightId,
                        order_id: order.id,
                        created_at: new Date(Date.now()),
                    },
                })
            );
        }

        return order.id;
    }

    async getOrderPriceById(orderId) {
        const tickets = await this.prisma.ticket.findMany({
            where: {
                order_id: orderId
            }
        });

        let price = 0;
        for(const ticket of tickets) {
            price = price + this.ticketService.getTicketPriceById(ticket.id);
        }
    }
}
