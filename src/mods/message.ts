import * as jsonata from 'jsonata';

export type RawMessage = {
    topic: string;
    params: object;
    rule:Rule
};

export type Message = {
    topic: string;
    payload: object;
};

export type Query = {
    topicExpression: string;
    payloadExpression: string;
};

type SinkType = "MQTT" | 'EXTERNAL_HTTP'

export type EXTERNAL_HTTP_ARGS = {
    name: string;
    address: string;
    authToken: string;
    expireTime: string;
    destinationId: string;
};

export type EXTERNAL_MQTT_ARGS = {
    host: string;
    username: string;
    password: string;
    port: number;
    clientId: string;
};

export type Sink = {
    id:string;
    type: SinkType;
    args: EXTERNAL_MQTT_ARGS | EXTERNAL_HTTP_ARGS;
}

type DataType = 'json'

export type Compute = {
    type: DataType;
    filter: string;
    query: Query;
}

export type Rule = {
    source: string;
    compute:Compute;
    destinations: string[];
}

interface DataConversion {
    (rawMessage: RawMessage): Promise<Message>;
}

export const dataConversion: DataConversion = async function (rawMessage) {
    try{
        const rule = rawMessage.rule
        const message: Message = {
            topic: rawMessage.topic,
            payload: rawMessage.params
        }
        if (rule.compute.filter) {
            const filterExpression = jsonata(rule.compute.filter);
            const isMatch: boolean = await filterExpression.evaluate(message);
            if (!isMatch) {
                console.debug('不符合过滤条件:', rawMessage.topic)
                return undefined
            }
        }
    
        const messageExpression = jsonata(`{"topic":$string(${rule.compute.query.topicExpression}),"payload":$string(${rule.compute.query.payloadExpression})}`);
    
        const newMessage: Message = await messageExpression.evaluate(message);
    
        return newMessage;
    }catch(e){
        console.debug('数据格式错误:', rawMessage.topic)
        return e
    }
};
