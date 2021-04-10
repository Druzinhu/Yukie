module.exports = async function deleteUsersPlaylist(yukie) {
    const time = new Date().toTimeString().slice(0,5);
    if (time === "00:00") {
        //const guild = yukie.guilds.cache.get("637767649052327958")
        //if (guild) guild.channels.cache.find(c => c.id === "823670330315767869").send(`${time} - log n° ${i++}`)
        
        const allUsers = await yukie.database.users.get();
        const keys = Object.keys(allUsers);

        keys.filter(u => u.lastUsedDay).map(userID => yukie.database.users.get(userID + '/lastUsedDay').then(days =>
            yukie.database.users.update(userID, { lastUsedDay: days + 1 })
        ));
        //keys.filter(u => u.lastUsedDay).map(userID =>
        //    yukie.database.users.update(userID, { lastUsedDay: allUsers[userID].lastUsedDay + 1 })
        //));
        const filtered = keys.filter(key => allUsers[key].lastUsedDay > 152);
        filtered.map(userID => yukie.database.users.remove(userID));
        
        setTimeout(() => deleteUsersPlaylist(yukie), 60000);
    } else setTimeout(() => deleteUsersPlaylist(yukie), 60000);
}
