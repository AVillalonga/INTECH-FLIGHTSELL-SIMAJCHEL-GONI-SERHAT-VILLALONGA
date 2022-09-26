import { flight } from "@prisma/client"
import { parseOptionToDTO } from "./option.dto.js"

export function parseFlightsToDTO(flights: flight[]): any[] {    
    return flights.map(flight => parseFlightToDTO(flight));
}

export function parseFlightToDTO(flight:flight|any): any {
    return {
        reference: flight.reference,
        price: flight.price,
        disponibility: flight.disponibility,
        departure: flight.direction_directionToflight.location_direction_departureTolocation.name,
        destination: flight.direction_directionToflight.location_direction_destinationTolocation.name,
        options: flight.flight_option.map(parseOptionToDTO),
        origin: flight.flight_origin.name
    }
}