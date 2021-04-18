module.exports = {
    aliases: 'falar',
    async execute(yukie, message, args) {
        const msg = args.join(' ');
        const channel = message.mentions.channels.first();
        
        if (!message.member.hasPermission('ADMINISTRATOR')) return message.yukieReply('blocked', 'Você não possui permissão para executar este comando!');
        if (!msg) return message.yukieReply('x', 'Você deve escrever algo para que possa enviar aqui!');

        if (channel && args[0] === channel.toString() && channel.permissionsFor(yukie.user).has('SEND_MESSAGES')) {
            channel.send(`${msg.replace(channel, '')}\n\n*- ${message.author}*`)
            .catch(error => {
                console.log(error);
                message.channel.send(`Ocorreu um erro ao enviar a mensagem em **${channel.toString}**: \`${error}\``);
            });
        } else message.channel.send(`${msg}\n\n*- ${message.author}*`);
    }
}

module.exports.help = {
    category: 'moderation',
}