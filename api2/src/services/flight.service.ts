import { PrismaService } from "./prisma.service.js";

export type GLOBAL_FLIGHT_OPTIONS = "AR" | "First Class";

class FlightService {
    defaultFlightOptions = [
        {
            name: "AR",
            value_type: 4,
            value: "5",
        },
        {
            name: "First Class",
            value_type: 2,
            value: "150",
        },
    ];

    async addFlight(
        reference: string,
        price: string,
        disponibility: number,
        departure_name: string,
        destination_name: string,
        origin_name = "local",
        options: any[] = []
    ) {
        departure_name = departure_name.toUpperCase();
        destination_name = destination_name.toUpperCase();

        const findOrCreateLocation = async (name: string) => {
            let location = await PrismaService.location.findUnique({
                where: { name },
            });

            if (location === null) {
                location = await PrismaService.location.create({
                    data: { name },
                });
            }

            return location;
        };

        const departure = await findOrCreateLocation(departure_name);
        const destination = await findOrCreateLocation(destination_name);

        await PrismaService.flight.create({
            data: {
                reference,
                disponibility,
                price,
                flight_origin: {
                    connectOrCreate: {
                        create: { name: origin_name },
                        where: { name: origin_name },
                    },
                },
                direction_directionToflight: {
                    connectOrCreate: {
                        create: {
                            departure: departure.id,
                            destination: destination.id,
                        },
                        where: {
                            departure_destination: {
                                departure: departure.id,
                                destination: destination.id,
                            },
                        },
                    },
                },
                flight_option: {
                    create: [...this.defaultFlightOptions, ...options],
                },
            },
            include: {
                flight_origin: true,
                flight_option: true,
                direction_directionToflight: true,
            },
        });
    }

    async getFlights() {
        return await PrismaService.flight.findMany({
            include: {
                flight_option: true,
                direction_directionToflight: {
                    include: {
                        location_direction_departureTolocation: true,
                        location_direction_destinationTolocation: true,
                    },
                },
            },
        });
    }

    async getAvailableFlights() {
        const flights = await PrismaService.flight.findMany({
            select: {
                id: true,
                disponibility: true,
                _count: {
                    select: {
                        ticket: true,
                    },
                },
            },
        });

        const flightsId = flights
            .filter((flight) => flight._count.ticket < flight.disponibility)
            .map((flight) => flight.id);

        return await PrismaService.flight.findMany({
            where: {
                id: {
                    in: flightsId,
                },
            },
            include: {
                flight_option: true,
                direction_directionToflight: {
                    include: {
                        location_direction_departureTolocation: true,
                        location_direction_destinationTolocation: true,
                    },
                },
            },
        });
    }
}

export default new FlightService();
