module.exports = {
    aliases: 'limpar',
    async execute(yukie, message, args) {
        const number = args[0];

        if (!message.member.hasPermission('ADIMINISTRATOR')) return message.yukieReply('blocked', '**Você não possui permissão para executar o comando!**');
        if (!message.guild.me.hasPermission('MANAGE_MESSAGES')) return message.yukieReply('blocked', '**Eu não tenho permissão para excluir mensagens!** Para que eu possa excluir mensagens, eu necessito da permissão de **Gerenciar mensagens**.');

        if (!number) return message.yukieReply('x', 'Ecolha um valor de 1 à 100 para as mensagens à serem deletadas.');
        if (isNaN(number) || !/^\d+$/.test(number)) return message.yukieReply('blocked', 'O valor de mensagens deve ser de 1 à 100!');

        if (!message.deleted) message.delete();
        const messages = await message.channel.messages.fetch({ limit: number });
        const deleted = await message.channel.bulkDelete(messages, true);

        if (number - deleted.size === 0) {
            message.yukieReply('', 'O chat está limpo!');
        } else if (messages.size - deleted.size === 0) {
            message.yukieReply('', 'O chat está limpo!');
        } else {
            if (messages.size - deleted.size === 1) message.yukieReply('', `**1 mensagem não foi deleteda** por ter sido enviada à mais de 14 dias (2 semanas).`);
            else message.yukieReply('', `Cerca de **${messages.size - deleted.size} mensagens não puderam ser deletadas** por terem sido enviadas à mais de 14 dias (2 semanas).`);
        }
    }
}

module.exports.help = {
    category: 'moderation',
    description: 'Exclui o valor especificado de mensagens do chat.',
    usage: `<1-100>`
  }