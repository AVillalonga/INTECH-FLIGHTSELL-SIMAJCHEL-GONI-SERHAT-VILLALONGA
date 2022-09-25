import { PrismaService } from "../services/prisma.service.js";
import flightService from "../services/flight.service.js";
import openapiService from "../services/openapi.service.js";

export async function syncOpenApiFlights() {
    const flightsRemote = await openapiService.getFlights();

    for (const flight of flightsRemote) {
        const flightOptions = await openapiService.getFlightOptions(
            flight.reference
        );
        const { reference, price, disponibility, departure, destination } =
            flight;
        const departureId = await PrismaService.location.findUnique({
            select: { id: true },
            where: { name: departure },
        });
        const destinationId = await PrismaService.location.findUnique({
            select: { id: true },
            where: { name: destination },
        });

        const isNewEntry = await flightService.addFlight(
            reference,
            price,
            disponibility,
            departure,
            destination,
            "openapi",
            flightOptions
        );
        if (isNewEntry) {
            console.log(`[ +new+ OpenAPI flight ] ${reference}`);
        } else {
            console.log(`[ =update= OpenAPI flight ] ${flight.reference}`);
            await PrismaService.flight.update({
                where: {
                    reference: flight.reference,
                },
                data: {
                    price,
                    disponibility,
                    direction_directionToflight: {
                        connectOrCreate: {
                            where: {
                                departure_destination: {
                                    departure: departureId?.id!,
                                    destination: destinationId?.id!,
                                },
                            },
                            create: {
                                departure: departureId?.id!,
                                destination: destinationId?.id!,
                            },
                        },
                    },
                },
            });
        }
    }

    // await PrismaService.flight.
}
