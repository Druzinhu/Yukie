const Discord = require('discord.js');
const cooldown = new Discord.Collection();

//const queueMessages = require('../utils/music/queueMessages');
const yukieReply = require('../strc/YukieReply');
const prefix = process.env.PREFIX;

module.exports = async (message, yukie) => {                 //yukie.blockedUsers[message.author.id]
	if (message.author.bot || message.channel.type === 'dm' || yukie.blockedUsers.has(message.author.id)) return;
	if (message.content === yukie.user.toString()) return message.channel.send(`✨ **|** ${message.author} Meu prefixo é: **\`${prefix}\`**! Use **\`${prefix}help\`** para ver meus **comandos**!`);
	if (!message.content.startsWith(prefix)) return;

	const args = message.content.slice(prefix.length).trim().split(' ');
	const comando = args.shift().toLowerCase();
	
	if (!message.content.slice(prefix.length).toLowerCase().startsWith(comando)) return;
	const commands = yukie.commands.get(comando) || yukie.aliases.get(comando);
	
	yukieReply.init();
	const data = {
		command: comando,
		prefix: prefix,
		ownerID: process.env.OWNER,
		rssUsage: Math.round(process.memoryUsage().rss / 1024 / 1024),
	}

	if (commands) {
		console.log('log', `${message.author.tag} [ID ${message.author.id}] executou: ${prefix+comando}`);

		if (cooldown.has(message.author.id)) {
			let author = cooldown.get(message.author.id); //yukie.database.db.update('Yukie/BlockedUsers/' + message.author.id, { blocked: true });
			
			if (author.messages > 5) {
				if (!yukie.blockedUsers.has(message.author.id)) {
					return yukie.blockedUsers.set(message.author.id, true);
				} else return;
			}
			                      
			author.messages++;
            const time = author.seconds - Math.floor((Date.now() - author.time) / 1000);

			clearTimeout(author.timeout);
			cooldown.set(message.author.id, {
				time: Date.now(),
				seconds: time + 40,
				messages: author.messages,
				timeout: setTimeout(() => {
					if (yukie.blockedUsers.has(message.author.id)) {
						yukie.blockedUsers.delete(message.author.id);
					}
					cooldown.delete(message.author.id);
				}, time * 1000 + 40000),
			});

			let timeLefth;
			if (time >= 60) {
				let minutes = Math.floor(time / 60);
				let seconds = time - minutes * 60;

				minutes = minutes === 1 ? minutes + ' minuto' : minutes + ' minutos';
				seconds = seconds === 1 ? seconds + ' segundo' : seconds + ' segundos'; 

				timeLefth = `${minutes} e ${seconds}`;
			} else timeLefth = time === 1 ? time + ' segundo' : time + ' segundos';

			return message.yukieReply('blocked',`**Você deve esperar ${timeLefth} para executar algum comando novamente**!`);
		}
		else {
			const acess = yukie.acess.includes(message.author.id);
			if (commands.requireAcessPermission && !acess) return;
			if (!acess) {
				cooldown.set(message.author.id, {
					time: Date.now(),
					messages: 1,
					seconds: 10,
					timeout: setTimeout(() => {
						cooldown.delete(message.author.id);
					}, 10000),
				});
			}
            if (commands.help.category === "music") {
                if (!message.author.playlist) await message.author.selectPlaylist();
            }

			commands.execute(yukie, message, args, data).catch(e => {
				message.channel.send(`Desculpe, ocorreu um erro ao executar o comando: \`${e}\``);
				//yukie.users.cache.get(data.ownerID).send('error: ' + e);
				console.error(e);
			});
		}
	}
}
