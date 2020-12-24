module.exports = {
    aliase: 'pausar parar',
    help: '',
    async run (yukie, message, args) {
        const queue = yukie.queues.get(message.guild.id)

        if (!message.member.voice.channel) return;
        if (!queue) { 
            return message.reply('não estou reproduzindo nenhuma música no momento!') 
        }
        if (message.member.voice.channel !== message.guild.me.voice.channel) return; 

        if (queue.dispatcher.pausedSince !== null) {
            message.reply('a música já está pausada!')
        }
        queue.dispatcher.pause()
        message.channel.send(`▶️ **Música pausada** por ${message.author}`)
    }
}