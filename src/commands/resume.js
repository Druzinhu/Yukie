module.exports = {
    aliase: 'retomar',
    help: '',
    async run (yukie, message, args) {
        const queue = yukie.queues.get(message.guild.id)
        
        if (!message.member.voice.channel) return;
        if (message.guild.me.voice.channel && message.member.voice.channel !== message.guild.me.voice.channel) return;
        if (!queue) return;

        if (queue.dispatcher.pausedSince === null) {
            return message.reply('não há nenhuma música pausada!')
        }
        queue.dispatcher.resume()
        message.channel.send(`**⏸️ | Música despausada por ${message.author}**`)
    }
}
