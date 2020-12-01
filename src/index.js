const Discord = require('discord.js')
const yukie = new Discord.Client()

const { readdirSync } = require('fs');
require('dotenv').config();

//yukie.startTime = Date.now()
yukie.login(process.env.TOKEN);
yukie.commands = new Map();
yukie.aliases = new Map();
yukie.queues = new Map();

// Commands
readdirSync('src/commands').forEach(f => {
	const cmd = require(`./commands/${f}`);
	const cmd_name = f.replace(/.js/g, '');
	if(cmd.aliase) { 
		const aliases = cmd.aliase.split(" ")
		aliases.forEach(aliase => {
			yukie.aliases.set(aliase, cmd)
			console.log('Carregando aliase: ' + aliase);
		});
	};
	yukie.commands.set(cmd_name, cmd)
	console.log('Carregando comando: ' + cmd_name);
});
// Events
readdirSync('src/events').forEach(f => {
	const event = require(`./events/${f}`);
	const event_name = f.replace(/.js/g, '');

	yukie.on(event_name, (...args) => event(...args, yukie))
	console.log('Carregando evento: ' + event_name);
});
