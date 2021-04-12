module.exports = {
    aliases: 'limpar',
    async execute(yukie, message, args) {
        const number = args[0];
        if (!args[0]) return message.yukieReply('x', 'Ecolha um valor de 1 à 100 para as mensagens à serem deletadas.');
        if (!message.guild.me.permissions.has('MANAGE_MESSAGES')) return message.yukieReply('blocked', '**Eu não tenho permissão para excluir mensagens!** Para mim poder excluir mensagens, eu preciso ter a permissão de **gerenciar mensagens**.');

        const msg = await message.channel.messages.fetch({ limit: number });
        const deleted = await message.channel.bulkDelete(msg, true);

        if (number - deleted.size === 0) {
            message.yukieReply('', 'O chat está limpo!');
        } else if (msg.size - deleted.size === 0) {
            message.yukieReply('', 'O chat está limpo!');
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