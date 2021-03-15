const firebase = require('firebase');

module.exports = { 
    init: function(firebaseConfig) {
        firebase.default.initializeApp(JSON.parse(firebaseConfig));
    },
    database: function(fb) {
        let dbGuilds;
        let dbUsers;
        fb.default.database().ref('Yukie/Users/').on('value', (users) => dbUsers = users);
        fb.default.database().ref('Yukie/Guilds/').on('value', (guilds) => dbGuilds = guilds);

        const guilds = { dbGuilds,
            update(guildID) {
                if (!guildID) return Error('guild id not defined');
                return fb.default.database().ref(`Yukie/Guilds/${guildID}`).update;
            }
        }
        const users = { dbUsers, 
            update (userID) {
                if (!userID) return Error('user id not defined');
                return fb.default.database().ref(`Yukie/Users/${userID}`).update;
            }
        }
        return { guilds, users };
    }
}