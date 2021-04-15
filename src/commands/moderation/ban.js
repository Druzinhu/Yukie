module.exports = {
    aliases: 'limpar',
    async execute(yukie, message, args) {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || (args[0] ? message.guild.members.cache.find(u => u.user.username.toLowerCase() === args[0].toLowerCase()) : undefined);
        let reason = args.slice(1).join(' ');

        if (!message.member.hasPermission('BAN_MEMBERS')) return message.yukieReply('blocked', '**Você não possui permissão para banir usuários!**')
        if (!message.guild.me.hasPermission('BAN_MEMBERS')) return message.yukieReply('x', '**Eu não tenho permissão para banir o usuário.** Para mim baní-lo, eu necessito da permissão para **Banir membros**.')
        
        if (!args[0]) return message.yukieReply('blocked', '**Você deve especificar o usuário que deseja banir!**')
        if (!member) return message.yukieReply('x', '**Desculpe, mas não encontrei o usuário especificado!**');
        if (!member.bannable) return message.yukieReply('blocked','**O usuário não pode ser banido por possuir um cargo acima do meu!** Para mim baní-lo, coloque meu cargo acima do dele.');

        if (!reason) reason = 'Não especificado';
        
        member.ban({ days: 7, reason: reason }).catch(error => {
            message.channel.send('Ocorreu um erro ao banir o usuário: ' + error);
        });
        message.channel.send(`**| ${message.author} baniu \`${member.user.tag}\` por: \`${reason}\`**`);
    }
}

module.exports.help = {
    category: 'moderation',
    description: 'Bane um usuário de seu servidor',
    usage: `<usuário> [motivo]`
}