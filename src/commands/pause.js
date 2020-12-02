const Discord = require("discord.js");

module.exports = {
    aliase: 'pausar',
    help: '',
    async run (yukie, message, args) {
        const queue = yukie.queues.get(message.guild.id)
        const voiceChannel = message.member.voice.channel;
        
        if (!voiceChannel) return;
        if (message.guild.me.voice.channel && voiceChannel !== message.guild.me.voice.channel) return;
        if (!queue) {
            return //message.reply('não estou reproduzindo nenhuma música no momento')
        }
        if (queue.dispatcher.pausedSince !== null) {
            message.reply('a música já está pausada!')
        }
        queue.dispatcher.pause()
        message.channel.send(`▶️ **| Música pausada por** ${message.author}`)
        
    }
}