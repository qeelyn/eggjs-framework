'use strict';
const Service = require('egg').Service;
const nodemailer = require('nodemailer');

class MailerService extends Service {

  // 初始化发送对象
  constructor(ctx) {
    ctx.transporter = nodemailer.createTransport({
      host: ctx.app.config.mailer.host,
      port: ctx.app.config.mailer.port,
      secure: true,
      auth: {
        user: ctx.app.config.mailer.user,
        pass: ctx.app.config.mailer.pass,
      },
    });
    super(ctx);
  }

  /**
     * 发送邮件
     * @param {String|Array} to        发送地址  string:'xxx1,xx2'
     * @param {String} title     文件标题
     * @param {String} text      文件内容
     * @param {String} html      文件html内容  使用html  text就无效
     * @return {*} 发送结果
     */
  async send(to, title, text, html) {
    const { ctx, config } = this;
    return await ctx.transporter.sendMail({
      from: config.mailer.user,
      to,
      subject: title,
      text,
      html,
    });
  }

}

module.exports = MailerService;
