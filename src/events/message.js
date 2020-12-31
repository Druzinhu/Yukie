const Discord = require('discord.js');
const cooldown = new Discord.Collection();

const prefix = process.env.PREFIX;
require('../util/emojis');

module.exports = async (message, yukie) => {
	if (!message.member.hasPermission("ADMINISTRATOR") && message.guild.id === '773928105436905484' && message.channel.id !== '773988890042302504') return;
	if (message.author.bot || message.channel.type === 'dm') return;
	
	const args = message.content.slice(prefix.length).trim().split(' ');
	const comando = args.shift().toLowerCase();
	
	if (!message.content.startsWith(prefix+comando)) return; 
	
	const commands = yukie.commands.get(comando) || yukie.aliases.get(comando);
	if (commands) {
		console.log('log', `${message.author.tag} [ID ${message.author.id}] executou: ${prefix+comando}`);

		if (cooldown.has(message.author.id)) {
            const calc = 10 - Math.floor((Date.now() - cooldown.get(message.author.id)) / 1000)

			if (calc === 1) seconds = calc + ' segundo'
			else seconds = calc + ' segundos'

			return message.channel.send(`${message.author} Você deve esperar ${seconds} para executar algum comando novamente!`)
		
		} else {
			if (![process.env.OWNER, '451920956768649226'].includes(message.author.id)) {
				cooldown.set(message.author.id, Date.now())

				timeout = setTimeout(() => {
					cooldown.delete(message.author.id)
				}, 10000)
			}

			const data = { 
				comando: comando,
				prefix: prefix,
				emojis: emojis,
				ownerID: process.env.OWNER,
				message: message,
			}
			
			commands.run(yukie, message, args, data);
		}
	};
};
