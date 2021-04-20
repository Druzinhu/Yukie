module.exports = {
    aliases: 'parar',
    async execute (yukie, message, args) {
        const queue = yukie.queues.get(message.guild.id);
        const voiceChannel = message.member.voice.channel;
        const meVoiceChannel = message.guild.me.voice.channel;

        if (!voiceChannel) return;
        if (!queue) return message.yukieReply('blocked', "no_queue");
        if (voiceChannel !== meVoiceChannel) return message.yukieReply('x', "different_connection"); 

        message.react('✅');
        yukie.queues.delete(message.guild.id);
        if (queue.connection.dispatcher) queue.connection.dispatcher.destroy()
    }
}

module.exports.help = {
    category: 'music',
    description: 'Para de tocar as músicas na fila',
    usage: ''
}