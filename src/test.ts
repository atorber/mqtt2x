import { RawMessage, Query, dataConversion } from "./mods/message";
import * as mqtt from 'mqtt'
import { v4 } from 'uuid'

const rawMessage: RawMessage = {
    topic: 'abc/bcd',
    payload: '{"list":[{"value":4},{"value":7},{"value":13}],"key":100}',
};

const query: Query = {
    topicExpression: 'payload.key',
    payloadExpression: 'payload',
};

(async () => {
    const result = await dataConversion(rawMessage, query);
    console.log(result);
})();

// 使用用户名和密码方式连接二公司MQTT
const HOST = '0.0.0.0'
const PORT = 1883
const optionsBaetyl = {
    host: HOST,
    username: '',
    password: '',
    port: PORT,
    clientId: v4()
}

const baetylCleint = mqtt.connect(optionsBaetyl)

const propertySub = `property/post`
const d2cResponseSub = `response/d2c`

baetylCleint.on('connect', function () {
    console.log('baetylCleint客户端连接成功')

    baetylCleint.subscribe(propertySub, function (err) {
        if (!err) {
            console.debug('代理服务订阅属性消息成功:', propertySub)
        } else {
            console.debug('代理服务订阅属性消息失败:', propertySub)
        }
    })
    baetylCleint.subscribe(d2cResponseSub, function (err) {
        if (!err) {
            console.debug('代理服务订阅属性消息成功:', d2cResponseSub)
        } else {
            console.debug('代理服务订阅属性消息失败:', d2cResponseSub)
        }
    })

})

baetylCleint.on('disconnect', async function () {
    baetylCleint.reconnect()
})

baetylCleint.on('error', async function (err) {
    console.log('代理服务客户端连接错误', err)
})

baetylCleint.on('message', async function (topic, message) {
    console.log('从代理服务订阅到的消息：')
    console.log(topic, message.toString())
    const rawMessage: RawMessage = {
        topic,
        payload: message.toString(),
    };
    const result = await dataConversion(rawMessage, query);
    console.log(result);
})
