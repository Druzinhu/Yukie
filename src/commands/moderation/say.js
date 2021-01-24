const Discord = require('discord.js');

module.exports = {
	aliases: 'falar',
	async execute (yukie, message, args, data) {
		const msg = args.join(' ')

		if (!message.member.hasPermission ('ADMINISTRATOR')) {
			return message.yukieReply('x', 'você não tem permissão para executar este comando! Para executá-lo, você precisa ter a permissão de `administrador`!')
		}
		if (msg) {
			message.delete().catch(O_o => {});
			message.channel.send(msg);
		}
		
		else {
			let embed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setTitle('Como usar?')
			.setThumbnail(message.author.avatarURL({ format: 'png', size: 128 }))
			.setDescription('`'+data.prefix+data.comando+'` + `[frase]`')
			.addField('Exemplo:', '`'+data.prefix+data.comando+'` `'+yukie.user.username+' é minha amiga!`')
			.addField('Permissão:', 'Para utilizar este comando, é necessário que você tenha a permissão de `administrador`.')
			.setFooter(`Executado por ${message.author.tag}`, message.author.avatarURL())
			.setTimestamp()
			
			message.channel.send(message.author, embed);
		}
	}
}

module.exports.help = {
    category: 'moderation',
    description: 'Faz com que o bot envie tal mensagem',
    usage: `<frase>`
}
