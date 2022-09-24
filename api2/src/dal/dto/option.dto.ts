import { flight_option } from "@prisma/client";

export function parseOptionToDTO(option: flight_option) {
    return {
        flight: option.flight,
        name: option.name,
        value: option.value,
        value_type: option.value_type,
    }
}