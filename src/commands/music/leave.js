module.exports = {
    aliases: 'sair',
    async execute (yukie, message, args) {
        const queue = yukie.queues.get(message.guild.id)

        if (!message.member.voice.channel) return;
        if (!queue) return;
        if (message.member.voice.channel !== message.guild.me.voice.channel) return;

        if (queue.msg !== null) queue.msg.then(m => m.delete().catch(O_o => {}))
        
        queue.connection.disconnect()
        yukie.queues.delete(message.guild.id)
    }
}

module.exports.help = {
    description: 'Faz com que o bot se desconecte do canal de voz',
    usage: ''
}

