import { WsSubjectEnum } from '@nik-kita/kucoin-777-ws-types';
import Redis from 'ioredis';

const { log } = console;

// eslint-disable-next-line no-shadow
export enum RedisChannelEnum {
  ROOT_WS = 'root:ws',
  WS_ROOT = 'ws:root',
}

// eslint-disable-next-line no-shadow
export enum RedisRootWsMessageEnum {
  OPEN = 'open',
  CLOSE = 'close',
  PAUSE = 'pause',
  CONTINUE = 'continue',
  EXIT = 'exit'
}

// eslint-disable-next-line no-shadow
export enum RedisWsRootMessageEnum {
  READY = 'ready'
}

export async function main() {
    const pub = new Redis({ db: 7 });
    const sub = pub.duplicate();

    await sub.subscribe(RedisChannelEnum.ROOT_WS);
    pub.publish(RedisChannelEnum.WS_ROOT, RedisWsRootMessageEnum.READY);
    sub.on('message', (channel: RedisChannelEnum.ROOT_WS, message: RedisRootWsMessageEnum) => {
        if (message !== RedisRootWsMessageEnum.OPEN) return;

        sub.on('message', (channel2: RedisChannelEnum.ROOT_WS, message2: WsSubjectEnum | RedisRootWsMessageEnum) => {
            if (message2 === WsSubjectEnum.TRADE_TICKER) {
                log(`${channel2}: ${message2}`);
            }
        });
    });
}
