module.exports = {
    aliases: 'bannir',
    async execute (yukie, message, args) {
        const mention = message.mentions.users
        if (!mention) return yukie.reply('teste')
    }
}

module.exports.help = {
    description: 'Bane um usuário permanentemente do servidor',
    usage: `<usuário> <motivo>`
}
