const Discord = require('discord.js');
const moment = require('moment')
moment.locale('pt-br')

module.exports = {
	help: '',
	async run (yukie, message, args, data) {
		const ID = data.emojis.ID;
		const COROA = data.emojis.COROA;
		const ROLE = data.emojis.ROLE;
		const USERS = data.emojis.USERS;
		const CAT = data.emojis.CAT;
		const GEARZ = data.emojis.GEARZ;
		const TITLE = data.emojis.TITLE;

		const embed = new Discord.MessageEmbed()
		.setTitle(`${TITLE} ${message.guild.name}`)
		.setThumbnail(message.guild.iconURL())
		.setDescription('** **')
		.setColor('RANDOM')
		.addFields( 
			{ name: ''+ID+' ID', value: '`'+message.guild.id+'`', inline: true },
			{ name: ''+COROA+' Dono', value: '`'+message.guild.owner.user.tag+' (ID '+message.guild.ownerID+')`', inline: true },
			{ name: '🌎 Região', value: '`'+message.guild.region+'`', inline: true },
			{ name: ''+ROLE+' Cargos `'+message.guild.roles.cache.size+'`', value: '** **', inline: true },
			{ name: '🎙️ Canais de voz `'+message.guild.channels.cache.filter(chn => chn.type === "voice").size+'`\n📄 Canais de texto `'+message.guild.channels.cache.filter(chn => chn.type === "text").size+'`', value: '** **', inline: true },
			{ name: ''+USERS+' Membros `'+message.guild.members.cache.size+'`', value: '** **', inline: true },
			{ name: ''+CAT+' Entrei em', value: '`'+moment(message.guild.me.joinedAt).format('DD/MM/YY, [às] HH:mm:ss')+'`', inline: true },
			{ name: ''+GEARZ+' Criado em', value: '`'+moment(message.guild.createdAt).format('DD/MM/YY, [às] HH:mm:ss')+'`', inline: true }
		);
		message.channel.send(message.author, embed)
	}
}
