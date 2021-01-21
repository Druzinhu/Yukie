module.exports = {
    aliases: 'sair',
    async execute (yukie, message, args) {
        const queue = yukie.queues.get(message.guild.id);
        const voiceChannel = message.member.voice.channel;
        const meVoiceChannel = message.guild.me.voice.channel;

        if (!meVoiceChannel) return message.queue.send("bot_not_connected");
        if (voiceChannel !== meVoiceChannel || !voiceChannel) return message.queue.send("different_connection")

        message.channel.send('**📤 Deconectando...**');

        if (queue) { 
            queue.connection.disconnect();
            return yukie.queues.delete(message.guild.id);
        }

        voiceChannel.leave();
    }
}

module.exports.help = {
    category: 'music',
    description: 'Faz com que o bot se desconecte do canal de voz',
    usage: ''
}

