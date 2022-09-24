import { order } from "@prisma/client";

export function parseOrderToDTO(order: order) {
    return {
        id: order.id
        
    }
}