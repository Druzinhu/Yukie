//const { readdirSync } = require('fs')
module.exports = {
    requireAcessPermission: true,
    async execute (yukie, message, args, data) {
        if (!args.join(' ')) return message.channel.send(`${message.author} Você deve falar o nome do comando, aliase ou o evento para que eu possa recarregá-lo.`);
        
        let fileName = args[0].toLowerCase();
        const file = yukie.commands.get(fileName) || yukie.aliases.get(fileName);

        if (!file) return message.channel.send(`${message.author} O comando, aliase ou evento **${fileName}** não existe! Verifique se você escreveu corretamente.`); 

        const dir = `../${file.help.category}/${fileName}.js`;

        try {
            delete require.cache[require.resolve(dir)];
            const pull = require(dir);
            yukie.commands.set(fileName, pull);
        
            message.channel.send(`O reload do comando **${fileName}** foi bem sucedido!`)
        } catch (error) {
            console.error(error);
            message.channel.send(`Ocorreu um erro ao dar reload no comando **${fileName}**:\n\`${error}\``)
        }
    }
}

module.exports.help = {
    category: 'developer',
}
