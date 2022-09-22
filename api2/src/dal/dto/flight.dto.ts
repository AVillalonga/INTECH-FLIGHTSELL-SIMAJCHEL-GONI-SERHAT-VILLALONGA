
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