module.exports = {
    aliases: 'vol',
    async execute (yukie, message, args) {
        let vol = args.join(' ');
        const queue = yukie.queues.get(message.guild.id);
    
        if (!queue) return message.yukieReply('no_queue');
        if (!message.member.voice.channel) return message.yukieReply('not_connected');
        if (message.author.id !== queue.songs[0].author.id) {
            return message.yukieReply('x', 'Somente o usuário que requisitou a música pode definir o volume!');
        }
        if (isNaN(vol) || vol < 1 || vol > 100) {
            return message.yukieReply('blocked', '**O valor do volume deve ser entre 1 e 100!**');
        }

        vol = Math.round(vol);
        if (queue.connection.dispatcher) queue.connection.dispatcher.setVolumeLogarithmic(vol / 100);
        queue.volume = vol / 100;
        message.channel.send(`🔊 Volume definido como **${vol}**`);
    }
}

module.exports.help = {
    category: 'music',
    description: 'Define o volume da música',
    usage: `<1-100>`
}