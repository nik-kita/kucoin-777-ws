import { WebSocket as TWs } from 'ws';
import {
    TWsMarketTickerSub, WsSubjectEnum, WsSubscriptionTypeEnum, WsTopicEnum,
} from '@nik-kita/kucoin-777-ws-types';

export class WsSubscriber {
    constructor(private id: string, private ws: TWs) { }

    subscribe(subscribeType: WsSubscriptionTypeEnum): Record<WsSubjectEnum, (...args: any[]) => unknown> {
        const { id, ws } = this;

        return {
            'account.balance': function () {
                throw new Error('===ERROR=not=implemented=yet===');
            },
            'debt.ratio': function () {
                throw new Error('===ERROR=not=implemented=yet===');
            },
            'funding.update': function () {
                throw new Error('===ERROR=not=implemented=yet===');
            },
            'order.done': function () {
                throw new Error('===ERROR=not=implemented=yet===');
            },
            'order.open': function () {
                throw new Error('===ERROR=not=implemented=yet===');
            },
            'order.update': function () {
                throw new Error('===ERROR=not=implemented=yet===');
            },
            'position.status': function () {
                throw new Error('===ERROR=not=implemented=yet===');
            },
            'trade.candles.update': function () {
                throw new Error('===ERROR=not=implemented=yet===');
            },
            'trade.l2update': function () {
                throw new Error('===ERROR=not=implemented=yet===');
            },
            'trade.l3match': function () {
                throw new Error('===ERROR=not=implemented=yet===');
            },
            'trade.snapshot': function () {
                throw new Error('===ERROR=not=implemented=yet===');
            },
            'trade.ticker': function (coins?: string[]) {
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
