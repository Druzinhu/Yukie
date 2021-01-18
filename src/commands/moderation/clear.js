module.exports = {
    aliases: 'limpar delete deletar',
    async execute (yukie, message, args, data) {
        const number = args.join(' ')

        if (!message.member.hasPermission("ADIMINISTRATOR")) {
            return message.reply(`Você não tem permissão para executar este comando!`);
        };
        
        if (!number) return message.reply(`Coloque um número de mensagens a serem excluídas!`);

        if (isNaN(number) === true) return message.reply(`Coloque um valor de 2 a 100 para o número de mensagens a serem excluídas!`);

        if (number < 2 || number > 100) return message.reply(`Eu só posso deletar entre 2 e 100 mensagens!`);

        message.channel.messages.fetch({ limit: number })
        .then(msg => {
            message.channel.bulkDelete(msg, true).then(ar => {
                const deleted = ar.array().length;
                //console.log(msg.size + ' - ' + number)
                
                if (deleted == number || !number > msg.size) {
                    return message.reply(`Chat limpo!`);
                }
                //else if (msg.size == number || number > msg.size) {
                else {
                    if (msg.size - deleted == 0) {
                        return message.reply(`Chat limpo!`);
                    }
                    else {
                        if (msg.size - deleted == 1) return message.reply(`Chat limpo! Porém 1 mensagem não foi deletada por ter sido enviada a mais de 2 semanas!`)
                        else return message.reply(`Chat limpo! Porém ${msg.size - deleted} mensagens não puderam ser deletadas por terem sido enviadas a mais de 2 semanas!`)
                    }
                }
            })
        })
    }
}

module.exports.help = {
    category: 'moderation',
    description: 'Apaga mensagens de um canal',
    usage: `<2 - 100>`
}

