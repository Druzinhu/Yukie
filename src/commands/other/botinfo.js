const Discord = require('discord.js');
//const moment = require('moment');
//moment.locale('pt-br')

module.exports = {
	async execute(yukie, message, args, data) {
		const embed = new Discord.MessageEmbed()
		.setColor(process.env.DEFAULT_COLOR)
		.setTitle(`📄 **Informações sobre mim:**`)
		.setThumbnail(yukie.user.displayAvatarURL())
		.addFields(
			{ name: `📋 Minha tag`, value: `\`${yukie.user.tag}\``, inline: true },
			{ name: `💻 ID`, value: `\`${yukie.user.id}\``, inline: true },
			{ name: `🕵️‍♂️ Meu criador`, value: `\`${yukie.users.cache.get(data.ownerID).tag}\``, inline: true },
			{ name: `🌃 Estou em`, value: `\`${yukie.guilds.cache.size} servidores\``, inline: true },
			{ name: `<:users:759501332813054012> Com`, value: `\`${yukie.users.cache.size} usuários\``, inline: true },
			{ name: `📆 Fui criada em`, value: `\`26/08/20, às 11:58:05\``, inline: true } //${moment(yukie.user.createdAt).format('DD/MM/YY, [às] hh:mm:ss')}
		);

		message.channel.send(message.author, embed)
		/*.then(m => {
			m.react('')
		})*/
	}
}

module.exports.help = {
	category: 'other',
    description: 'Mostra informações sobre o bot',
    usage: ''
}
