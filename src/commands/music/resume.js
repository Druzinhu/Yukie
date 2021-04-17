module.exports = {
    aliases: 'retomar',
    async execute (yukie, message) {
        const queue = yukie.queues.get(message.guild.id);
        const memberVoiceChannel = message.member.voice.channel;
        const voiceChannel = message.guild.me.voice.channel;
        
        if (!memberVoiceChannel) return message.yukieReply('blocked', "not_connected");
        if (!voiceChannel) return message.yukieReply('x', "bot_not_connected");
        if (voiceChannel && memberVoiceChannel.id !== voiceChannel.id) return message.yukieReply('x', "different_connection");
        if (!queue) return message.yukieReply('blocked', "no_queue");

        if (!queue.paused) return message.channel.send('**❌ Não há nenhuma música pausada!**');

        queue.connection.dispatcher.resume();
        queue.paused = false;
        message.channel.send(`⏸️ **Música despausada** por ${message.author}`);
    }
}

module.exports.help = {
    category: 'music',
    description: 'Volta a tocar a música pausada',
    usage: ''
}