import orderService from "../../services/order.service.js";

export async function calc(req: any, rep: any) {
    const { flights } = req.body;
    const tickets = await orderService.createTicketsData(flights);
    const total = tickets.reduce((acc, next) => acc + parseFloat(next.price), 0);

    rep.send({
        total,
        tickets
    });
}
