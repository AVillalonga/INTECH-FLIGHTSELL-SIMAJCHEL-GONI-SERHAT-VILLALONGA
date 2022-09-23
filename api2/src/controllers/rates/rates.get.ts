import { PrismaClient } from "@prisma/client";

export async function rates(req: any, rep: any) {
    const prisma = new PrismaClient();

    rep.send({
        rates: prepareRates(await prisma.eur_rate.findMany({}))
    });
}

function prepareRates(incoming:any[]) {    
    let rates = incoming[0];
    let ratesArray : Array<{ name: string, rate: string}>= [];
    Object.keys(rates).forEach(function (key) {
        if (key.length === 3) {
            ratesArray.push({name: key, rate: rates[key]});
        }
    });
    return ratesArray

}