import { Context, Schema, Session, h } from 'koishi'

export const name = 'mollyai'

export interface Config {
  apiKey: string
  apiSecret: string
  botName: string
  replyAt: boolean
}

interface ApiData{
  content: string
  typed: number
  remark: string
}

interface ApiResponse{
  code: string
  message: string
  plugin: string
  data?: Array<ApiData>
}

const api_url: string = 'https://api.mlyai.com/reply'
const asset_url: string = 'https://files.molicloud.com/'

export const schema = Schema.object({
  apiKey: Schema.string().description('茉莉云的 Api key').required(),
  apiSecret: Schema.string().role('secret').required(),
  botName: Schema.string().description('机器人名称, 提及此名称后会触发回复, 为空则跳过').required(),
  replyAt: Schema.boolean().description('是否在at机器人后触发回复').default(true),
})

/**
 * 检查是否应该让机器人回复, 返回要让机器人回复的消息，如果不需要回复，则返回null
 * @param {Context} ctx 上下文
 * @param {Session} session 会话
 * @param {Config} config 配置
**/
function shouldReply(ctx: Context, session: Session<never, never>, config: Config){
  // 发言人不是机器人，同时发言提及了机器人名称或@了机器人时，需要回复
  if(ctx.bots[session.uid]) { // 发言人是机器人
    return null
  } else if (session.parsed.appel && config.replyAt) { // at了机器人且开启了at回复
    return session.parsed.content
  } else if(config.botName.trim() !== '' && session.content.includes(config.botName)) { // 提及了机器人名称
    return session.content.replace(RegExp(`^${config.botName}[, ，]+`), '')
  }
  return null
}

/**
 * 处理茉莉云 api 响应并在聊天中回复消息
 * @param ctx 上下文
 * @param session 会话
 * @param response api响应
 */
async function handleResponse(ctx: Context, session: Session<never, never>, response: ApiResponse) {
  if(response.code === '00000'){
    ctx.logger('mollyai').debug('收到 api 响应: ' + JSON.stringify(response))
    response.data.forEach( async reply => {
      ctx.logger('mollyai').info(`API -> ${session.username}: ${reply.content}`)
      switch (reply.typed) {
        case 1: // text
        case 8: //json
          await session.sendQueued(reply.content)
          break
        case 2: // image
          await session.sendQueued(h.image(asset_url + reply.content));
          break
        case 4: // audio
          await session.sendQueued(h.audio(asset_url + reply.content))
          break
        case 3: //document
        case 9: // other file
          await session.sendQueued(h.file(asset_url + reply.content))
          break
        default:
          break
      }
    })
  }else if(response.code === 'C1001'){
    ctx.logger('mollyai').info('接口调用到达上限')
    await session.sendQueued('今天累了呢，明天再聊吧🥱')
  }else{
    ctx.logger('mollyai').warn('未知响应: ' + response.message)
  }
}

export function apply(ctx: Context, config: Config) {
  // 允许管理员通过指令查看茉莉云的设置
  ctx.command('茉莉云设置', {authority: 4}).action(() => {
    return `API key: ${config.apiKey}\nAPI secret: ${config.apiSecret}`
  })
  const http = ctx.http.extend({
    headers: {
      'Api-Key': config.apiKey,
      'Api-Secret': config.apiSecret,
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })

  // 监听聊天信息并按需回复
  ctx.middleware(async (session, next) => {
    const parsedContent = shouldReply(ctx, session, config)
    if(parsedContent === null) {
      ctx.logger('mollyai').debug('收到消息，但是不应该回复')
      return next()
    }
    let requestData = JSON.stringify({
      content: parsedContent.trim(),
      type: session.subtype === 'group' ? 2 : 1,
      from: session.userId,
      fromName: session.username,
      to: session.guildId,
      toName: session.guildName
    })
    ctx.logger('mollyai').debug("发起请求: " + requestData)
    ctx.logger('mollyai').info(`API <- ${session.username}: ${parsedContent.trim()}`)
    http.post(api_url, requestData).then(response=>{
      // console.log(response)
      handleResponse(ctx, session, response)
    }).catch(error =>{
      ctx.logger('mollyai').error(error)
    })
    return
  })
}
