import { KucoinRequest } from '@nik-kita/kucoin-777-api';
import { WsChannelEnum } from '@nik-kita/kucoin-777-pub-sub-types';
import {
    WsPubTypeEnum, WsSubjectEnum, WsSubscriptionTypeEnum, WsTopicEnum,
} from '@nik-kita/kucoin-777-ws-types';
import { Redis as TRedis } from 'ioredis';
import { v4 } from 'uuid';
import Ws from 'ws';
import { WsSubscriber } from './subscriber';

type TMessage = {
  type: WsPubTypeEnum,
  subject?: WsSubjectEnum,
  topic?: WsTopicEnum,
}

export class KucoinWebsocket {
    private constructor(
    public pub: TRedis,
    private subscriber: WsSubscriber,
    ) { }

    public static async open(pub: TRedis) {
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

                pub.publish(`${WsChannelEnum.WS_TOPIC}${(message as Required<TMessage>).topic}`, data);
                pub.publish(`${WsChannelEnum.WS_SUBJECT}${(message as Required<TMessage>).subject}`, data);
            }).on('open', () => {
                const stopPingPong = setInterval(() => {
                    ws.send(`{ "id": "${id}", "type": "ping" }`);
                }, 30000);

                ws.on('close', () => {
                    clearInterval(stopPingPong);
                    pub.publish(WsChannelEnum.WS_MAIN, 'close');
                });
            });

        return new KucoinWebsocket(pub, new WsSubscriber(id, ws));
    }

    public subscribe(subject: WsSubjectEnum) {
        return this.subscriber.subscribe(WsSubscriptionTypeEnum.SUBSCRIBE)[subject];
    }

    public unsubscribe(subject: WsSubjectEnum) {
        return this.subscriber.subscribe(WsSubscriptionTypeEnum.UNSUBSCRIBE)[subject];
    }
}
