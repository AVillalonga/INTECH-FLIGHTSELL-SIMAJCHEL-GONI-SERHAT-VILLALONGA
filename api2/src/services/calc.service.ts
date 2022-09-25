import { flight_option } from "@prisma/client";

class CalcService {
    calcTicketOption(acc: number, flight_option: flight_option) {

        console.log(`==== ${acc} ${flight_option.value_type} | ${flight_option.value}`)

        const value = parseFloat(flight_option.value);

        if (flight_option.name === "AR") acc = acc * 2;

        switch (flight_option.value_type) {
            // Add
            case 1:
                return acc + value;
            case 2:
                return acc + (acc * value) / 100;
            case 3:
                return acc - value;
            case 4:
                return acc - (acc * value) / 100;
            default:
                throw Error(
                    "**************************************************"
                );
        }
    }

    sortFlightOption(a:flight_option, b: flight_option) {
        if([1,3].includes(a.value_type) && [1,3].includes(b.value_type)) {
            return 0
        } else if([1,3].includes(a.value_type)) {
            return 1;
        } else if([1,3].includes(b.value_type)) {
            return -1;
        } else {
            return 0
        }
    }
}

export default new CalcService();
