import {Player, playersCollection} from '../imports/collections/players'

// Session is undefined, https://forums.meteor.com/t/session-is-undefined/57829/2
// import {Session} from 'meteor/session'
// console.log('Session', Session)
// Session.set('server_ready', false)

let playerId = -1

playersCollection.remove({})

Meteor.methods({
	addPlayer() {
		playerId++
		const id = playerId.toString()

		const newPlayer: Player = {
			id,
			health: 100,

			// position
			x: 0,
			y: 0,
			z: 0,

			// look rotation
			ry: 0,
			rx: 0,

			crouch: false,

			// TODO if player is disconnected, set to false, and then UI should no longer render this player
			connected: true,
		}

		playersCollection.insert(newPlayer)

		return id
	},

	updatePlayer({id, x, y, z, rx, ry, crouch}: Pick<Player, 'id' | 'x' | 'y' | 'z' | 'rx' | 'ry' | 'crouch'>) {
		playersCollection.update({id}, {$set: {x, y, z, rx, ry, crouch}})
	},
})

// TODO optimize
Meteor.publish('players', function () {
	return playersCollection.find()
})

/*
- players collection
  {id, health, x, y, z, crouch, connected}

- shoot method

*/
