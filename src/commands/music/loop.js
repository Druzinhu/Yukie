module.exports = {
    aliases: 'l repeat',
    async execute(yukie, message) {
        const queue = yukie.queues.get(message.guild.id);
        if (!queue) return message.yukieReply('blocked', 'no_queue');

       queue.loop.song = !queue.loop.song;
       message.channel.send(`**🔁 Loop da música ${queue.loop.song ? 'ativado' : 'desativado'}**`);
    }
}

module.exports.help = {
    category: 'music',
    description: '',
    usage: '',
}