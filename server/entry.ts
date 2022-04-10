import {playersCollection} from '../imports/collections/players'

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

		const newPlayer = {
			id,
			health: 100,
			x: 0,
			y: 0,
			z: 0,
			crouch: false,
			connected: true,
		}

		playersCollection.insert(newPlayer)

		return id
	},

	updatePlayer({id, x, y, z, crouch}: {id: string; x: number; y: number; z: number; crouch: boolean}) {
		playersCollection.update({id}, {$set: {x, y, z, crouch}})
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
