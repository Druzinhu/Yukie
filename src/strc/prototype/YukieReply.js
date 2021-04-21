const { Message } = require('discord.js');
const messages = require('./messages');
const emojis = require('./emojis');

module.exports = class YukieReply {
    static init() {
        Message.prototype.yukieReply = function reply(emoji, message, ...args) {
            if (messages[emoji]) {
                message = messages[emoji].replace(/<user>/g, this.author);
                return this.channel.send(message);
            } else {
                emoji = emojis[emoji];
                return this.channel.send(`${emoji ? emoji : '✨'} **|** ${this.author} ${message ? message : undefined}`);
            }
        }
    }
}
