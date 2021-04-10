const Discord = require('discord.js');

module.exports = {
    aliases: 'e ev',
    requireAcessPermission: true,
    async execute (yukie, message, args, data) {
        let code = args.join(' ').replace(/<@!?(\d{16,18})>/g, `yukie.users.cache.get("$1")`);
        let hide = false;

        if (code.includes('-hide')) {
            hide = true;
            code = code.replace('-hide', '');
        }

        if (code === 'ncu --ver') {
            message.channel.send('```js\n\'checking for updates...\'```');   
            var upgraded = await require('npm-check-updates').run({
                jsonUpgraded: false,
                silent: true
            });
            code = upgraded;
        }
        
        let result;
        try {
            const evaled = await eval(code);
            result = require("util").inspect(evaled, { compact: true, depth: 0 });
        } catch(error) {
            hide = false;
            result = error.toString();
        }

        if (hide === false) message.channel.send(result, { code: 'js' });
    }
}

module.exports.help = { 
    category: 'dev',
}
