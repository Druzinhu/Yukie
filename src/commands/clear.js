module.exports = {
    aliases: 'limpar',
    help: '',
    async run (yukie, message, args, data) {
        const number = args.join(' ')
        
        if (!message.member.hasPermission("ADIMINISTRATOR")) {
            return message.channel.send(`${message.author} Você não tem permissão para executar este comando!`);
        };
        if (!number) return message.channel.send(`${message.author} Coloque um número de mensagens a serem excluídas!`);
        if (isNaN(number)) return message.channel.send(`${message.author} Não reconheço **${args[0]}** como um número! :(`);

        if (number < 2 || number > 100) return message.channel.send(`${message.author} Eu só posso deletar entre 2 e 100 mensagens!`);
        
        message.channel.messages.fetch({ limit: number }).then(msg => {
            message.channel.bulkDelete(msg, true).then(ar => {
                var deleted = ar.array().length;
                if (deleted == number) {
                    return message.channel.send(`${message.author} Chat limpo!`);
                } else {
                    return message.channel.send(`${message.author} Chat limpo! Porém ${number - deleted} mensagens não foram deletadas por terem sido enviadas a mais de 2 semanas!`)
                };
            });
        });
    }
}
