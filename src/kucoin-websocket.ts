import { KucoinRequest } from '@nik-kita/kucoin-777-api';
import { Redis as TRedis } from 'ioredis';
import { v4 } from 'uuid';
import Ws, { WebSocket as TWs } from 'ws';

type TMessage = {
  type: string,
  subject?: string,
  topic?: string,
}

export class KucoinWebsocket {
    private constructor(
    public pub: TRedis,
    public sub: TRedis,
    private ws: TWs,
    private id: string,
    ) { }

    public static async open(pub: TRedis, sub: TRedis) {
        const res = await KucoinRequest
            .POST['/api/v1/bullet-private']
            .exec();
        const id = v4();
        const { instanceServers, token } = res!;
        const [server] = instanceServers;
        const ws = new Ws(`${server.endpoint}?token=${token}&[id=${id}]`)
            .on('message', (data: string) => {
                const message = JSON.parse(data) as TMessage;

                if (message.type !== 'message') return;

                pub.publish(`ws:message:${(message as Required<TMessage>).subject}`, data);
            }).on('open', () => {
                const stopPingPong = setInterval(() => {
                    ws.send(`{ "id": "${id}", "type": "ping" }`);
                }, 30000);

                ws.on('close', () => {
                    clearInterval(stopPingPong);
                    pub.publish('ws:main', 'close');
                });
            });

        return new KucoinWebsocket(pub, sub, ws, id);
    }
}
