export const playersCollection = new Mongo.Collection<Player>('players')

export interface Player {
	id: string
	health: number
	x: number
	y: number
	z: number
	crouch: boolean
	connected: boolean
}
