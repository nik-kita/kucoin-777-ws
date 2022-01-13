import Redis from 'ioredis';
import dotenv from 'dotenv';
import { KucoinWebsocket } from './kucoin-websocket';
import { PubSubChannel, PubSubToWs } from '@nik-kita/kucoin-777-pub-sub-types';

const { CLOSE, OPEN, SUBSCRIBE, UNSUBSCRIBE } = PubSubToWs;
let ku: KucoinWebsocket | null = null;
dotenv.config();

(async () => {
    const pub = new Redis({ db: 7 });
    const sub = pub.duplicate();

    await sub.subscribe(PubSubChannel.TO_WS);

    sub.on('message', (channel, data) => {
        const { _, ...message } = JSON.parse(data);

        if (_ === SUBSCRIBE) {
            ku?.subscribe(message.subject)(message.payload);
        } else if (_ === UNSUBSCRIBE) {
            ku?.unsubscribe(message.subject)(message.payload);
        } else if (_ === OPEN) {
            KucoinWebsocket.open(pub).then((kucoinWebSocket) => ku = kucoinWebSocket);
        } else if (_ === CLOSE) {
            ku?.close();
        }
    });
})();
