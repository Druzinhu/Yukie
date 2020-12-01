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
		const data = { 
			comando: comando,
			prefix: prefix,
			emojis: emojis,
			ownerID: process.env.OWNER,
		}
		console.log('log', `${message.author.tag} [ID ${message.author.id}] executou: ${prefix+comando}`);
		commands.run(yukie, message, args, data);
	}
};
