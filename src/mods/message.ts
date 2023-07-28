import * as jsonata from 'jsonata';

export type Message = {
  topic: string;
  payload: object;
};

export type Query = {
  topicExpression: string;
  payloadExpression: string;
};

interface DataConversion {
  (rawMessage: Message, query: Query): Promise<Message>;
}

export const dataConversion: DataConversion = async function (
  rawMessage,
  query
) {
  const expression = jsonata(`{"topic":$string(${query.topicExpression}),"payload":$string(${query.payloadExpression})}`);

  const newMessage: Message = await expression.evaluate({
    topic: rawMessage.topic,
    payload: rawMessage.payload,
  });

  return newMessage;
};
