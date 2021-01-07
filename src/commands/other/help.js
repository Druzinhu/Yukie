const Discord = require('discord.js')
const { readdirSync } = require('fs')

module.exports = {
    aliases: 'ajuda',
    async execute (yukie, message, args, data) {
        const embed = new Discord.MessageEmbed()
        .setColor(process.env.DEFAULT_COLOR)

        readdirSync('src/commands').forEach(category => {
            const commands = readdirSync(`./src/commands/${category}/`).filter(file => file.endsWith(".js"))
            
            for (let file of commands) {
                const commandName = file.replace(/.js/g, '');

                const commands = yukie.commands.get(commandName)

                if (!commands.help) return

                embed.fields.push({
                    name: commandName,
                    value: `Descrição: \`${commands.help.description}\`\nComo usar: \`${data.prefix + commandName} ${commands.help.usage}\``
                })
            }
        });
        message.channel.send(embed)
    },
}

module.exports.help = {
    description: 'Mostra todos os comandos disponíveis do bot',
    usage: ''
}