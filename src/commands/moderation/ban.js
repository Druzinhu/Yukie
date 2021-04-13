module.exports = {
    aliases: 'limpar',
    async execute(yukie, message, args) {
        const member = message.mentions.users.first() || message.guild.users.cache.get(args[0]);
        let reason = args.slice(1).join(' ');

        if (!member) return;
        if (!member.bannable) return;

        if (!reason) reason = 'Não especificado';
        
    }
}

module.exports.help = {
    category: 'moderation',
    description: 'Bane um usuário de seu servidor',
    usage: `<usuário> [motivo]`
  }