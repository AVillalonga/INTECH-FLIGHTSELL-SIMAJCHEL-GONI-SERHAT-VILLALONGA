import flightRemoteService from "../../services/flight-remote.service.js";
import flightService from "../../services/flight.service.js";
import { parseFlightsToDTO } from "../../dal/dto/flight.dto.js";
// import { getRemotePlanesDTO } from "../../controllers/flight/flights.remote.js";

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
    const localFlights = await flightService.getFlights();
    const remoteFlights = await flightRemoteService.fetchRemotePlanes();
    const flights = [...parseFlightsToDTO(localFlights), ...remoteFlights];
    rep.send({ flights });
}

// await prisma.flight.findMany({
//     include: { flight_option:true,
//     direction_directionToflight:{
//         include: {
//             location_direction_departureTolocation: true,
//             location_direction_destinationTolocation: true
//         }
//     }}
// })
