import {type Player, playersCollection} from '../imports/collections/players'
import createDebounce, {type DebouncedFunction} from '@solid-primitives/debounce'
import {mapItems} from '../imports/collections/mapItems'

// TODO This is all currently naive and unoptimized, easy to hack/cheat from the client.

let playerId = -1

await playersCollection.removeAsync({})

// const playerConnectionResetTimeouts = new ReactiveDict<Record<string, () => void>>() // TODO Meteor ReactiveDict is broken, report it.
const playerConnectionResetTimeouts = new Map<string, DebouncedFunction<any>>() // Map works.

Meteor.methods({
	async addPlayer() {
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

		await playersCollection.insertAsync(newPlayer)

		// TODO This is very naive player connection timeout kicking after 5
		// seconds of inactivity without features such as blocking the time
		// progress of the game to wait for players, etc
		playerConnectionResetTimeouts.set(
			id,
			createDebounce(
				// Meteor.bindEnvironment(() => disconnect(id)),
				() => disconnect(id),
				5000,
			),
		)

		return id
	},

	heartbeat(id) {
		playerConnectionResetTimeouts.get(id)?.()
	},

	// TODO This is totally not cheat proof. Any client can call this with the ID of any payer, for example.
	async disconnect(id) {
		await disconnect(id)
	},

	async updatePlayer({id, x, y, z, rx, ry, crouch}: Pick<Player, 'id' | 'x' | 'y' | 'z' | 'rx' | 'ry' | 'crouch'>) {
		await playersCollection.updateAsync(id, {$set: {x, y, z, rx, ry, crouch}})
	},

	async shoot(id) {
		await playersCollection.updateAsync(id, {$inc: {shots: 1}})
	},

	async hit(id) {
		await playersCollection.updateAsync(id, {$inc: {health: -40}})
	},
})

async function disconnect(id: string) {
	playerConnectionResetTimeouts.get(id)?.clear()
	playerConnectionResetTimeouts.delete(id)

	// For now delete, but later we could allow a player to reconnect, and
	// remove after a while of disconnection.
	// await playersCollection.updateAsync(id, {$set: {connected: false}})
	await playersCollection.removeAsync({id})
}

// TODO optimize
Meteor.publish('players', function () {
	return playersCollection.find({connected: true})
})

/// generate map

await mapItems.removeAsync({})

Meteor.publish('mapItems', function () {
	return mapItems.find()
})

const playArea = 16000
const mapItemTypes = ['tree', 'stone', 'shrub', 'shrub2', 'big_tree'] as const

const promises = []

for (let i = 0; i < 30; i += 1) {
	promises.push(
		mapItems.insertAsync({
			type: mapItemTypes[Math.round((mapItemTypes.length - 1) * Math.random())]!,
			x: playArea * Math.random() - playArea / 2,
			z: playArea * Math.random() - playArea / 2,
		}),
	)
}

await Promise.all(promises)
