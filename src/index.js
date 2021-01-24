const Discord = require('discord.js');
const yukie = new Discord.Client();

const fs = require('fs');
require('dotenv').config();

yukie.acess = ['748320609746026607', '451920956768649226'];
yukie.blockedUsers = [];
yukie.commands = new Map();
yukie.aliases = new Map();
yukie.interval = new Map();
yukie.queues = new Map();

fs.readdirSync('src/commands').forEach(category => {
	const commands = fs.readdirSync(`./src/commands/${category}/`).filter(file => file.endsWith(".js"));
	
	for (let file of commands) {
		const command = require(`./commands/${category}/${file}`);
		const commandName = file.replace(/.js/g, '');

		if(command.aliases) { 
			const aliases = command.aliases.split(" ");

			aliases.forEach(aliase => {
				yukie.aliases.set(aliase, command);
				console.log('Carregando aliase: ' + aliase);
			});
		}
		yukie.commands.set(commandName, command);
		console.log('Carregando comando: ' + commandName);
	}
});

fs.readdirSync('src/events').forEach(f => {
	const event = require(`./events/${f}`);
	const eventName = f.replace(/.js/g, '');

	yukie.on(eventName, (...args) => event(...args, yukie));
	console.log('Carregando evento: ' + eventName);
});

yukie.login(process.env.TOKEN);