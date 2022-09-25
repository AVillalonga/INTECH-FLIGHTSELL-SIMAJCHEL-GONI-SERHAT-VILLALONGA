import { PrismaService } from "./prisma.service.js";
import axios from "axios";

class OpenAPIService {
    dmyDate(date: Date = new Date(Date.now())) {
        return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    }

    async getFlights() {
        const dmY = this.dmyDate();
        const url = process.env["OPEN_API"]! + "/flights/" + dmY;
        console.log(`[openapi] new query '${url}'`);
        const response = await axios.get(url);
        return response.data.map(
            (flight: {
                flight: {
                    code: string;
                    departure: string;
                    arrival: string;
                    base_price: number;
                    plane: { total_seats: number };
                };
                availability: number;
            }) => {
                return {
                    reference: flight.flight.code,
                    disponibility: Number(flight.availability),
                    departure: flight.flight.departure,
                    destination: flight.flight.arrival,
                    price: String(flight.flight.base_price),
                };
            }
        );
    }

    async getFlightOptions(code: string) {
        const response = await axios.get(
            process.env["OPEN_API"]! + `/available_options/${code}`
        );
        return response.data.map(
            (option: { option_type: string; price: number }) => {
                return {
                    name: option.option_type,
                    value: String(option.price),
                    value_type: 1,
                };
            }
        );
    }

    async bookNow(ticketId: number) {
        const ticket = await PrismaService.ticket.findUnique({
            select: {
                price: true,
                ticket_option: {
                    select: {
                        flight_option_flight_optionToticket_option: {
                            select: {
                                name: true,
                                value: true,
                            },
                        },
                    },
                },
                order_orderToticket: {
                    select: {
                        created_at: true,
                        user_orderTouser: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                flight_flightToticket: {
                    select: {
                        direction_directionToflight: {
                            select: {
                                location_direction_departureTolocation: {
                                    select: { name: true },
                                },
                                location_direction_destinationTolocation: {
                                    select: { name: true },
                                },
                            },
                        },
                        reference: true,
                        price: true,
                    },
                },
            },
            where: { id: ticketId },
        });
        if (ticket) {
            const data = {
                flight: {
                    code: ticket.flight_flightToticket.reference,
                    departure:
                        ticket.flight_flightToticket.direction_directionToflight
                            .location_direction_departureTolocation.name,
                    arrival:
                        ticket.flight_flightToticket.direction_directionToflight
                            .location_direction_destinationTolocation.name,
                    base_price: parseFloat(ticket.flight_flightToticket.price),
                    plane: {
                        name: "",
                        total_seats: 1,
                    },
                },
                date: this.dmyDate(ticket.order_orderToticket.created_at),
                payed_price: parseFloat(ticket.price),
                customer_name: ticket.order_orderToticket.user_orderTouser.name,
                customer_nationality: "Unknow",
                options: ticket.ticket_option.map((tO) => {
                    return {
                        option_type:
                            tO.flight_option_flight_optionToticket_option.name,
                        price: parseFloat(
                            tO.flight_option_flight_optionToticket_option.value
                        ),
                    };
                }),
                booking_source: "FLIGHT SELL [GROUPE PAIR]",
            };

            const response = await axios.post(
                process.env["OPEN_API"]! + `/book`,
                data
            );

            if(response && response.data === "success") {
                response.data
                console.log(`[ +new booking+ openapi] '${data.customer_name}' (${data.flight.code} | ${data.payed_price})`);
            }
            
        }
    }
}

export default new OpenAPIService();
