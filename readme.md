<div align="center">
  <div>
    <a href="https://koishi.chat/" target="_blank">
      <img width="80" src="https://koishi.chat/logo.png" alt="koishi-logo">
    </a>
    <img src="https://api.iconify.design/mi:add.svg" width="35" height="80">
    <a href="https://mlyai.com/" target="_blank">
      <img width="80" src="https://mlyai.com/favicon.jpg" alt="mollyai-logo">
    </a>
  </div>

<h1 id="koishi">Koishi-plugin-molly</h1>

[![npm](https://img.shields.io/npm/v/koishi-plugin-mollyai)](https://www.npmjs.com/package/koishi-plugin-mollyai) 
![QQ群474722516](https://img.shields.io/badge/QQ群-474722516-blue) 
[![Kook](https://img.shields.io/badge/Kook-4o1.to-green)](https://4o1.to/kook)

为 koishi 调用茉莉机器人 API

> ✨ 使用推荐代码 `401` 开通茉莉云会员有八折优惠哦 ✨

</div>

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
|replyAt|响应 `@`|`string`| 聊天中`@`机器人时会触发回复 |

## 特别鸣谢

[![赞助商](https://cdn.jsdelivr.net/gh/401U/static/sponsors/cn.svg)](https://4o1.to/afdian)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2F401U%2Fkoishi-plugin-mollyai.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2F401U%2Fkoishi-plugin-mollyai?ref=badge_shield)


## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2F401U%2Fkoishi-plugin-mollyai.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2F401U%2Fkoishi-plugin-mollyai?ref=badge_large)