export const playersCollection = new Mongo.Collection<Player>('players')

export interface Player {
	id: string
	_id: string

	health: number

	// position
	x: number
	y: number
	z: number

	// look rotation
	rx: number
	ry: number

	shots: 0

	crouch: boolean
	connected: boolean
}
