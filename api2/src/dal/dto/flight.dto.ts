
export function getFlightsDTO(flights:any[]) {
    return flights.map(flight => {
        return {
            reference: flight.reference,
            price: flight.price,
            disponibility: flight.disponibility,
            direction: flight.direction
        }
    })
}

export function getFlightsDTOFromBroker(flights:any[]) {
    return flights.map(flight => {
        return {
            reference: flight.id,
            price: flight.price,
            disponibility: flight.seats,
            direction: flight.arrival.name
        }
    })
}