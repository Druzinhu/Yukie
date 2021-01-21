module.exports = {
    aliases: 'retomar',
    async execute (yukie, message, args) {
        const queue = yukie.queues.get(message.guild.id);
        const memberVoiceChannel = message.member.voice.channel;
        const voiceChannel = message.guild.me.voice.channel;
        
        if (!memberVoiceChannel) return message.queue.send("not_connected");
        if (!voiceChannel) return message.queue.send("bot_not_connected");
        if (voiceChannel && memberVoiceChannel.id !== voiceChannel.id) return message.queue.send("different_connection");
        if (!queue) return message.queue.send("no_queue");

        if (!queue.paused) return message.channel.send('**❌ Não há nenhuma música pausada!**');

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