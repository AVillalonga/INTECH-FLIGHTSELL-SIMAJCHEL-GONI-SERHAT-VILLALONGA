import { PrismaService } from "./prisma.service.js";
import flightService from "./flight.service.js";

class DBService {
    async initializeDatabase() {
        const flights = [
            {
                reference: "F-1",
                price: "1000",
                disponibility: 750,
                departure: "CDG",
                destination: "JFK",
                options: [{ name: "Champagne", value: "100", value_type: 1 }],
            },
            {
                reference: "F-2",
                price: "700",
                disponibility: 500,
                departure: "CDG",
                destination: "DTW",
            },
            {
                reference: "F-3",
                price: "300",
                disponibility: 250,
                departure: "JFK",
                destination: "DTW",
            },
            {
                reference: "F-4",
                price: "600",
                disponibility: 550,
                departure: "CDG",
                destination: "EWR",
            },
        ];

        if ((await PrismaService.flight.count({})) === 0) {
            console.log("[db service] Initializing flights...");

            for (const flight of flights) {
                await flightService.addFlight(
                    flight.reference,
                    flight.price,
                    flight.disponibility,
                    flight.departure,
                    flight.destination,
                    "local",
                    flight.options || undefined
                );
            }
        } else {
            console.log("[db service] Flights ready");
        }
    }
}

export default new DBService();
