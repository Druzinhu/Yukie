module.exports = {
    aliases: 'desbanir',
    async execute(yukie, message, args) {
        const member = args[0] ? args[0].replace(/[<@!>]/g, '') : undefined;
        const banned = await message.guild.fetchBans()

        if (!message.member.hasPermission('BAN_MEMBERS')) return message.yukieReply('blocked', '**Você não possui permissão para desbanir usuários!**');
        if (!message.guild.me.hasPermission('BAN_MEMBERS')) return message.yukieReply('x', '**Eu não tenho permissão para desbanir o usuário.** Para mim baní-lo, eu necessito da permissão para **Banir membros**.');
        
        if (!member) return message.yukieReply('blocked', '**Você deve especificar o usuário que deseja desbanir!**');
        else if (!banned.has(member)) return message.yukieReply('x', 'Huum... Parece que o usuário especificado não está banido!');
        
        message.guild.members.unban(member).then(() => {
            message.yukieReply('', '**Usuário desbanido!**');
        }).catch(error => {
            message.channel.send(`**Ocorreu um erro ao desbanir o usuário:** \`${error}\``);
        });
    }
}

module.exports.help = {
    category: 'moderation',
    description: 'Desbane um usuário de seu servidor',
    usage: `<usuário> [motivo]`
}