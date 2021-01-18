const Discord = require('discord.js')
const yukie = new Discord.Client()

const { readdirSync } = require('fs');
require('dotenv').config();

//yukie.startTime = Date.now()
yukie.blockedUsers = [''];
yukie.acess = ['748320609746026607', '451920956768649226'];
yukie.commands = new Map();
yukie.interval = new Map();
yukie.aliases = new Map();
yukie.queues = new Map();

readdirSync('src/commands').forEach(category => {
	const commands = readdirSync(`./src/commands/${category}/`).filter(file => file.endsWith(".js"))
	
	for (let file of commands) {
		const commandFile = require(`./commands/${category}/${file}`);
		const commandName = file.replace(/.js/g, '');

		if(commandFile.aliases) { 
			const aliases = commandFile.aliases.split(" ");

			aliases.forEach(aliase => {
				yukie.aliases.set(aliase, commandFile);
				console.log('Carregando aliase: ' + aliase);
			});
		}
		yukie.commands.set(commandName, commandFile);
		console.log('Carregando comando: ' + commandName);
	}
});

readdirSync('src/events').forEach(f => {
	const eventFile = require(`./events/${f}`);
	const eventName = f.replace(/.js/g, '');

	yukie.on(eventName, (...args) => eventFile(...args, yukie))
	console.log('Carregando evento: ' + eventName);
});

yukie.login(process.env.TOKEN);