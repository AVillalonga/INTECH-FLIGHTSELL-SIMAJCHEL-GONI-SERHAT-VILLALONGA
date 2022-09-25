import { PrismaService } from "./prisma.service.js";
import calcService from "./calc.service.js";

class OrderService {
    default_password = "123";

    async createOrder(orderPostDto: {
        name: string;
        mail: string;
        flights: { reference: any; options: number[] }[];
    }) {
        const { name, mail, flights: orderFlightsPostDto } = orderPostDto;
        const ticketsData = await this.createTicketsData(orderFlightsPostDto);

        const order = await PrismaService.order.create({
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
                        data: ticketsData,
                    },
                },
            },
            include: {
                user_orderTouser: true,
                ticket: true,
            },
        });

        // Adding ticket options (cannot able to create nested relation with prisma <createMany> function)

        const flightRefs = await PrismaService.flight.findMany({
            select: { id: true, reference: true, flight_option: true },
            where: {
                reference: {
                    in: orderFlightsPostDto.map((oFPD) => oFPD.reference),
                },
            },
        });

        const retreiveActiveOption = (flightRef: string) => {
            return orderFlightsPostDto.find(
                (flight) => flight.reference === flightRef
            )?.options;
        };

        for (const ticket of order.ticket) {
            const flight = flightRefs
                .filter((f) => ticket.flight === f.id)
                .shift()!;
            const activeOptionsIds = retreiveActiveOption(flight.reference);

            const ticketOptionsData = activeOptionsIds?.map((aOId) => {
                const optionOrigin = flight.flight_option.find(
                    (fO) => fO.id === aOId
                )!;
                return {
                    flight_option: optionOrigin.id,
                    ticket: ticket.id,
                };
            });

            if (ticketOptionsData !== undefined)
                await PrismaService.ticket_option.createMany({
                    data: ticketOptionsData,
                });
        }

        return order;
    }

    async createTicketsData(
        flights: {
            reference: string | undefined;
            options: number[] | undefined;
        }[]
    ) {
        const ticketsData = [];

        for (const flight of flights) {
            let { reference, options } = flight;

            if (options === undefined || options === null) options = [];
            if (reference === undefined || reference === null)
                throw Error("Missing one reference");

            const flightInstance = await PrismaService.flight.findUnique({
                where: { reference },
                include: { flight_option: true },
            });

            if (flightInstance !== null) {
                const flightPrice = parseFloat(flightInstance.price);
                const flightOptionsInstance =
                    flightInstance.flight_option.filter((flight_option) =>
                        options!.includes(flight_option.id)
                    );
                const price = flightOptionsInstance
                .sort(calcService.sortFlightOption)
                .reduce(
                    calcService.calcTicketOption,
                    flightPrice
                );

                ticketsData.push({
                    flight: flightInstance.id,
                    price: String(price),
                });
            } else {
                throw Error("====================================");
            }
        }

        return ticketsData;
    }
}

export default new OrderService();
