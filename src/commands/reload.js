module.exports = {
    help: '',
    requireAcessPermission: true,
    async execute (yukie, message, args, data) {
        if (!args.join(' ')) return message.channel.send(`${message.author} Você deve falar o nome do comando para que eu possa recarregá-lo!`)
        const commandName = args[0].toLowerCase();
        const command = yukie.commands.get(commandName)
        || yukie.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return message.channel.send(`${message.author} O comando ou aliase ${commandName} não existe. Verifique se você escreveu corretamente!`)
    
        delete require.cache[require.resolve(`./${commandName}.js`)]

        try {
            const newCommand = require(`./${commandName}.js`);
            yukie.commands.set(commandName, newCommand);
            message.channel.send(`O reload do comando \`${commandName}\` foi bem sucedido!`)
        } catch (error) {
            console.error(error);
            message.channel.send(`Ocorreu um erro ao dar reload no comando \`${commandName}\`: \n\`${error.message}\``)
        }
    }
}
