const { Message } = require('discord.js');
const queueMessages = require('../utils/music/queueMessages');
const emojis = require('../utils/emojis');

module.exports = class YukieReply {
    static init() {
        Message.prototype.yukieReply = function(emoji, message, ...args) {
            message = queueMessages[message] ? queueMessages[message] : message;
            emoji = emojis[emoji];
            return this.channel.send(`${emoji ? emoji : '✨'} **|** ${this.author} ${message ? message : undefined}`);
        }
    }
}
