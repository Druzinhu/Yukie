module.exports = async (yukie) => {
	var yukieUptime = () => {
		let uptime = yukie.uptime / 1000;
		let days = Math.floor(uptime / 86400);
		uptime %= 86400;
		let hours = Math.floor(uptime / 3600);
		uptime %= 3600;
		let minutes = Math.floor(uptime / 60);
		let seconds = Math.floor(uptime % 60);

		return `😴 Estou acordada há ${days} dias, ${hours} horas, ${minutes} minutos e ${seconds} segundos! 🥱`;
	}

	var guildQueue = (queues) => {
		if (queues.size > 0) {
			const queue = queues.get([...queues.keys()][Math.floor(Math.random() * queues.size)]);
			return `${queue.songs[0].title}! Música requisitada por ${queue.songs[0].author.tag}`;
		}
		else return 'Biffe - Bubbaloo! Música requisitada por mim';
	}

	function activities(selected) {
		let activity;
		let status; // LISTENING, WATCHING, PLAYING, STREAMING

		if (selected == 0) {
			activity = `Utilize ${process.env.PREFIX}help para ver todos os meus comandos!`, status = 'PLAYING';
		}
		else if (selected == 1) {
			activity = `🎧 ${guildQueue(yukie.queues)}`, status = 'LISTENING';
		}
		else if (selected == 2) {
			activity = `Estou online em ${yukie.guilds.cache.size} servidores!`, status = 'PLAYING';
		}
		else if (selected == 3) {
			activity = `Veja meu repositório no Github! https://github.com/Druzinhu/Yukie-Bot`, status = 'PLAYING';
		}
		else if (selected == 4) {
			activity = `Utilize ${process.env.PREFIX}play para reproduzir uma música!`, status = 'PLAYING';
		}
		else if (selected == 5) {
			activity = yukieUptime(), status = 'PLAYING';
		}
		else if (selected == 6) {
			activity = `Gato é meu animal favorito! 🥰`, status = 'WATCHING';
		}

		yukie.user.setActivity(activity, { type: status });
	} 

	activities(6);

	let i = 0;

	setInterval(() => {
		activities(i++ % 7);
	}, 30000); // 30000 = 30 segundos

	console.log(`${yukie.user.username} online e pronta para o serviço - com ${yukie.users.cache.size} usuários em ${yukie.guilds.cache.size} servidores.`);
}
