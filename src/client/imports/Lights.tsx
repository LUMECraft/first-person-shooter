import {DirectionalLight, Motor, THREE} from 'lume'
import {createEffect, getOwner, onCleanup} from 'solid-js'
// import {reactive, signal} from 'classy-solid'
import {component, Props} from 'classy-solid'
import type {Node} from 'lume'
import {createMutable} from 'solid-js/store'

@component
// @reactive
class Lights {
	PropTypes!: Props<this, never>

	debug = false

	light!: DirectionalLight
	lightSize = 16000

	// @signal
	root!: Node

	count = 456

	onMount() {
		setInterval(() => {
			console.log('increment in Lights')
			debugger
			this.count++
		}, 1000)

		console.log('owner?', getOwner())
		const scene = this.root?.scene

		createEffect(() => {
			console.log('12')
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

	template = () => {
		// debugger

		// onMount(() => {
		// 	debugger
		// 	// const scene = this.root.scene
		// })

		return (
			<lume-box ref={this.root} size="300 300 300" color="blue">
				<h1>Count: {this.count}</h1>
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
			</lume-box>
		)
	}
}

export {Lights}
