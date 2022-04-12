import {component, Props, reactive, signal} from 'classy-solid'
import throttle from 'lodash.throttle'
import type {Box, Node} from 'lume'
import {createMutable} from 'solid-js/store'
import {createEffect, onCleanup} from 'solid-js'

@component
@reactive
export class Rifle {
	PropTypes!: Props<this, 'shootOnClick' | 'onShoot'>

	/**
	 * If true will automatically shoot when the user clicks anywhere in the scene.
	 */
	@signal shootOnClick = false

	/**
	 * If provided will be called any time the gun is fired.
	 */
	@signal onShoot: (() => void) | null = null

	/**
	 * Throttles the rate at which the gun fires. 0 means no throttle.
	 */
	@signal shotThrottle = 0

	// TODO move this to the @component decorator
	/**
	 * This is similar to ref={} on regular elements. Pass in a signal setter
	 * (or function that accepts the instance as an arg) to get an instance of
	 * this component from JSX.
	 *
	 * Example:
	 *
	 * ```js
	 * return <Rifle instance={setRifle} />
	 * ```
	 */
	@signal instance: ((i: this) => void) | null = null

	timeouts = new Set<number>()

	onMount() {
		queueMicrotask(() => this.instance?.(this))

		createEffect(() => {
			const scene = this.root.scene

			if (!scene || !this.shootOnClick) return

			// TODO move to onmousedown={} prop inside JSX (currently doesn't work, bug?)
			scene.addEventListener('mousedown', this.shoot)

			onCleanup(() => {
				scene.removeEventListener('mousedown', this.shoot)
				for (const timeout of this.timeouts) clearTimeout(timeout)
				this.tracer.visible = false
				this.explosion.visible = false
			})
		})

		createEffect(() => {
			if (this.shotThrottle) {
				this.shoot = throttle(this._shoot, this.shotThrottle, {leading: true, trailing: false})
				onCleanup(() => this.shoot.cancel())
			} else {
				this.shoot = this._shoot
			}
		})

		setTimeout(() => {
			this.root.three.traverse(n => {
				console.log('modify material????')

				if (n.material) {
					const m = n as THREE.Mesh
					console.log('modify material!!')
					// TODO this isn't firing.
					// TODO attribute for model loaders so we don't have to manually do this to Three.js objects.
					m.castShadow = true
					m.receiveShadow = true
				}
			})
		}, 1000)
	}

	_shoot = () => {
		;(this.gunshot.cloneNode() as HTMLAudioElement).play()

		if (Math.random() < 0.25) this.tracer.visible = true
		this.explosion.visible = true

		const timeout = window.setTimeout(() => {
			this.tracer.visible = false
			this.explosion.visible = false
			this.timeouts.delete(timeout)
		}, 100)

		this.timeouts.add(timeout)

		this.onShoot?.()
	}

	shoot = this._shoot

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
					size="100 100 100"
					color="yellow"
					mount-point="0.5 0.5 1"
				></lume-sphere>

				{/* bullet tracer */}
				<lume-box
					ref={this.tracer}
					visible="false"
					has="basic-material"
					opacity="0.6"
					size="8 8 8000"
					color="white"
					mount-point="0.5 0.5 1"
				></lume-box>
			</lume-node>

			<audio ref={this.gunshot} src="/gunshot.mp3"></audio>
		</lume-node>
	)
}
