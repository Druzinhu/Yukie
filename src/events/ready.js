module.exports = async (yukie) => {
	yukie.user.setStatus('idle')
	console.log(`${yukie.user.username} online e pronta para o serviço - com ${yukie.users.cache.size} usuários em ${yukie.guilds.cache.size} servidores.`)
	//yukie.user.setPresence({ activity: { name: 'Status', type: 'LISTENING' }, status: 'dnd' })
}