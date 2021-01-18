module.exports = {
    aliases: 'retomar',
    async execute (yukie, message, args) {
        const queue = yukie.queues.get(message.guild.id);
        
        if (!message.member.voice.channel) return;
        if (message.member.voice.channel.id !== message.guild.me.voice.channel.id) return;
        if (!queue) return;

        if (!queue.paused) {
            return message.reply('não há nenhuma música pausada!');
        }

        queue.paused = false;
        queue.dispatcher.resume();
        message.channel.send(`⏸️ **Música despausada** por ${message.author}`);
    }
}

module.exports.help = {
    category: 'music',
    description: 'Despausa a música que está pausada',
    usage: ''
}