import { PrismaService } from "./prisma.service.js";
import { default as axios } from "axios";

class FlightRemoteService {
    sourceUrl: string = process.env["REMOTE_URL"]!;
    sourceKey: string = process.env["REMOTE_KEY"]!;

    async fetchRemotePlanes(): Promise<any[]> {
        try {
            const response = await axios.get(this.sourceUrl + "/flights");
            return response.data.map(this.parsePlanesAFlightDTO);
        } catch (err) {
            console.log(
                `[flight remote service] Cannot fetch flights from '${this.sourceUrl}'`
            );
            return [];
        }
    }

    parsePlanesAFlightDTO(flight: any) {
        return {
            reference: flight.id,
            price: flight.price,
            disponibility: flight.total_seats,
            departure: flight.departure,
            destination: flight.arrival,
            options: flight.available_options,
            origin: flight.tenant,
        };
    }

    async pushLocalPlanes() {
        await PrismaService.flight.findMany({
            select: {
                reference: true,
                price: true,
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
            },
        });

        // const payload = {
        //     provider_key: this.sourceKey,
        //     flights: [
        //         {
        //             tenant: "GROUPE 4 POINT BONUS",
        //             departure: "CDG",
        //             arrival: "DTW",
        //             internal_code: "code2",
        //             available_options: [
        //                 {
        //                     name: "option1",
        //                     code: "opt1",
        //                     price: 50,
        //                 },
        //             ],
        //             stop_overs: ["JFK"],
        //             total_seats: 200,
        //             price: 300,
        //         },
        //     ],
        // };
    }
}

export default new FlightRemoteService();
