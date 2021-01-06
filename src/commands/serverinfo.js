const Discord = require('discord.js');
const moment = require('moment')
moment.locale('pt-br')

module.exports = {
	help: '',
	async run (yukie, message, args, data) {
		const embed = new Discord.MessageEmbed()
		.setColor(process.env.DEFAULT_COLOR)
		.setTitle(`<a:gearz:759503544901959700> | **${message.guild.name}**`)
		.setThumbnail(message.guild.iconURL())
		.addFields(
			{ name: `💻 ID`, value: `\`${message.guild.id}\``, inline: true },
			{ name: `<:fall_crown:759493576517222410> Dono`, value: `\`${message.guild.owner.user.tag} (ID ${message.guild.ownerID})\``, inline: true },
			{ name: `🌎 Região`, value: `\`${message.guild.region.charAt(0).toUpperCase() + message.guild.region.slice(1)}\``, inline: true },
			{ name: `📝 Canais`, value: `**De texto**: \`${message.guild.channels.cache.filter(chn => chn.type === "text").size}\`\n**De voz**: \`${message.guild.channels.cache.filter(chn => chn.type === "voice").size}\``, inline: true },
			{ name: `<:users:759501332813054012> Membros`, value: `**Usuários**: \`${message.guild.members.cache.filter(u => !u.user.bot).size}\`\n**Bots**: \`${message.guild.members.cache.filter(u => u.user.bot).size}\``, inline: true },
			{ name: `📆 Criado em`, value: `\`${moment(message.guild.createdAt).format('DD/MM/YY, [às] HH:mm:ss')}\``, inline: true },
			{ name: `📥 Entrei em`, value: `\`${moment(message.guild.me.joinedAt).format('DD/MM/YY, [às] HH:mm:ss')}\``, inline: true }
		)
		
		message.channel.send(message.author, embed)
	},

	help: {
        name: 'serverinfo',
        description: 'Mostra informações sobre o servidor',
        usage: `${process.env.PREFIX}serverinfo`
    }
}