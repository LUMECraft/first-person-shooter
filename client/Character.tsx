// import {reactive, signal} from 'classy-solid'
import {component, Props} from 'classy-solid'
import type {Node} from 'lume'
import {createMutable} from 'solid-js/store'

@component
// @reactive
export class Character {
	// PropTypes!: Props<this, never>
	PropTypes!: Props<Node, keyof Node>

	root!: Node

	onMount() {
		this.root.three.traverse(n => {
			if (n.material) {
				console.log('modify material!')
				// TODO attribute/prop for model loaders so we don't have to manually do this to Three.js objects here.
				n.material.cashShadow = true
				n.material.receiveShadow = true
			}
		})
	}

	constructor() {
		return createMutable(this)
	}

	template = () => (
		<lume-node ref={this.root} rotation="0 180 0" scale="0.48 0.48 0.48" {...this}>
			<lume-node rotation="90 0 0">
				<lume-3ds-model id="model" rotation="0 0 0" src="/ChuckChuck/head.3ds"></lume-3ds-model>
				<lume-3ds-model id="model" rotation="0 0 0" src="/ChuckChuck/body.3ds"></lume-3ds-model>
				<lume-3ds-model id="model" rotation="0 0 0" src="/ChuckChuck/left_arm.3ds"></lume-3ds-model>
				<lume-3ds-model id="model" rotation="0 0 0" src="/ChuckChuck/right_arm.3ds"></lume-3ds-model>
				<lume-3ds-model id="model" rotation="0 0 0" src="/ChuckChuck/left_leg.3ds"></lume-3ds-model>
				<lume-3ds-model id="model" rotation="0 0 0" src="/ChuckChuck/right_leg.3ds"></lume-3ds-model>
			</lume-node>
		</lume-node>
	)
}
