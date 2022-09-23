import { PrismaClient } from "@prisma/client";

export class FlightService {
    prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async addFlight(
        reference: string,
        price: string,
        disponibility: number,
        departure_name: string,
        destination_name: string,
        origin_name = "local",
        options: any[] = [],
    ) {
        departure_name = departure_name.toUpperCase();
        destination_name = destination_name.toUpperCase();

        const findOrCreateLocation = async (name: string) => {
            let location = await this.prisma.location.findUnique({
                where: { name },
            });

            if (location === null) {
                console.log(location);
                location = await this.prisma.location.create({
                    data: { name },
                });
            }

            return location;
        };

        const departure = await findOrCreateLocation(departure_name);
        const destination = await findOrCreateLocation(destination_name);

        await this.prisma.flight.create({
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
                    create: [
                        { 
                            name: 'AR',
                            value_type: 4,
                            value: '5'
                        },
                        {
                            name: 'First Class',
                            value_type: 2,
                            value: '150'
                        },
                        ...options
                    ]
                },
            },
            include: {
                flight_origin: true,
                flight_option: true,
                direction_directionToflight: true,
            },
        });
    }
}