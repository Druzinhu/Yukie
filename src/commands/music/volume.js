module.exports = {
    aliases: 'vol',
    async execute (yukie, message, args) {
        let vol = args.join(' ');
        const queue = yukie.queues.get(message.guild.id);
    
        if (!message.member.voice.channel) return;
        if (!queue) return message.yukieReply('blocked', "no_queue");
        if (message.author.id !== queue.songs[0].author.id) {
            return message.channel.send('Somente o usuário que requisitou a música pode definir o volume!');
        }
        if (isNaN(vol) || vol < 1 || vol > 100) {
            return message.channel.send('**O valor do volume deve ser entre 1 e 100!**');
        }
        vol = Math.round(vol)
        queue.dispatcher.setVolume(vol / 100);
        queue.volume = vol / 100;
        message.channel.send(`🔊 Volume definido como **${vol}**`);
    }
}

module.exports.help = {
    category: 'music',
    description: 'Define o volume da música',
    usage: `<1 - 100>`
}