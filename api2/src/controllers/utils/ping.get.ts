
export async function ping(req: any, rep: any) {
    rep.send('pong');
}