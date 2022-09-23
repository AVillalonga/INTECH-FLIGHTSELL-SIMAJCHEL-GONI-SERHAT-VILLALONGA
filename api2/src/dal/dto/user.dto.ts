import { PrismaClient } from "@prisma/client";
/**
     * Return customer (id) if exists and match with DB or create it
     * @param {*} name 
     * @param {*} mail 
     * @returns 
     */
 export async function createUser(name:string, mail:string) {
    const prisma = new PrismaClient();
    const password ="123"
    const user = await prisma.user.findUnique({
        where: { mail },
    });

    console.log(user);

    if (user === null) {
        const user = await prisma.user.create({
            data: { name, mail, password },
        });
        return user.id;
    } else {
        if (user.password === password) {
            return user.id;
        } else {
            return null;
        }
    }
}