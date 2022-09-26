import { default as axios } from "axios";

class FlightRemoteService {
    sourceUrl: string = process.env["REMOTE_URL"]!;

    async fetchRemotePlanes(): Promise<any[]> {
        try {
            const response = await axios.get(this.sourceUrl);
            return response.data.map(this.parsePlanesAFlightDTO);
        } catch (err) {
            console.log(`[flight remote service] Cannot fetch flights from '${this.sourceUrl}'`);
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
}

export default new FlightRemoteService();
