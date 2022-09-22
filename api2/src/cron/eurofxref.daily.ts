import { PrismaClient } from "@prisma/client";
import { XMLParser } from "fast-xml-parser";
import { default as axios } from "axios";

export async function fetchEurofxref() {
    const prisma = new PrismaClient();

    const source = "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml";
    const response = await axios.get(source);
    const parser = new XMLParser({ ignoreAttributes: false });
    const body = parser.parse(response.data);
    const values = body["gesmes:Envelope"].Cube.Cube.Cube;



    values.forEach((value: any) => {
        console.log(value);
        const currency = value["@_currency"];
        const rate = value["@_rate"];

        console.log(`[NEW EUR RATE] ${currency} - ${rate}`);
        // prisma.eur_rate.create({ });
    });
}
