import fastify from "fastify";

export default class CustomerService {
    prisma;

    constructor(prisma) {
        this.prisma = prisma;
    }

    /**
     * Return customer (id) if exists and match with DB or create it
     * @param {*} name 
     * @param {*} mail 
     * @param {*} password 
     * @returns 
     */
    async create(name, mail, password) {
        const customer = await this.prisma.customer.findUnique({
            where: { mail },
        });

        console.log(customer);

        if (customer === null) {
            const customer = await this.prisma.customer.create({
                data: { name, mail, password },
            });
            return customer.id;
        } else {
            if (customer.password === password) {
                return customer.id;
            } else {
                return null;
            }
        }
    }
}
