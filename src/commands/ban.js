module.exports = {
    aliase: 'bannir',
    async execute (yukie, message, args) {
        const mention = message.mentions.users
        if (!mention) return yukie.reply('teste')
    },

    help: {
        name: 'ban',
        description: 'Bane um usuário permanentemente do servidor',
        usage: `${process.env.PREFIX}ban <usuário> <motivo>`
    }
}