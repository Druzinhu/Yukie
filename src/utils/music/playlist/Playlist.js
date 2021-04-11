const yukie = require("../../../")

module.exports = class Playlist {
     constructor(name, songs, createdAt, user) {
         this.name = name
         this.songs = songs
         this.createdAt = createdAt
         this.user = user
     }

     static async create (user, name) {
         await yukie.database.users.update(user.id + "/Playlists/" + name.toLowerCase(), {
            createdAt: Date.now()
         })

         await yukie.database.users.update(user.id, {
            lastPlaylistName: name.toLowerCase()
         })

         user.selectPlaylist()
     }

     static async delete () {
         //.
     }

     async edit (oldindex, newindex) {
         const song = Object.entries(this.songs).find(song => song[1].position === oldindex)
         const entried = Object.entries(this.songs).find(song => song[1].position === newindex)

         this.songs[entried[0]].position = this.songs[song[0]].position
         this.songs[song[0]].position = newindex

         await yukie.database.users.update(this.user.id + "/Playlists/" + this.name, { songs: this.songs })
     }

     async add (song) {
         song.position = Object.keys(this.songs).length ? Object.keys(this.songs).length + 1 : 1
         const sonG = {}
         sonG[song.id] = song

         await yukie.database.users.update(this.user.id + "/Playlists/" + this.name + "/songs", sonG)
         this.songs[song.id] = song
     }
 
     async remove (songID) {
         const songpos = this.songs[songID].position
         delete this.songs[songID]

         const fillSongs = Object.entries(this.songs).filter(s => s[1].position > songpos)
         if(fillSongs) {
            fillSongs.forEach(s => this.songs[s[0]].position = this.songs[s[0]].position - 1)
         }

         await yukie.database.users.update(this.user.id + "/Playlists/" + this.name, { songs: this.songs })
     }

    async rename (name) {
        const savedPlaylist = await yukie.database.users.get(this.user.id + "/Playlists/" + this.name)
        
        const object = {}
        object[name] = savedPlaylist
        object[this.name] = null
 
        await yukie.database.users.update(this.user.id + "/Playlists", object)
        this.user.selectPlaylist(name)
    }
}
