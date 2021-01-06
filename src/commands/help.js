const Discord = require('discord.js')

module.exports = {
    async execute (yukie, message, args, data) {
        const embed = new Discord.MessageEmbed()
        .setColor(process.env.DEFAULT_COLOR)
        
        const commands = yukie.commands
        commands.forEach(command => {
            //if (command.aliase) return
            if (!command.help) return

            embed.fields.push({
                name: `${command.help.name}`,
                value: `Descrição: \`${command.help.description}\`\nComo usar: \`${command.help.usage}\``
            })

            //message.channel.send(command.help.name)
        })

        message.channel.send(embed)
    },
    
    help: {
        name: 'help',
        description: 'Mostra todos os meus comandos disponíveis',
        usage: `${process.env.PREFIX}help`
    }
}