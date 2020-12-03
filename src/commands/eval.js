const Discord = require('discord.js');

module.exports = {
    aliase: 'e',
    async run (yukie, message, args, data) {
            if (!['748320609746026607', '451920956768649226'].includes(message.author.id)) return;
            /*let v = -1
            if (message.mentions.users.first()) {
                args.forEach((value, index) => {
                    const r = /<@!?(\d{16,18})>/g
                    if(r.test(args[index])) {
                        v++
                    }
                    args[index] = args[index].replace(/<@!?(\d{16,18})>/g, "message.mentions.users.map(u => u)["+v+"]")
                });
            };*/
            let code = args.join(' ');

            if (code === 'ncu --ver') {
                var ncu = require('npm-check-updates')
                message.channel.send('```js\n\'checking for updates...\'```')
                var upgraded = await ncu.run({
                jsonUpgraded: false,
                silent: true
                })
                code = upgraded
            };

            if (message.mentions.users.first()) code = code.replace(`<@!${message.mentions.users.first().id}>`, `yukie.users.fetch(message.mentions.users.first().id)`)

            let result; 
            try {
                const evaled = await eval(code);

                result = require("util").inspect(evaled, { compact: true, depth: 0 });
            } catch(error) {
                result = error.toString();
            };

            message.channel.send(result, { code: 'js' });
    }
}
