import {DirectionalLight, Motor, THREE} from 'lume'
import {createEffect, onCleanup} from 'solid-js'
// import {reactive, signal} from 'classy-solid'
import {component, Props} from 'classy-solid'
import type {Node} from 'lume'
import {createMutable} from 'solid-js/store'

@component
// @reactive
export class Lights {
	// PropTypes!: Props<this, never>
	PropTypes!: Props<Node, keyof Node>

	debug = false

	light!: DirectionalLight
	lightSize = 16000

	root!: Node

	onMount() {
		createEffect(() => {
			const scene = this.root.scene

			if (!(this.debug && scene)) return

			const helper = new THREE.DirectionalLightHelper(this.light.three, this.lightSize)
			scene.three.add(helper)
			const task = Motor.addRenderTask(() => {
				helper.update()
			})

			onCleanup(() => {
				Motor.removeRenderTask(task)
				scene.three.remove(helper)
				helper.dispose()
			})
		})
	}

	constructor() {
		return createMutable(this)
	}

	template = () => (
		<lume-node ref={this.root}>
			<lume-directional-light
				ref={this.light}
				position="4000 -4000 4000"
				intensity="0.6"
				color="white"
				shadow-map-width="4096"
				shadow-map-height="4096"
				shadow-camera-far="100000"
				shadow-camera-top={this.lightSize / 2}
				shadow-camera-right={this.lightSize / 2}
				shadow-camera-bottom={-this.lightSize / 2}
				shadow-camera-left={-this.lightSize / 2}
			>
				{this.debug && <lume-sphere color="yellow" size="100" mount-point="0.5 0.5 0.5"></lume-sphere>}
			</lume-directional-light>

			<lume-ambient-light color="white" intensity="0.6"></lume-ambient-light>
		</lume-node>
	)
}
