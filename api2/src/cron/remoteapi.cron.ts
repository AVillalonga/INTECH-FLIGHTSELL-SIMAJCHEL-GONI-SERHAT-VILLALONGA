import { PrismaService } from "../services/prisma.service.js";
import axios from "axios";

export async function cronPushLocalPlanesToBroder() {
    const sourceUrl: string = process.env["REMOTE_URL"]!;
    const sourceKey: string = process.env["REMOTE_KEY"]!;

    const flights = await PrismaService.flight.findMany({
        select: {
            reference: true,
            price: true,
            disponibility: true,
            direction_directionToflight: {
                select: {
                    location_direction_departureTolocation: {
                        select: { name: true },
                    },
                    location_direction_destinationTolocation: {
                        select: { name: true },
                    },
                },
            },
            flight_option: {
                select: {
                    name: true,
                    value: true,
                },
            },
        },
        where: {
            flight_origin: {
                name: "local",
            },
        },
    });

    let increment = 0;

    const flightsPayload = flights.map((flight) => {
        console.log(
            `[flight remote service] synchronize ${increment}/${flights.length}`
        );
        increment = increment + 1;
        return {
            tenant: "GROUPE 666",
            departure:
                flight.direction_directionToflight
                    .location_direction_departureTolocation.name,
            arrival:
                flight.direction_directionToflight
                    .location_direction_destinationTolocation.name,
            internal_code: flight.reference,
            available_options: flight.flight_option.map((opt) => {
                return {
                    name: opt.name,
                    code: opt.name,
                    price: parseFloat(opt.value),
                };
            }),
            stop_overs: [], // TODO
            total_seats: flight.disponibility,
            price: parseFloat(flight.price),
        };
    });

    const payload = {
        provider_key: sourceKey,
        flights: flightsPayload,
    };

    try {
        await axios.post(sourceUrl + "/flights", payload);
    } catch (err) {
        console.error(err);
    }
}
