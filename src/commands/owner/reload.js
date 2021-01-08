const { readdirSync } = require('fs')
module.exports = {
    requireAcessPermission: true,
    async execute (yukie, message, args, data) {
        if (!args.join(' ')) return message.channel.send(`${message.author} Você deve falar o nome do comando para que eu possa recarregá-lo!`);
        
        let commandName = args[0].toLowerCase();
        const command = yukie.commands.get(commandName)
        || yukie.aliases.get(commandName);

        if (!command) return message.channel.send(`${message.author} O comando ou aliase ${commandName} não existe. Verifique se você escreveu corretamente!`);
        
        let category;

        readdirSync('src/commands').forEach(cat => { 
            const commands = readdirSync(`./src/commands/${cat}/`).find(file => file === `${commandName}.js`);
            if (!commands) return;
            category = cat;
        })

        try {
            delete require.cache[require.resolve(`../${category}/${commandName}.js`)];
            //yukie.commands.delete(commandName)
            const pull = require(`../${category}/${commandName}.js`);
            yukie.commands.set(commandName, pull);
        
            message.channel.send(`O reload do comando \`${commandName}\` foi bem sucedido!`)
        } catch (error) {
            console.error(error);
            message.channel.send(`Ocorreu um erro ao dar reload no comando \`${commandName}\`:\n\`${error}\``)
        }
    }
}
