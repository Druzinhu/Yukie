const { Message } = require('discord.js');
const emotes = require('../utils/emojis');

module.exports = class yukieReply {
    static start() {
        Message.prototype.yukieReply = function send(emoji, message, ...args) {
            emoji = emotes[emoji];
            return this.channel.send(`${emoji ? emoji : '✨'} **|** ${this.author} ${message ? message : ''}`);
        }
    }
}