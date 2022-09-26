import { bookingFlightOfBroker } from "../../services/broker.service.js";


export async function createOrderBroker(req: any, rep: any) {
    if (typeof req.body === "string") {
        req.body = JSON.parse(req.body);
    }
    await bookingFlightOfBroker(req.body);
    rep.send("200: ok");
}
