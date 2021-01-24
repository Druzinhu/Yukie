module.exports = {
    aliases: 'desbanir',
    async execute (yukie, message, args) {
        const member = yukie.users.fetch(args[0]);
        let bans = message.mentions.users.first() || message.guild.fetchBans();

        if (!message.guild.me.permissions.has(['BAN_MEMBERS'])) return message.yukieReply('x', '**Eu não tenho permissão para desbanir usuários!** Fale para um moderador/admin me conceder permissão.');
        if (!message.member.permissions.has(['BAN_MEMBERS'])) return message.yukieReply('x', '**Você não tem permissão para utilizar este comando!** Para utilizá-lo, você precisa da permissão para `banir membros`!')

        if (!args[0]) return message.yukieReply('x', 'Por favor, especifique um usuário para mim desbanir!');
        if (!member) return message.yukieReply('x', `Desculpe, procurei em todo lugar, mas não achei um usuário com esse id: **\`${args[0]}\`**`);

        if (!bans.has(member.id)) return message.yukieReply('x', 'Esse usuário não está banido! Verifique se você digitou o id certo.');

        message.guild.members.unban(member.id).then(b => {
            message.channel.send(`${message.author} usuário **desbanido**!`);
        })
        .catch(err => {
            console.log(err);
            message.channel.send(`Ocorreu um erro ao desbanir o usuário: \`${err.message}\``);
        });
    }
}

module.exports.help = {
    category: 'moderation',
    description: 'Bane um usuário permanentemente do servidor',
    usage: `<usuário> <motivo>`
}
