import { order } from "@prisma/client";

export function parseOrderIdToDTO(order: order) {
    return {
        id: order.id 
    }
}

export function parseOrderToDTO(order: any) {
    return {
        created_at: order.created_at,
        tickets: order.ticket.map((ticket: any) => {
            return {
                flight_id: ticket.flight,
                price: ticket.price,
                ticket_option: ticket.ticket_option,
                departure: ticket.flight_flightToticket.direction_directionToflight.location_direction_departureTolocation.name,
                destination: ticket.flight_flightToticket.direction_directionToflight.location_direction_destinationTolocation.name,
            }
        })

    }
}