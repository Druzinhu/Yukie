const Discord = require('discord.js');
const cooldown = new Discord.Collection();

const prefix = process.env.PREFIX;

module.exports = async (message, yukie) => {
        //if (message.author.id === '695717007504703529') return yukie.users.cache.get(process.env.OWNER).send(`${message.content}`)
	if (message.author.bot || message.channel.type === 'dm') return;
	if (yukie.blockedUsers.includes(message.author.id)) return;

	if (message.content === yukie.user.toString()) {
		return message.channel.send(`${message.author} Meu **prefixo** é: **\`${prefix}\`**! Use **\`${prefix}help\`** para ver meus **comandos**!`)
	}

	const args = message.content.slice(prefix.length).trim().split(' ');
	const comando = args.shift().toLowerCase();
	
	if (!message.content.startsWith(prefix+comando)) return; 
	
	const commands = yukie.commands.get(comando) || yukie.aliases.get(comando);
	const data = { 
		comando: comando,
		prefix: prefix,
		ownerID: process.env.OWNER,
		message: message,
		rssUsage: Math.round(process.memoryUsage().rss / 1024 / 1024),
	}

	if (commands) {
		console.log('log', `${message.author.tag} [ID ${message.author.id}] executou: ${prefix+comando}`);

		if (cooldown.has(message.author.id)) {
            const calc = 10 - Math.floor((Date.now() - cooldown.get(message.author.id)) / 1000)

			if (calc === 1) seconds = calc + ' segundo';
			else seconds = calc + ' segundos';

			return message.channel.send(`${message.author} Você deve esperar ${seconds} para executar algum comando novamente!`)
		}
		else {
			if (!yukie.acess.includes(message.author.id)) {
				cooldown.set(message.author.id, Date.now())

				setTimeout(() => {
					cooldown.delete(message.author.id)
				}, 5000);
			};

			if (commands.requireAcessPermission/* === true*/) {
				if (yukie.acess.includes(message.author.id)) {
					return commands.execute(yukie, message, args, data);
				} 
				else return;
			};
			commands.execute(yukie, message, args, data);
		};
	};
}