import * as jsonata from 'jsonata';

export type RawMessage = {
    topic: string;
    payload: string;
};

export type Message = {
    topic: string;
    payload: object;
};

export type Query = {
    topicExpression: string;
    payloadExpression: string;
};
interface DataConversion {
    (rawMessage: RawMessage, query: Query): Promise<Message>;
}

export const dataConversion: DataConversion = async function (
    rawMessage,
    query
) {
    const message: Message = {
        topic: rawMessage.topic,
        payload: JSON.parse(rawMessage.payload)
    }
    const expression = jsonata(`{"topic":$string(${query.topicExpression}),"payload":$string(${query.payloadExpression})}`);

    const newMessage: Message = await expression.evaluate(message);

    return newMessage;
};
