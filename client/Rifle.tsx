import {reactive, signal} from 'classy-solid'
import {component, Props} from 'classy-solid'
import type {Box, Node} from 'lume'
import {createMutable} from 'solid-js/store'
import {createEffect, onCleanup} from 'solid-js'

@component
@reactive
export class Rifle {
	PropTypes!: Props<this, 'fireOnClick'>

	@signal fireOnClick = false

	timeouts = new Set<number>()

	onMount() {
		createEffect(() => {
			const scene = this.root.scene

			if (!scene || !this.fireOnClick) return

			// TODO move to onmousedown={} prop inside JSX (currently doesn't work, bug?)
			scene.addEventListener('mousedown', this.fire)

			onCleanup(() => {
				scene.removeEventListener('mousedown', this.fire)
				for (const timeout of this.timeouts) clearTimeout(timeout)
				this.tracer.visible = false
				this.explosion.visible = false
			})
		})
	}

	fire = () => {
		;(this.gunshot.cloneNode() as HTMLAudioElement).play()

		if (Math.random() < 0.25) this.tracer.visible = true
		this.explosion.visible = true

		const timeout = window.setTimeout(() => {
			this.tracer.visible = false
			this.explosion.visible = false
			this.timeouts.delete(timeout)
		}, 100)

		this.timeouts.add(timeout)
	}

	constructor() {
		return createMutable(this)
	}

	root!: Node
	gunshot!: HTMLAudioElement
	tracer!: Box
	explosion!: Node

	template = () => (
		<lume-node ref={this.root} position="0 0 -40" scale="0.8 0.8 0.8">
			{/* rifle model */}
			<lume-fbx-model src="/gun.fbx" rotation="0 -90 0" scale="0.2 0.2 0.2"></lume-fbx-model>

			<lume-node position="0 -105 -260">
				{/* muzzle flash */}
				<lume-sphere
					ref={this.explosion}
					visible="false"
					has="basic-material"
					opacity="0.5"
					size="50 50 50"
					color="yellow"
					mount-point="0.5 0.5 1"
				></lume-sphere>

				{/* bullet tracer */}
				<lume-box
					ref={this.tracer}
					visible="false"
					has="basic-material"
					opacity="0.6"
					size="15 15 8000"
					color="white"
					mount-point="0.5 0.5 1"
				></lume-box>
			</lume-node>

			<audio ref={this.gunshot} src="/gunshot.mp3"></audio>
		</lume-node>
	)
}
