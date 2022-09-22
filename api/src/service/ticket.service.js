export default class TicketService {
    prisma;

    constructor(prisma) {
        this.prisma = prisma;
    }

    async getTicketPriceById(ticketId) {
        let price = 0;

        const ticket = await this.prisma.ticket.findUnique({
            where: {
                ticket_id: ticketId,
            },
            include: {
                flight: true,
            },
        });

        const ticketOptions = await this.prisma.ticket_option.findMany({
            data: {
                ticket_id: ticketId,
            },
        });

        for (const ticketOption of ticketOptions) {
            const flightOptionMeta =
                await fastify.prisma.flight_option_meta.findUnique({
                    where: {
                        ticket_option_id: ticketOption.id,
                    },
                    include: {
                        flight_option_meta_type_flight_option_metaToflight_option_meta_type: true,
                    },
                });

            const metaType =
                flightOptionMeta
                    .flight_option_meta_type_flight_option_metaToflight_option_meta_type
                    .type;
            const metaTypeIsPercent =
                flightOptionMeta
                    .flight_option_meta_type_flight_option_metaToflight_option_meta_type
                    .isPercent;

            if (flightOptionMeta.name === "AR") {
                price = price + parseFloat(ticket.flight.price);
            }

            if (metaType === "add") {
                price =
                    price +
                    (metaTypeIsPercent === 1
                        ? 1 + flightOptionMeta.value / 100
                        : flightOptionMeta.value);
            } else {
                price =
                    price -
                    (metaTypeIsPercent === 1
                        ? 1 + flightOptionMeta.value / 100
                        : flightOptionMeta.value);
            }
        }

        return price;
    }
}
