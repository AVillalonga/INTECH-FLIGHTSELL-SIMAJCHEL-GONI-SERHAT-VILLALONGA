import { PrismaService } from "./prisma.service.js";

class OrderService {
    default_password = "123";

    async createOrder(
        name: string,
        mail: string,
        flightsRef: { reference: string }[]
    ) {
        const flights = await PrismaService.flight.findMany({
            select: { id: true, price: true, flight_option: true },
            where: {
                reference: {
                    in: flightsRef.map((f) => f.reference),
                },
            },
        });

        const flightsData = flights.map((flight) => {
            return {
                flight: flight.id,
                price: flight.price, // TODO: calculer le prix du vol**
            };
        });

        return await PrismaService.order.create({
            data: {
                user_orderTouser: {
                    connectOrCreate: {
                        where: {
                            mail,
                        },
                        create: {
                            mail,
                            name,
                            password: this.default_password,
                        },
                    },
                },
                ticket: {
                    createMany: {
                        data: flightsData,
                    },
                },
            },
            include: {
                user_orderTouser: true,
                ticket: true,
            },
        });
    }
}

export default new OrderService();
