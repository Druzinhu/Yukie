module.exports = async (yukie) => {
	function guildQueue(queues) {
		if (queues.size) {
			const queue = queues.get([...queues.keys()][Math.floor(Math.random() * queues.size)]).songs;
			const title = queue[0] ? queue[0].title.slice(0, 25) : undefined;
			return queue.length !== 0 ? `${title.length < queue[0].title.length ? title + '...' : title}! Música requisitada por ${queue[0].author.username}` : "MeiaUm - Goodbye";
		}
		else return "MeiaUm - Goodbye";
	}
	function activities(selected) {
		let activity;
		let status; // LISTENING, WATCHING, PLAYING, STREAMING
		/*if (selected == 0) {
			activity = `Utilize ${process.env.PREFIX}help para ver todos os meus comandos!`, status = 'PLAYING';
		}*/
		if (selected === 0) {
			activity = `🎧 ${guildQueue(yukie.queues)}`, status = 'LISTENING';
		}
		else if (selected === 1) {
			activity = `Veja meu source no Github! https://github.com/Druzinhu/Yukie`, status = 'PLAYING';
		}
		else if (selected === 2) {
			activity = `Utilize ${process.env.PREFIX}play para reproduzir uma música!`, status = 'PLAYING';
		}

		yukie.user.setActivity(activity, { type: status });
	} 

	activities(2);

	let i = 0;
	setInterval(() => {
		activities(i++ % 3);
	}, 30000); // 30000 = 30 segundos

	console.log(`${yukie.user.username} online e pronta para o serviço - com ${yukie.users.cache.size} usuários em ${yukie.guilds.cache.size} servidores.`);
}
