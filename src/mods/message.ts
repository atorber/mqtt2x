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
    filterExpression?: string;
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
    if (query.filterExpression) {
        const filterExpression = jsonata(query.filterExpression);
        const isMatch: boolean = await filterExpression.evaluate(message);
        if (!isMatch) {
            console.debug('is not match the rlue')
            return
        }
    }

    const messageExpression = jsonata(`{"topic":$string(${query.topicExpression}),"payload":$string(${query.payloadExpression})}`);

    const newMessage: Message = await messageExpression.evaluate(message);

    return newMessage;
};
