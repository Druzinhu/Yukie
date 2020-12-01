module.exports = {
    aliase: 'retomar',
    help: '',
    async run (yukie, message, args) {
        const queue = yukie.queues.get(message.guild.id)
        const voiceChannel = message.member.voice.channel;
        
        if (!voiceChannel) return;
        if (message.guild.me.voice.channel && voiceChannel !== message.guild.me.voice.channel) return;
        if (!queue) {
            return/* message.reply('não estou reproduzindo nenhuma música no momento')
            .then(msg => {
                setTimeout(() => {
                    msg.delete()
                }, 30000)
            })*/
        }
        if (queue.dispatcher.pausedSince == null) {
            return message.reply('não há nenhuma música pausada!')
            .then(msg => {
                setTimeout(() => {
                    msg.delete()
                }, 30000)
            })
        }
         if (queue.pause_resume) queue.pause_resume.then(msg => msg.delete().catch(O_o => {}))
        queue.dispatcher.resume()
        queue.pause_resume = message.channel.send(`⏸️ **| Música despausada por** ${message.author}`)
    }
}
