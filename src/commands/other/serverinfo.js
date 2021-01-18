const Discord = require('discord.js');
const moment = require('moment')
moment.locale('pt-br')

module.exports = {
	async execute(yukie, message, args, data) {
		const embed = new Discord.MessageEmbed()
		.setColor(process.env.DEFAULT_COLOR)
		.setTitle(`🔹**${message.guild.name}**`)
		.setThumbnail(message.guild.iconURL())
		.addFields(
			{ name: `💻 ID`, value: `\`${message.guild.id}\``, inline: true },
			{ name: `👑 Dono`, value: `\`${message.guild.owner.user.tag} (ID ${message.guild.ownerID})\``, inline: true },
			{ name: `🌎 Região`, value: `\`${message.guild.region.charAt(0).toUpperCase() + message.guild.region.slice(1)}\``, inline: true },
			{ name: `📝 Canais`, value: `**De texto**: \`${message.guild.channels.cache.filter(chn => chn.type === "text").size}\`\n**De voz**: \`${message.guild.channels.cache.filter(chn => chn.type === "voice").size}\``, inline: true },
			{ name: `👥 Membros`, value: `**Usuários**: \`${message.guild.members.cache.filter(u => !u.user.bot).size}\`\n**Bots**: \`${message.guild.members.cache.filter(u => u.user.bot).size}\``, inline: true },
			{ name: `📆 Criado em`, value: `\`${moment(message.guild.createdAt).format('DD/MM/YY, [às] HH:mm:ss')}\``, inline: true },
			{ name: `📥 Entrei em`, value: `\`${moment(message.guild.me.joinedAt).format('DD/MM/YY, [às] HH:mm:ss')}\``, inline: true }
		)
		
		message.channel.send(message.author, embed)
		if (message.author.id === data.ownerID) message.reply('Não esquece de criar os emojis!!!')
	}
}
module.exports.help = {
	category: 'other',
    description: 'Mostra informações sobre o servidor',
    usage: ''
}
