import { Message, Query, dataConversion } from "./mods/message";

const rawMessage: Message = {
    topic: 'abc/bcd',
    payload: {
        list: [
            { value: 4 },
            { value: 7 },
            { value: 13 }
        ],
        key: 100,
    },
};

const query: Query = {
    topicExpression: 'payload.key',
    payloadExpression: 'payload',
};

(async () => {
    const result = await dataConversion(rawMessage, query);
    console.log(result);
})();