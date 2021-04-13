const firebase = require('firebase');

module.exports = class Firebase {
    static init(firebaseConfig) {
        if (firebase.apps.length) return 'the app is already online!';
        firebase.default.initializeApp(JSON.parse(firebaseConfig));
    }
    static config(yukie) {
        firebase.default.database().ref('Yukie/Acess').once('value').then(db => yukie.acess = db.val());

        function db(locale = '') {
            const get = async(id = '') => {
                const ref = await firebase.default.database().ref(locale + id);
                const value = await ref.once('value');
                return value.val();
            }
            const update = (id = '', obj) => {
                firebase.default.database().ref(locale + id).update(obj);
                return 'updated database';
            }
            const remove = (id = '') => {
                firebase.default.database().ref(locale + id).remove();
                return 'removed from database';
            }
            return { get, update, remove };
        }
        return {
            users: db('Yukie/Users/'),
            guilds: db('Yukie/Guilds/'),
            db: db(),
        }
    }
}