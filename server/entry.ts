import {Player, playersCollection} from '../imports/collections/players'
import createDebounce, {DebouncedFunction} from '@solid-primitives/debounce'

// TODO This is all currently naive and unoptimized, easy to hack/cheat from the client.

let playerId = -1

playersCollection.remove({})

// const playerConnectionResetTimeouts = new ReactiveDict<Record<string, () => void>>() // TODO Meteor ReactiveDict is broken, report it.
const playerConnectionResetTimeouts = new Map<string, DebouncedFunction<any>>() // Map works.

Meteor.methods({
	addPlayer() {
		playerId++
		const id = playerId.toString()

		const newPlayer: Player = {
			id,
			_id: id,

			health: 100,

			// position
			x: 0,
			y: 0,
			z: 0,

			// look rotation
			ry: 0,
			rx: 0,

			crouch: false,

			shots: 0,

			// TODO if player is disconnected, set to false, and then UI should no longer render this player
			connected: true,
		}

		playersCollection.insert(newPlayer)

		// TODO This is very naive player connection timeout kicking after 5
		// seconds of inactivity without features such as blocking the time
		// progress of the game to wait for players, etc
		playerConnectionResetTimeouts.set(
			id,
			createDebounce(
				Meteor.bindEnvironment(() => disconnect(id)),
				5000,
			),
		)

		return id
	},

	heartbeat(id) {
		playerConnectionResetTimeouts.get(id)?.()
	},

	// TODO This is totally not cheat proof. Any client can call this with the ID of any payer, for example.
	disconnect(id) {
		disconnect(id)
	},

	updatePlayer({id, x, y, z, rx, ry, crouch}: Pick<Player, 'id' | 'x' | 'y' | 'z' | 'rx' | 'ry' | 'crouch'>) {
		playersCollection.update(id, {$set: {x, y, z, rx, ry, crouch}})
	},

	shoot(id) {
		playersCollection.update(id, {$inc: {shots: 1}})
	},
})

function disconnect(id) {
	playerConnectionResetTimeouts.get(id)?.clear()
	playerConnectionResetTimeouts.delete(id)
	playersCollection.update(id, {$set: {connected: false}})
}

// TODO optimize
Meteor.publish('players', function () {
	return playersCollection.find()
})
