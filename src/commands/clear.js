module.exports = {
    aliases: 'limpar',
    help: '',
    async run (yukie, message, args, data) {
        const number = args.join(' ')
        const mentioned = message.mentions.users.first()

        if (!message.member.hasPermission("ADIMINISTRATOR")) {
            return message.reply(`Você não tem permissão para executar este comando!`);
        };
        
        if (!number) return message.reply(`Coloque um número de mensagens a serem excluídas!`);

        if (isNaN(number)) return message.reply(`Use **números** para o valor de mensagens a serem excluídas!`);

        if (number < 2 || number > 100) return message.reply(`Eu só posso deletar entre 2 e 100 mensagens!`);

        message.channel.messages.fetch({ limit: number }).then(msg => {
            message.channel.bulkDelete(msg, true).then(ar => {
                const deleted = ar.array().length;

                if (deleted == number) {
                    return message.reply(`Chat limpo!`);
                } else {
                    return message.reply(`Chat limpo! Porém ${number - deleted} mensagens não foram deletadas por terem sido enviadas a mais de 2 semanas!`)
                };
            });
        });
    }
}
