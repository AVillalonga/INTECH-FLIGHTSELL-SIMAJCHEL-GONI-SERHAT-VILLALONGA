import flightRemoteService from "../../services/flight-remote.service.js";
import flightService from "../../services/flight.service.js";
import { parseFlightsToDTO } from "../../dal/dto/flight.dto.js";

export const flightsSchema = {
    response: {
        200: {
            type: "object",
            properties: {
                flights: { type: "array" },
            },
        },
    },
};

export async function flights(req: any, rep: any) {
    const localFlights = await flightService.getAvailableFlights();
    const remoteFlights = await flightRemoteService.fetchRemotePlanes();
    const flights = [...parseFlightsToDTO(localFlights), ...remoteFlights];
    rep.send({ flights });
}