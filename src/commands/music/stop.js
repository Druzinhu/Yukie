module.exports = {
    aliases: 'parar',
    async execute (yukie, message, args) {
        const queue = yukie.queues.get(message.guild.id);
        const voiceChannel = message.member.voice.channel;
        const meVoiceChannel = message.guild.me.voice.channel;

        if (!queue) return message.yukieReply("no_queue");
        if (!voiceChannel) return message.yukieReply("not_connected");
        if (voiceChannel !== meVoiceChannel) return message.yukieReply("different_connection"); 

        message.react('✅');
        yukie.queues.delete(message.guild.id);
        if (queue.connection.dispatcher) queue.connection.dispatcher.destroy()
    }
}

module.exports.help = {
    category: 'music',
    description: 'Para de tocar as músicas da fila',
    usage: ''
}