// import {reactive, signal} from 'classy-solid'
import {component, Props} from 'classy-solid'
import type {Box, Node} from 'lume'
import {createMutable} from 'solid-js/store'
import {createEffect, onCleanup} from 'solid-js'

@component
// @reactive
export class Rifle {
	// PropTypes!: Props<this, never>
	PropTypes!: Props<Node, keyof Node>

	onMount() {
		createEffect(() => {
			const scene = this.root.scene

			if (!scene) return

			let timeouts = new Set<number>()

			const ondown = () => {
				;(this.gunshot.cloneNode() as HTMLAudioElement).play()

				if (Math.random() < 0.25) this.tracer.visible = true
				this.explosion.visible = true

				const timeout = setTimeout(() => {
					this.tracer.visible = false
					this.explosion.visible = false
					timeouts.delete(timeout)
				}, 100)

				timeouts.add(timeout)
			}

			// TODO move to onmousedown={} prop inside JSX (currently doesn't work, bug?)
			scene.addEventListener('mousedown', ondown)

			onCleanup(() => {
				scene.removeEventListener('mousedown', ondown)
				for (const timeout of timeouts) clearTimeout(timeout)
				this.tracer.visible = false
				this.explosion.visible = false
			})
		})
	}

	constructor() {
		return createMutable(this)
	}

	root!: Node
	gunshot!: HTMLAudioElement
	tracer!: Box
	explosion!: Node

	template = () => (
		<lume-node ref={this.root} rotation="0 180 0" position="15 5 -15">
			{/* <!-- barrel --> */}
			<lume-box size="4 4 100" color="gray" rotation="0 0 0" position="0 0 0">
				{/* <!-- tip --> */}
				<lume-box size="1 3 1" color="gold" align-point="0.5 0 1" mount-point="0.5 1 1"></lume-box>

				{/* muzzle flash */}
				<lume-node ref={this.explosion} visible="false" align-point="0.5 0.5 1">
					<lume-sphere
						has="basic-material"
						opacity="0.5"
						size="20 20 20"
						color="yellow"
						mount-point="0.5 0.5 0"
					></lume-sphere>
				</lume-node>

				{/* bullet tracer */}
				<lume-box
					ref={this.tracer}
					visible="false"
					has="basic-material"
					opacity="0.6"
					size="2 2 8000"
					color="white"
					align-point="0.5 0.5 1"
					mount-point="0.5 0.5 0"
				></lume-box>
			</lume-box>
			{/* <!-- body --> */}
			<lume-box size="4 10 60" color="gray" rotation="0 0 0" position="0 0 0"></lume-box>
			{/* <!-- handle --> */}
			<lume-box size="4 20 6" color="brown" rotation="-35 0 0" position="0 6 -5"></lume-box>
			{/* <!-- stalk --> */}
			<lume-box
				size="4 7 25"
				color="gray"
				rotation="8 0 0"
				position="0 0 0"
				mount-point="0 0 1"
				origin="0.5 0.5 1"
			></lume-box>
			<lume-box
				size="4 7 25"
				color="gray"
				rotation="-8 0 0"
				position="0 0 0"
				mount-point="0 0 1"
				origin="0.5 0.5 1"
			></lume-box>
			{/* <!-- clip --> */}
			<lume-box size="4 20 10" color="gray" rotation="35 0 0" position="0 5 30"></lume-box>

			<audio ref={this.gunshot} src="/gunshot.mp3"></audio>
		</lume-node>
	)
}
