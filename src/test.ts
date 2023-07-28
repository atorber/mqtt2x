import { RawMessage, Query, dataConversion, Rule, Message } from "./mods/message";
import * as mqtt from 'mqtt'
import { v4 } from 'uuid'

const rule: Rule = {
    source: 'testtopic/#', //数据来源topic，支持通配符
    compute: {
        type: "json", //固定字符串，目前仅支持json
        filter: ``, //过滤条件，jsonata表达式
        query: {
            topicExpression: `$.topic`, //目标格式的topic表达式
            payloadExpression: `$.payload`, //目标格式的topic表达式
        },
    },
    destinations: [''], //数据目的地，暂未支持
};

// const rawMessage: RawMessage = {
//     topic: 'testtopic/123',
//     payload: '{"list":[{"value":4},{"value":7},{"value":13}],"key":100}',
// };

// (async () => {
//     const result = await dataConversion(rawMessage, rule);
//     if (result && result.topic) {
//         console.log('result:', result);
//     }
// })();

const mqttOptions = {
    host: 'broker.emqx.io',
    username: '',
    password: '',
    port: 1883,
    clientId: v4()
}

const mqttCleint = mqtt.connect(mqttOptions)

// 建立连接并订阅数据源
mqttCleint.on('connect', function () {
    console.log('数据源MQTT客户端连接成功')

    mqttCleint.subscribe(rule.source, function (err) {
        if (!err) {
            console.debug('订阅数据源成功')
        } else {
            console.debug('订阅数据源失败')
        }
    })

})

// 断开连接时重试连接
mqttCleint.on('disconnect', async function () {
    mqttCleint.reconnect()
})

// 连接报错
mqttCleint.on('error', async function (err) {
    console.log('代理服务客户端连接错误', err)
})

// 接收和处理消息
mqttCleint.on('message', async function (topic, message) {
    // console.log('从代理服务订阅到的消息：')
    // console.log(topic,'\n', message.toString())
    const rawMessage: RawMessage = {
        topic,
        payload: message.toString(),
    };
    const result = await dataConversion(rawMessage, rule);

    if (result && result.topic) {
        console.log('转换成功:', JSON.stringify(result));
    }
})
