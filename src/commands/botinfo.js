const Discord = require('discord.js');
const moment = require('moment');
moment.locale('pt-br')

module.exports = {
	help: '',
	async run (yukie, message, args, data) {
		const ownerID = data.ownerID;
		const emojis = data.emojis;

		const embed = new Discord.MessageEmbed()
		.setColor(process.env.DEFAULT_COLOR)
		.setTitle(''+emojis.ROBOT+' Minhas informações')
		.setDescription('** **')
		.setThumbnail(yukie.user.displayAvatarURL())
		.addFields(
			{ name: '📋 Minha tag', value: `\`${yukie.user.tag}\``, inline: true },
			{ name: `${emojis.ID} ID`, value: `\`${yukie.user.id}\``, inline: true },
			{ name: '🕵️‍♂️ Meu criador', value: `\`${yukie.users.cache.get(ownerID).tag}\``, inline: true },
			{ name: '🌃 Estou em', value: `\`${yukie.guilds.cache.size} servidores\``, inline: true },
			{ name: `${emojis.USERS} Com`, value: `\`${yukie.users.cache.size} usuários\``, inline: true },
			{ name: '📆 Fui criada em', value: `\`${moment(yukie.user.createdAt).format('DD/MM/YY, [às] hh:mm:ss')}\``, inline: true }
		);

		message.channel.send(message.author, embed);
	}
}