const { User } = require("discord.js")
const Playlist = require("./Playlist")
const yukie = require("../../../")

module.exports = class PROTO {
    static load() {
        User.prototype.selectPlaylist = async function select (name = undefined) {
            const UserDB = await yukie.database.users.get(this.id)
            if(!UserDB) return

            const playlists = UserDB.Playlists
            if(!playlists) return
            this.playlists = playlists;

            if(!name) {
                if(!UserDB.lastPlaylistName) return

                const playlist = {
                    songs: playlists[UserDB.lastPlaylistName].songs,
                    createdAt: playlists[UserDB.lastPlaylistName].createdAt,
                    name: UserDB.lastPlaylistName
                }

                this.playlist = new Playlist(playlist.name, playlist.songs ? playlist.songs : {}, playlist.createdAt, this)
                return this.playlist
            } else {              
                const playlist = playlists[name]
                if(!playlist) return

                this.playlist = new Playlist(name, playlist.songs ? playlist.songs : {}, playlist.createdAt, this)
                yukie.database.users.update(this.id, {
                    lastPlaylistName: name
                })
                return this.playlist
            }
        }
    }
}
