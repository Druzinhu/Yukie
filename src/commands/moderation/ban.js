module.exports = {
    aliases: 'banir',
    async execute (yukie, message, args) {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let reason = args.slice(1).join(' ');

        if (!message.guild.me.permissions.has(['BAN_MEMBERS'])) return message.yukieReply('x', '**Eu não tenho permissão para banir usuários!** Fale para um moderador/admin me conceder permissão.');
        if (!message.member.permissions.has(['BAN_MEMBERS'])) return message.yukieReply('x', '**Você não tem permissão para utilizar este comando!** Para utilizá-lo, você precisa da permissão para `banir membros`!')

        if (!args[0]) return message.yukieReply('x', 'Por favor, especifique um usuário para mim banir!');
        if (!member) return message.yukieReply('x', `Desculpe, procurei em todo lugar, mas não achei um usuário com esse nome/id: **\`${args[0]}\`**`);
        if (member.id === yukie.user.id) return message.yukieReply('x', 'Eu não posso banir a mim mesma!')

        if (!member.bannable) return message.yukieReply('x', '**Esse usuário não pode ser banido!** Ele possui um cargo acima do meu, para mim bani-lo, você deve colocar meu cargo acima do dele!');
        if (!reason) reason = 'Não especificado';

        member.ban({ days: 7, reason: reason }).then(b => {
            message.channel.send(`${message.author} **baniu** ${member.tag} por: **\`${reason}\`**`);
        })
        .catch(err => {
            console.log(err);
            message.channel.send(`Ocorreu um erro ao banir o usuário: \`${err.message}\``);
        });
    }
}

module.exports.help = {
    category: 'moderation',
    description: 'Bane um usuário permanentemente do servidor',
    usage: `<usuário> <motivo>`
}
