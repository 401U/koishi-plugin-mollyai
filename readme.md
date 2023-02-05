# koishi-plugin-mollyai

[![npm](https://img.shields.io/npm/v/koishi-plugin-mollyai?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-mollyai) ![QQ群474722516](https://img.shields.io/badge/QQ群-474722516-blue) [![Kook](https://img.shields.io/badge/Kook-4o1.to-green)](https://4o1.to/kook)

为 koishi 调用茉莉机器人 API

> 使用推荐代码 `401` 开通开发版会员有八折优惠哦✨

## 响应条件

在以下条件下，插件会调用茉莉云机器人 API 并返回回复：

1. 非机器人消息
2. 提及了机器人名称或 `@` 了机器人

## 配置参考

|参数|说明|取值|备注|
|:---:|:---:|:---:|:---:|
|apiKey|ApiKey|`string`| |
|apiSecret|ApiSecret |`string`| |
|botName|机器人名称|`string`| 聊天中提及此名称会触发回复 |

## 特别鸣谢

- [茉莉云](https://mly.app/)
- [Koishi.js](https://koishi.chat)
