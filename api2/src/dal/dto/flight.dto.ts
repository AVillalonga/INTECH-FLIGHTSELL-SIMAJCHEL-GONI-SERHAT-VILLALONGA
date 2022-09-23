
export function getFlightsDTO(flights:any[]) {    
    return flights.map(flight => {
        return {
            reference: flight.reference,
            price: flight.price,
            disponibility: flight.disponibility,
            direction: flight.direction,
            departure: flight.direction_directionToflight.location_direction_departureTolocation.name,
            destination: flight.direction_directionToflight.location_direction_destinationTolocation.name,
            options: flight.flight_option,
            origin: "local"
        }
    })
}

export function getFlightsDTOFromBroker(flights:any[]) {
    return flights.map(flight => {
        return {
            reference: flight.id,
            price: flight.price,
            disponibility: flight.total_seats,
            direction: flight.arrival.name,
            departure: flight.departure,
            destination: flight.arrival,
            options: flight.available_options,
            origin: flight.tenant
        }
    })
}