export const mapItems = new Mongo.Collection<MapItem>('mapItems')

export interface MapItem {
	type: 'tree' | 'big_tree' | 'stone' | 'shrub' | 'shrub2'
	x: number
	z: number
}
