module.exports = async (yukie) => {
	const activities = [
		`Utilize ${process.env.PREFIX}help para ver todos os meus comandos!`,
		`Música para mimir 😴`,
		`Estou em ${yukie.guilds.cache.size} servidores!`,
		`Icarly 😁`,
		`Utilize ${process.env.PREFIX}play para reproduzir uma música!`,
	]
	let status;
	let i = 0;

	setInterval(() => {
		const activity = `${activities[i++ % activities.length]}`;
		
	 	if (activity === activities[0]) status = 'PLAYING';
	 	if (activity === activities[1]) status = 'LISTENING';
	 	if (activity === activities[2]) status = 'PLAYING';
		if (activity === activities[3]) status = 'WATCHING';
	 	if (activity === activities[4]) status = 'PLAYING';
		 
		
		yukie.user.setActivity(activity, {
			type: status
		});
	}, 30000); //PLAYING, WATCHING, LISTENING, STREAMING

	console.log(`${yukie.user.username} online e pronta para o serviço - com ${yukie.users.cache.size} usuários em ${yukie.guilds.cache.size} servidores.`)

	//yukie.user.setPresence({ activity: { name: `${process.env.PREFIX}play`, type: 'PLAYING' }, status: 'online' })
}
