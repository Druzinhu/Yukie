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
            return /*message.reply('não estou reproduzindo nenhuma música no momento')
            .then(msg => {
                setTimeout(() => {
                    msg.delete()
                }, 30000)
            })*/
        }
        if (queue.dispatcher.pausedSince !== null) {
            message.reply('a música já está pausada!')
            .then(msg => {
                setTimeout(() => {
                    msg.delete()
                }, 30000)
            })
        }
         if (queue.pause_resume) queue.pause_resume.then(msg => msg.delete().catch(O_o => {}))
        queue.dispatcher.pause()
        queue.pause_resume = message.channel.send(`▶️ **| Música pausada por** ${message.author}`)
    }
}