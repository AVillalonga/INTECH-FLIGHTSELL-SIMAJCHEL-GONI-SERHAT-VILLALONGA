import { PrismaClient } from "@prisma/client";
import { XMLParser } from "fast-xml-parser";
import { default as axios } from "axios";

export async function fetchEurofxref() {
    const prisma = new PrismaClient();

    const source =
        "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml";
    const response = await axios.get(source);
    const parser = new XMLParser({ ignoreAttributes: false });
    const body = parser.parse(response.data);
    const values = body["gesmes:Envelope"].Cube.Cube.Cube;
    const daily = new Array<[string, string]>();

    values.forEach((rate: { "@_currency": string; "@_rate": string }) => {
        const c: string = rate["@_currency"];
        const r: string = rate["@_rate"];
        console.log(`[NEW EUR RATE] ${c} - ${r}`);
        daily.push([c, r]);
    });

    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    [now, yesterday].forEach(fmtDate);

    const record = await prisma.eur_rate.findMany({
        where: {
            created_at: {
                lte: yesterday,
                gte: now,
            },
        },
    });

    if (record.length > 0) {
        const fD = (cr: string) => daily.find((c) => c[0] === cr)![1];
        await prisma.eur_rate.create({
            data: {
                USD: fD("USD"),
                JPY: fD("JPY"),
                BGN: fD("BGN"),
                CZK: fD("CZK"),
                DKK: fD("DKK"),
                GBP: fD("GBP"),
                HUF: fD("HUF"),
                PLN: fD("PLN"),
                RON: fD("RON"),
                SEK: fD("SEK"),
                CHF: fD("CHF"),
                ISK: fD("ISK"),
                NOK: fD("NOK"),
                HRK: fD("HRK"),
                TRY: fD("TRY"),
                AUD: fD("AUD"),
                BRL: fD("BRL"),
                CAD: fD("CAD"),
                CNY: fD("CNY"),
                HKD: fD("HKD"),
                IDR: fD("IDR"),
                ILS: fD("ILS"),
                INR: fD("INR"),
                KRW: fD("KRW"),
                MXN: fD("MXN"),
                MYR: fD("MYR"),
                NZD: fD("NZD"),
                PHP: fD("PHP"),
                SGD: fD("SGD"),
                THB: fD("THB"),
                ZAR: fD("ZAR"),
            },
        });
    }
}

function fmtDate(date: Date) {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(1);
    date.setMilliseconds(0);
}
