const Discord = require('discord.js');

module.exports = {
    aliase: 'e',
    requireAcessPermission: true,
    async run (yukie, message, args, data) {
        let code = args.join(' ');
        let hide = false

        if (code.includes('--hide')) {
            hide = true
            code = code.replace('--hide', '')
        }

<<<<<<< HEAD
<<<<<<< HEAD
        mentioned = message.mentions.users
            if (mentioned && code.includes('--user')) {
            code = code.replace('--user', '').replace(/<@!?(\d{16,18})>/g, `yukie.users.fetch(message.mentions.users.map(u => u.id))`)
            hide = false
        }
        delete mentioned
=======
            if (message.mentions.users.first()) code = code.replace(`<@!${message.mentions.users.first().id}>`, `yukie.users.fetch(message.mentions.users.first().id)`)
>>>>>>> c3290346518f4a1827bce1af71f1a97df69c96f2
=======
            if (message.mentions.users.first() && code.includes("--user")) code = code.replace('--user', '').replace(`<@!${message.mentions.users.first().id}>`, `yukie.users.fetch(message.mentions.users.first().id)`)
>>>>>>> 7a89c5e17e21e35e577c060f21839984904dd286

        if (code === 'ncu --ver') {
            message.channel.send('```js\n\'checking for updates...\'```')
            
            var upgraded = await require('npm-check-updates').run({
                jsonUpgraded: false,
                silent: true
            })
            code = upgraded
        };

        let result; 
        try {
            const evaled = await eval(code);
            
            result = require("util").inspect(evaled, { compact: true, depth: 0 });
        } catch(error) {
            hide = false
            result = error.toString();
        };

        if (hide === false) return message.channel.send(result, { code: 'js' });
    }
}
