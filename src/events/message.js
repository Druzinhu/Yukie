const Discord = require('discord.js');
const cooldown = new Discord.Collection();

const queueMessages = require('../strc/messages');
const yukieReply = require('../strc/yukieReply');
const prefix = process.env.PREFIX;

module.exports = async (message, yukie) => {
	if (message.author.bot || message.channel.type === 'dm') return;
	if (!yukie.blockedUsers.includes(message.author.id) && message.content === `<@!${yukie.user.id}>`) return message.channel.send(`✨ **|** ${message.author} Meu prefixo é: **\`${prefix}\`**! Use **\`${prefix}help\`** para ver meus **comandos**!`);
	if (!message.content.startsWith(prefix)) return;
	if (yukie.blockedUsers.includes(message.author.id)) return message.reply(`Você foi bloqueado, ou seja, você não pode usar mais meus comandos!`);

	const args = message.content.slice(prefix.length).trim().split(' ');
	const comando = args.shift().toLowerCase();
	
	if (!message.content.slice(prefix.length).toLowerCase().startsWith(comando)) return;

	const commands = yukie.commands.get(comando) || yukie.aliases.get(comando);
	
	function send(selected) {
		const msg = queueMessages[selected];
		return message.channel.send(`${msg ? msg : undefined}`);
	}
	message.queue = { messages: queueMessages, send: send };
	yukieReply.start();

	const data = {
		comando: comando,
		prefix: prefix,
		ownerID: process.env.OWNER,
		rssUsage: Math.round(process.memoryUsage().rss / 1024 / 1024),
	}

	if (commands) {
		console.log('log', `${message.author.tag} [ID ${message.author.id}] executou: ${prefix+comando}`);

		if (cooldown.has(message.author.id)) {
			let author = cooldown.get(message.author.id);
			if (author.messages === 5 && message.content === author.messageContent) return yukie.blockedUsers.push(message.author.id);
			
			author.messages++;
            const calc = 5 - Math.floor((Date.now() - cooldown.get(message.author.id).time) / 1000);

			if (calc === 1) seconds = calc + ' segundo';
			else seconds = calc + ' segundos';

			return message.yukieReply('x',`Você deve esperar ${seconds} para executar algum comando novamente!`);
		}
		else {
			if (commands.requireAcessPermission && !yukie.acess.includes(message.author.id)) return;
			
			if (!yukie.acess.includes(message.author.id)) {
				cooldown.set(message.author.id, {
					time: Date.now(),
					messageContent: message.content,
					messages: 1,
				});

				setTimeout(() => {
					cooldown.delete(message.author.id);
				}, 5000)
			}

			commands.execute(yukie, message, args, data);
		}
	}
}
