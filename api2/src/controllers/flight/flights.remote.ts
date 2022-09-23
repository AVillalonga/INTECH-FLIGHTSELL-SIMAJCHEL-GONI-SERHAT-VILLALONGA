import { default as axios } from "axios";
import { getFlightsDTOFromBroker } from "../../dal/dto/flight.dto.js";

const remoteSource = "https://envp03dqrmbv29q.m.pipedream.net/"

export async function getRemotePlanesDTO() {
    const response = await axios.get(remoteSource);
    return getFlightsDTOFromBroker(response.data)
}

