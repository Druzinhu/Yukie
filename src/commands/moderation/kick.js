module.exports = {
    aliases: 'expulsar kickar',
    async execute(yukie, message, args) {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || (args[0] ? message.guild.members.cache.find(u => u.user.username.toLowerCase() === args[0].toLowerCase()) : undefined);
        let reason = args.slice(1).join(' ');

        if (!message.member.hasPermission('BAN_MEMBERS')) return message.yukieReply('blocked', '**Você não possui permissão para expulsar usuários!**')
        if (!message.guild.me.hasPermission('BAN_MEMBERS')) return message.yukieReply('x', '**Eu não tenho permissão para expulsar o usuário.** Para mim expulsá-lo, eu necessito da permissão para **Expulsar membros**.')
        
        if (!args[0]) return message.yukieReply('blocked', '**Você deve especificar o usuário que deseja expulsar!**')
        if (!member) return message.yukieReply('x', 'Desculpe, mas não encontrei o usuário especificado!');
        
        if (message.member.id !== message.guild.owner.id && member.roles.highest.position >= message.member.roles.highest.position) {
            return message.yukieReply('x', '**O usuário especificado não pode ser expulso por possuir um cargo acima do seu!**');
        }
        if (!member.kickable) return message.yukieReply('blocked','**O usuário não pode ser expulso por possuir um cargo acima do meu!** Para mim expulsá-lo, coloque meu cargo acima do dele.');

        if (!reason) reason = 'Não especificado';
        
        member.kick({ reason: reason }).then(() => {
            message.channel.send(`**| ${message.author} kickou \`${member.user.tag}\` por: \`${reason}\`**`);
        }).catch(error => {
            message.channel.send(`**Ocorreu um erro ao expulsar o usuário:** \`${error}\``);
        });
    }
}

module.exports.help = {
    category: 'moderation',
    description: 'Expulsa um usuário de seu servidor',
    usage: `<usuário> [motivo]`
}