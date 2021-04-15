module.exports = {
    aliases: 'pausar parar pause stop',
    async execute (yukie, message, args) {
        const queue = yukie.queues.get(message.guild.id);

        if (!message.member.voice.channel) return;
        if (!queue) return message.yukieReply('blocked', "no_queue");
        if (message.member.voice.channel !== message.guild.me.voice.channel) return message.yukieReply('x', "different_connection"); 

        if (queue.paused) {
            return message.channel.send('**❌ A música já está pausada!**');
        }

        queue.connection.dispatcher.pause();
        queue.paused = true;
        message.channel.send(`▶️ **Música pausada** por ${message.author}`);
    }
}

module.exports.help = {
    category: 'music',
    description: 'Pausa a música que está tocando',
    usage: ''
}