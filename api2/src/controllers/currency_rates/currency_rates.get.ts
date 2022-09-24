import { PrismaService } from "../../services/prisma.service.js";

export async function rates(req: any, rep: any) {

    const latestRate = await PrismaService.eur_rate.findFirst({
        orderBy: {
            created_at: 'desc'
        }
    });

    const rates = Object
        .entries(latestRate!)
        .filter(([key, value]) => !['id', 'created_at'].includes(key))
        .map(([key, value]) => { return { name: key, value } })

    rep.send({ rates });
}
