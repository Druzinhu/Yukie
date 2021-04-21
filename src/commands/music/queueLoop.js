module.exports = {
    aliases: 'queuerepeat',
    async execute(yukie, message) {
        const queue = yukie.queues.get(message.guild.id);
        if (!queue) return message.yukieReply('no_queue');

       queue.loop.queue = !queue.loop.queue;
       message.channel.send(`**🔁 Loop da fila ${queue.loop.queue ? 'ativado' : 'desativado'}**`);
    }
}

module.exports.help = {
    category: 'music',
    description: 'Ativa e desativa o loop da fila',
    usage: '',
}