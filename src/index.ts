import Redis from 'ioredis';
import dotenv from 'dotenv';
import TPubSub, { PubSubClient, PubSubFromServer, PubSubFromWs, } from '@nik-kita/kucoin-777-pub-sub-types';
import { KucoinWebsocket } from './kucoin-websocket';

dotenv.config();
(async () => {
    const pub = new Redis({ db: 7 });
    const sub = pub.duplicate();

    await sub.subscribe('to:ws:subscribe', 'to:ws:unsubscribe');

    sub.on('message', (channel, message) => {
        if (channel !== 'to:ws' && message !== 'open') return;

        KucoinWebsocket.open(pub)
            .then((kucoinWebsocket) => {
                sub.on('message', (channel2, message2) => {
                    if (channel2 === 'to:ws:subscribe') {
                        const { subject, data } = JSON.parse(message2);
                        kucoinWebsocket.subscribe(subject)(data);
                    } else if (channel2 === 'to:ws:unsubscribe') {
                        kucoinWebsocket.unsubscribe(JSON.parse(message2));
                    } else if (channel2 === 'to:ws') {
                        if (message2 === 'close') {
                            kucoinWebsocket.close();
                        }
                    }
                });
            });
    });
})();
