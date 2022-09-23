import { PrismaClient } from "@prisma/client";
import { getFlightsDTO } from "../../dal/dto/flight.dto.js";
import { getRemotePlanesDTO } from "../../controllers/flight/flights.remote.js"

export const flightsSchema = {
    response: {
        200: {
            type: "object",
            properties: {
                flights: { type: "array" },
            },
        },
    },
};

export async function flights(req: any, rep: any) {
    const prisma = new PrismaClient();

    rep.send({
        flights: [...getFlightsDTO(await prisma.flight.findMany({})), ...(await getRemotePlanesDTO())]
    });
}
