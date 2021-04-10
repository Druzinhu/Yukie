module.exports = {
    aliases: 'limpar',
    async execute(yukie, message, args) {
        const number = args[0];
        if (!args[0]) message.yukieReply('x', 'Ecolha um valor de 1 à 100');
        
        const msg = await message.channel.messages.fetch({ limit: number });
        const deleted = await message.channel.bulkDelete(msg, true);

        if (number - deleted.size === 0) {
            message.yukieReply('', 'O canal foi limpo.');
        } else if (msg.size - deleted.size === 0) {
            message.yukieReply('', 'O canal foi limpo.');
        } else {
            if (msg.size - deleted.size === 1) message.yukieReply('', `**1 mensagem não foi deleteda** por ter sido enviada à mais de 14 dias (2 semanas).`);
            else message.yukieReply('', `Cerca de **${msg.size - deleted.size} mensagens não puderam ser deletadas** por terem sido enviadas à mais de 14 dias (2 semanas).`)
        }
    }
}

module.exports.help = {
    category: 'moderation',
    description: 'Excluí o valor especificado de mensagens',
    usage: `número de 1 à 100`
  }