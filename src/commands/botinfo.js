const Discord = require('discord.js');
const moment = require('moment');
moment.locale('pt-br')

module.exports = {
	help: '',
	async run (yukie, message, args, data) {
		const author = message.author;
		const ownerID = data.ownerID;
		// E M O J I S
		const emojis = data.emojis;
		const ID = emojis.ID;
		const ROBOT = emojis.ROBOT;
		const USERS = emojis.USERS;

		const embed = new Discord.MessageEmbed()
		.setTitle(''+ROBOT+' Minhas informações')
		.setThumbnail(yukie.user.displayAvatarURL())
		.setDescription('** **')
		.setColor(process.env.DEFAULT_COLOR)
		.addFields(
			{ name: '📋 Minha tag', value: '`'+yukie.user.tag+'`', inline: true },
			{ name: ''+ID+' ID', value: '`'+yukie.user.id+'`', inline: true },
			{ name: '🕵️‍♂️ Meu criador', value: '`'+yukie.users.cache.get(ownerID).tag+'`', inline: true },
			{ name: '🌃 Estou em', value: '`'+yukie.guilds.cache.size+' servidores`', inline: true },
			{ name: ''+USERS+' Com', value: '`'+yukie.users.cache.size+' usuários`', inline: true },
			{ name: '📆 Fui criada em', value: '`'+moment(yukie.user.createdAt).format('DD/MM/YY, [às] hh:mm:ss')+'`', inline: true }
		);
		const embed2 = new Discord.MessageEmbed()
		.setTitle('Servidores em que estou:')
		.setDescription(yukie.guilds.cache.map(r => '`'+r.name+'`').join(' | '))
		.setColor(process.env.DEFAULT_COLOR);

		if (author.id === ownerID) {
			function botinfo() {
				message.channel.send(author, embed).then(msg => {
				msg.react('➡️');
				let filter = (r, user) => {
					return ['➡️'].includes(r.emoji.name) && user.id === message.author.id;// && (reaction.emoji.name == '➡️')
				}
				msg.awaitReactions(filter, { max: 1, time: 30000 })
				.then(c => {
					const r = c.first()
					if (r.emoji.name === '➡️') {
						msg.delete()
						message.channel.send(author, embed2).then(msg => {
							msg.react('⬅️')
							let filter = (r, user) => {
								return ['⬅️'].includes(r.emoji.name) && user.id === message.author.id;
							}
							msg.awaitReactions(filter, { max: 1, time: 30000 })
							.then(c => {
								const r = c.first()
								if (r.emoji.name === '⬅️') {
									msg.delete()
									botinfo()
								}
							}).catch(O_o => {})
						})
					}
				}).catch(O_o => {})
			})} botinfo()
		} else message.channel.send(author, embed);
	}
}
