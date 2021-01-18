module.exports = {
    aliases: 'entrar',
    async execute(yukie, message) {
        const queue = yukie.queues.get(message.guild.id)

        if (queue) {
            const membersize = message.guild.me.voice.channel.members.filter(m => !m.user.bot).size;

            if (membersize == 0) {
                queue.connection.disconnect();

                message.member.voice.channel.join();
                queue.dispatcher.resume();
            }
            else /*if (membersize > 0)*/ return;
        }
        else if (!queue) {
            const queueDelete = yukie.timeout.get(`${message.guild.id}_queueDelete`)

            if (queueDelete) {
                message.member.voice.channel.join();
            }
        }
    }
}

module.exports.help = {
    category: 'music',
    description: 'Faz com que o bot entre no mesmo canal de voz que você',
    usage: ''
}