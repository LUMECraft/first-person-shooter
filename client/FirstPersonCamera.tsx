import {reactive, signal} from 'classy-solid'
import {component, Props} from 'classy-solid'
import {clamp, Motor, Node, toRadians, XYZNumberValues} from 'lume'
import {createMutable} from 'solid-js/store'
import {createEffect, onCleanup} from 'solid-js'

@component
@reactive
export class FirstPersonCamera {
	// PropTypes!: Props<this, never>
	PropTypes!: Props<Node, keyof Node>

	camRotation = new XYZNumberValues()
	camPosition = new XYZNumberValues()
	@signal crouchAmount = 0

	root!: Node

	onMount() {
		createEffect(() => {
			const scene = this.root.scene

			if (!scene) return

			// FIXME in LUME: root.scene gets set twice for unexpectedly, this console.log() runs twice
			console.log('scene?', scene)

			const onmove = (e: PointerEvent) => {
				this.camRotation.y -= e.movementX * 0.1
				this.camRotation.x = clamp(this.camRotation.x + e.movementY * 0.1, -90, 90)
			}

			const onlockchange = () => {
				if (!document.pointerLockElement) scene.removeEventListener('pointermove', onmove)
			}

			const onclick = () => {
				if (document.pointerLockElement) return
				scene.requestPointerLock()
				scene.addEventListener('pointermove', onmove)
				document.addEventListener('pointerlockchange', onlockchange)
			}

			// TODO move to onmousedown={} prop inside JSX (currently doesn't work, bug?)
			scene.addEventListener('click', onclick)

			onCleanup(() => {
				scene.removeEventListener('click', onclick)
				scene.removeEventListener('pointermove', onmove)
				document.removeEventListener('pointerlockchange', onlockchange)
			})
		})

		const keysDown = {w: false, a: false, s: false, d: false}

		for (const key of ['w', 'a', 's', 'd'] as const) {
			window.addEventListener('keydown', e => {
				if (!document.pointerLockElement) return
				if (key != e.key.toLowerCase()) return
				if (keysDown[key]) return

				keysDown[key] = true

				let nextPositionZ = (dt: number) => 0
				let nextPositionY = (dt: number) => 0

				if (key === 'w') {
					nextPositionZ = dt => -Math.cos(toRadians(this.camRotation.y)) * 0.5 * dt
					nextPositionY = dt => -Math.sin(toRadians(this.camRotation.y)) * 0.5 * dt
				}
				if (key === 'a') {
					nextPositionZ = dt => Math.sin(toRadians(this.camRotation.y)) * 0.5 * dt
					nextPositionY = dt => -Math.cos(toRadians(this.camRotation.y)) * 0.5 * dt
				}
				if (key === 's') {
					nextPositionZ = dt => Math.cos(toRadians(this.camRotation.y)) * 0.5 * dt
					nextPositionY = dt => Math.sin(toRadians(this.camRotation.y)) * 0.5 * dt
				}
				if (key === 'd') {
					nextPositionZ = dt => -Math.sin(toRadians(this.camRotation.y)) * 0.5 * dt
					nextPositionY = dt => Math.cos(toRadians(this.camRotation.y)) * 0.5 * dt
				}

				Motor.addRenderTask((t, dt) => {
					this.camPosition.z += nextPositionZ(dt)
					this.camPosition.x += nextPositionY(dt)
					return keysDown[key]
				})
			})

			window.addEventListener('keyup', e => {
				if (!document.pointerLockElement) return
				if (key != e.key.toLowerCase()) return
				keysDown[key] = false
			})
		}

		let crouched = false

		window.addEventListener('keydown', e => {
			if (!document.pointerLockElement) return
			if (e.key != 'Shift') return
			if (crouched) return

			crouched = true

			// FIXME this should trigger update, but for some reason we need to rotate the camera before it takes effect, so no crouch for now
			// this.crouchAmount = 50
			this.crouchAmount = 0
		})

		window.addEventListener('keyup', e => {
			if (e.key != 'Shift') return
			crouched = false
			this.crouchAmount = 0
		})
	}

	constructor() {
		return createMutable(this)
	}

	template = (props: this['PropTypes']) => (
		<lume-node
			ref={this.root}
			rotation={[0, this.camRotation.y]}
			position={[this.camPosition.x, this.camPosition.y + this.crouchAmount, this.camPosition.z]}
		>
			{/* <lume-camera-rig active rotation={[this.camRotation.x]}>
				{props.children}
			</lume-camera-rig> */}
			<lume-perspective-camera slot="camera-child" active rotation={[this.camRotation.x]} far="200000">
				{props.children}
			</lume-perspective-camera>
		</lume-node>
	)
}
