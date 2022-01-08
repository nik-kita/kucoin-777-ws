import Redis from 'ioredis';
import { KucoinWebsocket } from './kucoin-websocket';

(async () => {
    const pub = new Redis({ db: 7 });
    const sub = pub.duplicate();

    await sub.subscribe('to:ws', 'to:ws:subscribe', 'to:ws:unsubscribe');

    sub.on('message', (channel, message) => {
        if (channel !== 'to:ws' && message !== 'open') return;

        KucoinWebsocket.open(pub)
            .then((kucoinWebsocket) => {
                sub.on('message', (channel2, message2) => {
                    if (channel2 === 'to:ws:subscribe') {
                        kucoinWebsocket.subscribe(JSON.parse(message2));
                    } else if (channel2 === 'to:ws:unsubscribe') {
                        kucoinWebsocket.unsubscribe(JSON.parse(message2));
                    } else if (channel2 === 'to:ws') {
                        kucoinWebsocket.close();
                    }
                });
            });
    });
})();
