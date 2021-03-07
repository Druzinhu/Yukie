const { Message } = require('discord.js');

const emojis = {
    discord: "<:discord:797077496432164886>",
    blocked: '🚫',
    x: '❌',
}

module.exports = class yukieReply {
    static start() {
        Message.prototype.yukieReply = function send(emoji, message, ...args) {
            emoji = emojis[emoji];
            return this.channel.send(`${emoji ? emoji : '✨'} **|** ${this.author} ${message ? message : ''}`);
        }
    }
}