import { WebSocket as TWs } from 'ws';
import {
    TWsMarketTickerSub, WsSubjectEnum, WsSubscriptionTypeEnum, WsTopicEnum,
} from '@nik-kita/kucoin-777-ws-types';

export class WsSubscriber {
    constructor(private id: string, public ws: TWs) { }

    subscribe(subscribeType: WsSubscriptionTypeEnum): Record<WsSubjectEnum, (...args: any[]) => unknown> {
        const { id, ws } = this;

        return {
            'account.balance': () => {
                throw new Error('===ERROR=not=implemented=yet===');
            },
            'debt.ratio': () => {
                throw new Error('===ERROR=not=implemented=yet===');
            },
            'funding.update': () => {
                throw new Error('===ERROR=not=implemented=yet===');
            },
            'order.done': () => {
                throw new Error('===ERROR=not=implemented=yet===');
            },
            'order.open': () => {
                throw new Error('===ERROR=not=implemented=yet===');
            },
            'order.update': () => {
                throw new Error('===ERROR=not=implemented=yet===');
            },
            'position.status': () => {
                throw new Error('===ERROR=not=implemented=yet===');
            },
            'trade.candles.update': () => {
                throw new Error('===ERROR=not=implemented=yet===');
            },
            'trade.l2update': () => {
                throw new Error('===ERROR=not=implemented=yet===');
            },
            'trade.l3match': () => {
                throw new Error('===ERROR=not=implemented=yet===');
            },
            'trade.snapshot': () => {
                throw new Error('===ERROR=not=implemented=yet===');
            },
            'trade.ticker': (coins?: string[]) => {
                const pubPayload: TWsMarketTickerSub = {
                    id,
                    type: subscribeType,
                    response: true,
                    topic: coins ? `${WsTopicEnum.MARKET_TICKER}${coins.join(',')}` : WsTopicEnum.MARKET_TICKER_ALL,
                };

                ws.send(JSON.stringify(pubPayload));
            },
            level2() {
                throw new Error('===ERROR=not=implemented=yet===');
            },
            orderChange() {
                throw new Error('===ERROR=not=implemented=yet===');
            },
            stopOrder() {
                throw new Error('===ERROR=not=implemented=yet===');
            },
            tick() {
                throw new Error('===ERROR=not=implemented=yet===');
            },
        };
    }
}
