// import {reactive, signal} from 'classy-solid'
import {component, Props} from 'classy-solid'
import type {Node} from 'lume'
import {createMutable} from 'solid-js/store'

@component
// @reactive
class Character {
	// PropTypes!: Props<this, never>
	PropTypes!: Props<Node, keyof Node>

	root!: Node

	onMount() {
		console.log('mount')
		setTimeout(() => {
			this.root.three.traverse(n => {
				if (n.material) {
					const m = n as THREE.Mesh
					// TODO attribute for model loaders so we don't have to manually do this to Three.js objects.
					m.castShadow = true
					m.receiveShadow = true
				}
			})
		}, 1000)
	}

	constructor() {
		return createMutable(this)
	}

	template = () => {
		console.log('template')
		return (
			<lume-node ref={this.root} position="0 320 0" rotation="0 180 0" scale="0.48 0.48 0.48">
				<lume-node rotation="0 0 0">
					<lume-fbx-model id="model" rotation="0 0 0" src="/ChuckChuck/body.fbx"></lume-fbx-model>
					<lume-fbx-model id="model" rotation="0 0 0" src="/ChuckChuck/left_arm.fbx"></lume-fbx-model>
					<lume-fbx-model id="model" rotation="0 0 0" src="/ChuckChuck/right_arm.fbx"></lume-fbx-model>
					<lume-fbx-model id="model" rotation="0 0 0" src="/ChuckChuck/left_leg.fbx"></lume-fbx-model>
					<lume-fbx-model id="model" rotation="0 0 0" src="/ChuckChuck/right_leg.fbx"></lume-fbx-model>
				</lume-node>
			</lume-node>
		)
	}
}

export {Character}
