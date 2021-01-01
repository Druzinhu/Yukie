const Discord = require('discord.js');
const moment = require('moment')
moment.locale('pt-br')

module.exports = {
	help: '',
	async run (yukie, message, args, data) {
		const embed = new Discord.MessageEmbed()
		.setColor(process.env.DEFAULT_COLOR)
		.setTitle(`${data.emojis.RAINBOW_CAT} ${message.guild.name}`)
		.setThumbnail(message.guild.iconURL())
		.addFields(
			{ name: '💻 ID', value: '`'+message.guild.id+'`', inline: true },
			{ name: ''+data.emojis.CROWN+' Dono', value: '`'+message.guild.owner.user.tag+' (ID '+message.guild.ownerID+')`', inline: true },
			{ name: '🌎 Região', value: '`'+message.guild.region+'`', inline: true },
			{ name: '🌌 Canais:', value: '**De texto**: `'+message.guild.channels.cache.filter(chn => chn.type === "text").size+'`\n**De voz**: `'+message.guild.channels.cache.filter(chn => chn.type === "voice").size+'`', inline: true },
			{ name: ''+data.emojis.USERS+' Membros `'+message.guild.members.cache.size+'`', value: '** **', inline: true },
			{ name: ''+data.emojis.CAT+' Entrei em', value: '`'+moment(message.guild.me.joinedAt).format('DD/MM/YY, [às] HH:mm:ss')+'`', inline: true },
			{ name: ''+data.emojis.GEARZ+' Criado em', value: '`'+moment(message.guild.createdAt).format('DD/MM/YY, [às] HH:mm:ss')+'`', inline: true }
		);
		message.channel.send(message.author, embed)
	}
}
