# MQTT2X

## 特性

一个 mqtt 桥接其他服务的工具包，提供或即将提供以下特性：

- 支持 mqtt 桥接到 mqtt、kafka 等其他消息队列

- 支持 mqtt 桥接到 http、tcp 等服务

- 支持使用 jsonata 配置对 JSON 格式数据进行转换

## 快速开始

```
npm run test
```

## 配置规则

修改 src/test.ts 示例中的规则配置，重新运行可以验证结果

```
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
```

## 编写 jsonata 表达式

示例消息：

```
{
    "topic":"testtopic/123",
    "payload":{
        "list":[
            {
                "value":4
            },
            {
                "value":7
            },
            {
                "value":13
            }
        ],
        "key":100
    }
}
```

你需要基于示例消息的结构编写对应的 jsonata 表达式，即使用 `$.topic`和`$.payload` 可以分别拿到 MQTT 消息中的 topic 和 payload