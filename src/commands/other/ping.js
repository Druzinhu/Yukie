const Discord = require('discord.js')

module.exports = {
    aliases: 'latência latency',
    async execute(yukie, message, args) {
        message.channel.send('** **').then(msg => {
            const embed = new Discord.MessageEmbed()
            .setColor(process.env.DEFAULT_COLOR)
            .setDescription(`**Message Round Trip**: \`${msg.createdTimestamp - message.createdTimestamp}ms\` \n**Client/API Ping:** \`${yukie.ws.ping}ms\``)
            msg.edit('🏓 **Pong!**', embed)
        })
    },
}

module.exports.help = {
	category: 'other',
    description: 'Obtém o ping do bot',
    usage: ''
}