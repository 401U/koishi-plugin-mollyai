"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apply = exports.schema = exports.name = void 0;
const koishi_1 = require("koishi");
exports.name = 'mollyai';
const api_url = 'https://api.mlyai.com/reply';
const asset_url = 'https://files.molicloud.com/';
exports.schema = koishi_1.Schema.object({
    apiKey: koishi_1.Schema.string().description('茉莉云的 Api key').required(),
    apiSecret: koishi_1.Schema.string().role('secret').required(),
    botName: koishi_1.Schema.string().description('机器人名称').required()
});
function shouldReply(ctx, session, config) {
    return !ctx.bots[session.uid] && (session.content.includes(config.botName) || session.parsed.appel);
}
async function handleResponse(ctx, session, response) {
    if (response.code === '00000') {
        ctx.logger('mollyai').info('api回复: ' + response.message);
        response.data.forEach(async (reply) => {
            ctx.logger('mollyai').info('处理消息' + reply.content);
            switch (reply.typed) {
                case 1: // text
                case 8: //json
                    await session.sendQueued(reply.content);
                    break;
                case 2: // image
                    await session.sendQueued((0, koishi_1.segment)('image', { url: asset_url + reply.content }));
                    break;
                case 4: // audio
                    await session.sendQueued((0, koishi_1.segment)('audio', { url: asset_url + reply.content }));
                    break;
                case 3: //document
                case 9: // other file
                    await session.sendQueued((0, koishi_1.segment)('file', { url: asset_url + reply.content }));
                    break;
                default:
                    break;
            }
        });
    }
    else if (response.code === 'C1001') {
        ctx.logger('mollyai').info('接口调用到达上限');
        await session.sendQueued('今天累了呢，明天再聊吧🥱');
    }
}
function apply(ctx, config) {
    ctx.command('茉莉云设置').action(() => {
        return `API key: ${config.apiKey}\nAPI secret: ${config.apiSecret}`;
    });
    const http = ctx.http.extend({
        headers: {
            'Api-Key': config.apiKey,
            'Api-Secret': config.apiSecret,
            'Content-Type': 'application/json;charset=UTF-8'
        }
    });
    ctx.middleware(async (session, next) => {
        if (!shouldReply(ctx, session, config)) {
            ctx.logger('mollyai').info('信息被忽略');
            return next();
        }
        ;
        let requestData = JSON.stringify({
            content: session.content,
            type: session.subtype === 'group' ? 2 : 1,
            from: session.userId,
            fromName: session.username,
            to: session.guildId,
            toName: session.guildName
        });
        ctx.logger('mollyai').info("发出请求: " + requestData);
        http.post(api_url, requestData).then(response => {
            // console.log(response)
            handleResponse(ctx, session, response);
        }).catch(error => {
            ctx.logger('mollyai').error(error);
        });
        return;
    });
}
exports.apply = apply;
