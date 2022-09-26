import { PrismaService } from "../../services/prisma.service.js";
import { parseOrderToDTO } from "../../dal/dto/order.dto.js";

export async function order(req: any, rep: any) {
    const { orderId: id } = req.params;
    let order = await PrismaService.order.findUnique({
        select: {
            created_at: true,
            ticket: {
                select: {
                    flight: true,
                    price: true,
                    ticket_option: {
                        select: {
                            flight_option_flight_optionToticket_option: {
                                select: {
                                    name: true,
                                    value: true,
                                    value_type: true,
                                },
                            },
                        },
                    },
                    flight_flightToticket: {
                        select: {
                            direction_directionToflight: {
                                select: {
                                    location_direction_departureTolocation : {
                                        select: {
                                            name: true
                                        }
                                    },
                                    location_direction_destinationTolocation: {
                                        select: {
                                            name: true
                                        }
                                    }
                                }
                            }                        
                        }
                    }
                },
            },
        },
        where: { id: Number(id) },
    });

    console.log(order);
    

    return parseOrderToDTO(order);
}
