import {reactive, signal} from 'classy-solid'
import {component, Props} from 'classy-solid'
import {clamp, Motor, Node, toRadians, XYZNumberValues} from 'lume'
import {createMutable} from 'solid-js/store'
import {createEffect, onCleanup, JSX} from 'solid-js'
import {render} from 'solid-js/web'

@component
@reactive
export class FirstPersonCamera {
	PropTypes!: Props<this, 'onPlayerMove' | 'crouchAmount'>

	@signal onPlayerMove:
		| ((pos: {x: number; y: number; z: number; rx: number; ry: number; crouch: boolean}) => void)
		| null = null

	__playerMove() {
		const {x, y, z} = this.camPosition
		const {x: rx, y: ry} = this.camRotation
		const crouch = !!this.__crouchAmount
		this.onPlayerMove?.({x, y, z, rx, ry, crouch})
	}

	camRotation = new XYZNumberValues()
	camPosition = new XYZNumberValues()

	crouchAmount = 0
	@signal __crouchAmount = this.crouchAmount

	root!: Node

	onMount() {
		createEffect(() => (this.camPosition.y = this.__crouchAmount))

		createEffect(() => {
			const scene = this.root.scene

			if (!scene) return

			// FIXME in LUME: root.scene gets set twice for unexpectedly, this console.log() runs twice
			console.log('scene?', scene)

			const onmove = (e: PointerEvent) => {
				this.camRotation.y -= e.movementX * 0.1
				this.camRotation.x = clamp(this.camRotation.x + e.movementY * 0.1, -90, 90)

				this.__playerMove()
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

		const moveSpeed = 1
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
					nextPositionZ = dt => -Math.cos(toRadians(this.camRotation.y)) * moveSpeed * dt
					nextPositionY = dt => -Math.sin(toRadians(this.camRotation.y)) * moveSpeed * dt
				}
				if (key === 'a') {
					nextPositionZ = dt => Math.sin(toRadians(this.camRotation.y)) * moveSpeed * dt
					nextPositionY = dt => -Math.cos(toRadians(this.camRotation.y)) * moveSpeed * dt
				}
				if (key === 's') {
					nextPositionZ = dt => Math.cos(toRadians(this.camRotation.y)) * moveSpeed * dt
					nextPositionY = dt => Math.sin(toRadians(this.camRotation.y)) * moveSpeed * dt
				}
				if (key === 'd') {
					nextPositionZ = dt => -Math.sin(toRadians(this.camRotation.y)) * moveSpeed * dt
					nextPositionY = dt => Math.cos(toRadians(this.camRotation.y)) * moveSpeed * dt
				}

				Motor.addRenderTask((t, dt) => {
					this.camPosition.z += nextPositionZ(dt)
					this.camPosition.x += nextPositionY(dt)

					this.__playerMove()

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
			this.__crouchAmount = this.crouchAmount
			this.__playerMove()
		})

		window.addEventListener('keyup', e => {
			if (e.key != 'Shift') return
			crouched = false
			this.__crouchAmount = 0
			this.__playerMove()
		})
	}

	constructor() {
		return createMutable(this)
	}

	template = (props: this['PropTypes']) => {
		// const children = props.children

		return (
			<lume-node
				ref={this.root}
				rotation={[0, this.camRotation.y]}
				position={[this.camPosition.x, this.camPosition.y, this.camPosition.z]}
				use:shadow={
					<>
						<slot></slot>
						<lume-perspective-camera active rotation={[this.camRotation.x]} far="200000" zoom={1}>
							<slot name="camera-child"></slot>
						</lume-perspective-camera>
						{/* <lume-camera-rig active rotation={[this.camRotation.x]}>
							<slot name="camera-child"></slot>
						</lume-camera-rig> */}
					</>
				}
			>
				{props.children}
			</lume-node>
		)
	}
}

async function shadow(el: Element, args: () => JSX.Element | [JSX.Element, ShadowRootInit] | true) {
	const _args = args()
	const [shadowChildren, shadowOptions = {mode: 'open'}] =
		_args === true
			? [() => <></>] // no args
			: isShadowArgTuple(_args)
			? _args
			: [() => _args]

	// Defer for one microtask so custom element upgrades can happen.
	await Promise.resolve()

	if (el.tagName.includes('-') && !customElements.get(el.tagName.toLowerCase())) {
		await Promise.race([
			new Promise<void>(resolve =>
				setTimeout(() => {
					console.warn(
						'Custom element is not defined after 1 second, skipping. Overriden attachShadow methods may break if the element is defined later.',
					)
					resolve()
				}, 1000),
			),
			customElements.whenDefined(el.tagName.toLowerCase()),
		])
	}

	const root = el.attachShadow(shadowOptions)
	// @ts-ignore :(
	render(shadowChildren, root)
}

function isShadowArgTuple(a: any): a is [JSX.Element, ShadowRootInit] {
	if (Array.isArray(a) && a.length === 2 && 'mode' in a[1]) return true
	return false
}
