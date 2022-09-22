import fastify from "fastify";

export default class FlightService {
    prisma;

    constructor(prisma) {
        this.prisma = prisma;
    }

    async getDisponibilityCountById(flightId) {
        const flight = await this.prisma.flight.findUnique({
            where: {
                flight_id: flightId,
            },
            include: {
                ticket: true,
            },
        });

        return flight.disponibility - flight.ticket.length;
    }

    async getFirstClassDisponibilityCountById() {
        const flight = await this.prisma.flight.findUnique({
            where: {
                flight_id: flightId,
            },
            include: {
                ticket: true,
            },
        });

        const firstClassCount = Number((flight.disponibility * 0.1).toFixed(0)); // TODO: Remove magic number

        const firstClassSoldCount = await this.prisma.ticket_option.findMany({
            select: {
                _count: {
                    where: {
                        ticket_id: await fastify.prisma.ticket.findMany({
                            where: {
                                flight_id: flight.id,
                            },
                        }),
                        flight_option_id: optionFirstPlace.id,
                    },
                },
            },
        });

        return firstClassCount - firstClassSoldCount;
    }
}
