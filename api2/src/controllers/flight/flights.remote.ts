import { default as axios } from "axios";
import { getFlightsDTOFromBroker } from "../../dal/dto/flight.dto.js";

const remoteSource = "http://URL:8000/flights"

export async function getRemotePlanesDTO() {
    try {
        const response = await axios.get(remoteSource);
        return getFlightsDTOFromBroker(response.data)
    } catch (error) {
        return []
    }
}

