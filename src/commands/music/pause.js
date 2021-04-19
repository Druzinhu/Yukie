module.exports = {
    aliases: 'pausar',
    async execute (yukie, message, args) {
        const queue = yukie.queues.get(message.guild.id);
        const voiceChannel = message.member.voice.channel;
        const meVoiceChannel = message.guild.me.voice.channel;

        if (!voiceChannel) return;
        if (!queue) return message.yukieReply('blocked', "no_queue");
        if (voiceChannel !== meVoiceChannel) return message.yukieReply('x', "different_connection"); 

        if (queue.paused) {
            return message.channel.send('**❌ A música já está pausada!**');
        }

        queue.connection.dispatcher.pause();
        queue.paused = true;
        if (meVoiceChannel.members.filter(u => !u.user.bot).size > 1) message.channel.send(`**▶️ Música pausada** por ${message.author}`);
        else message.channel.send(`**▶️ Música pausada**`);
    }
}

module.exports.help = {
    category: 'music',
    description: 'Pausa a música que está tocando',
    usage: ''
}