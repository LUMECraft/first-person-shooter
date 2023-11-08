import {component, Props, reactive, signal} from 'classy-solid'
import createThrottle from '@solid-primitives/throttle'
import {clamp, Motor, Node, toRadians, XYZNumberValues, THREE, PerspectiveCamera} from 'lume'
// import {createMutable} from 'solid-js/store'
import {createEffect, onCleanup, JSX, batch} from 'solid-js'
import {render} from 'solid-js/web'
import {Vector2} from 'three/src/math/Vector2'

const {Raycaster} = THREE
const caster = new Raycaster()

@component
@reactive
class FirstPersonCamera {
	PropTypes!: Props<this, 'onPlayerMove' | 'crouchAmount' | 'elementsToIntersect' | 'onIntersect' | 'autoIntersect'>

	@signal onPlayerMove:
		| ((pos: {x: number; y: number; z: number; rx: number; ry: number; crouch: boolean}) => void)
		| null = null

	crouchAmount = 0

	@signal elementsToIntersect: Set<Node> | null = null

	// TODO we need ability to specify {equals: false} for @signal decorator so we don't have to make a new array each time we update it.
	@signal intersectedElements: Node[] = []

	// FIXME: we shouldn't need this, but createEffect(() => camera.intersectedElements) is not working right now for some reason. We use a callback for now.
	@signal onIntersect: ((n: Node[]) => void) | null = null

	@signal autoIntersect = true

	camRotation = new XYZNumberValues()
	camPosition = new XYZNumberValues()

	@signal __crouchAmount = this.crouchAmount

	root!: Node
	camera!: PerspectiveCamera

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

						<lume-perspective-camera
							ref={this.camera}
							active
							rotation={[this.camRotation.x]}
							far="200000"
							zoom={1}
						>
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

	__playerMove() {
		const {x, y, z} = this.camPosition
		const {x: rx, y: ry} = this.camRotation
		const crouch = !!this.__crouchAmount
		console.log('call on player move', x, y, z, rx, ry, crouch)
		this.onPlayerMove?.({x, y, z, rx, ry, crouch})
	}

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

	onMount() {
		queueMicrotask(() => this.instance?.(this))

		createEffect(() => (this.camPosition.y = this.__crouchAmount))

		createEffect(() => {
			console.log('10')
			const scene = this.root.scene

			if (!scene) return

			// FIXME in LUME: root.scene gets set twice for unexpectedly, this console.log() runs twice
			// console.log('scene?', scene)

			const onmove = (e: PointerEvent) => {
				this.camRotation.y -= e.movementX * 0.1
				this.camRotation.x = clamp(this.camRotation.x + e.movementY * 0.1, -90, 90)

				debugger
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

		// TODO LUME: make raycaster an HTML element so that the ray can be positioned in 3D space just like any other object.

		window.addEventListener('keyup', e => {
			if (e.key != 'Shift') return
			crouched = false
			this.__crouchAmount = 0
			this.__playerMove()
		})

		createEffect(() => {
			console.log('11')
			if (!this.autoIntersect) return

			// Any time these change,
			const {x, y, z} = this.camPosition
			const {x: rx, y: ry} = this.camRotation
			const crouch = !!this.__crouchAmount
			this.elementsToIntersect

			// schedule a raycast
			this.throttledIntersect[0]()
		})
	}

	intersectDeferred = false

	throttledIntersect = createThrottle(() => {
		if (this.intersectDeferred) return
		this.intersectDeferred = true

		Motor.once(async () => {
			// ensure we run this after scene transforms are updated. (TODO better API f.e. Motor.afterRender())
			await Promise.resolve()
			await Promise.resolve()

			this.intersectDeferred = false

			// update line-of-sight intersections so App can determine who gets shot.
			caster.setFromCamera(
				new Vector2(0, 0), // cast from the center of the screen
				this.camera!.three,
			)

			if (!this.elementsToIntersect) return

			const intersections = caster.intersectObjects(
				// [...this.elementsToIntersect] // broken in Quest Browser
				Array.from(this.elementsToIntersect)
					.map(el => el?.three)
					// fixme bug: undefined values getting in here. This whole thing is a quick hack for Solid Hack. :]
					.filter(o => !!o),
			)

			batch(() => {
				this.intersectedElements = []

				// TODO this is definitely not optimal
				for (const i of intersections) {
					for (const el of this.elementsToIntersect!) {
						if (!el) continue // FIXME bug, should be no undefineds. Bug in how disconnected players are removed.

						el.three.traverse(o => {
							if (i.object === o) {
								this.intersectedElements.push(el)
							}
						})
					}
				}

				// FIXME we should need this, an outside consumer should be able
				// to make an effect that depends on cam.intersectedElemnts but
				// it doesn't work right now for some reason.
				this.onIntersect?.(this.intersectedElements)
			})
		})
	}, 50) // TODO what's a good value?

	/** Manually tell the camera when to run intersection. */
	intersect() {
		this.throttledIntersect[0]()
	}

	constructor() {
		// Experimenting with createMutable(this) vs using @signal for
		// properties. This might be easier for making all props implicitly
		// reactive, but more overhead.
		//
		// TODO Commenting this out breaks player position synchronization for some
		// reason, no idea why yet. haha.
		// TODO this doesn't work with new @signal yet, because...
		// console.log('descriptor before:', Object.getOwnPropertyDescriptor(this, 'onPlayerMove'))
		// const self = createMutable(this)
		// console.log('descriptor after:', Object.getOwnPropertyDescriptor(this, 'onPlayerMove'))
		// return self
	}
}

export {FirstPersonCamera}

async function shadow(el: Element, args: () => JSX.Element | [JSX.Element, ShadowRootInit] | true) {
	const _args = args()
	const [shadowChildren, shadowOptions = {mode: 'open'}] =
		_args === true
			? [() => <></>] // no args
			: isShadowArgTuple(_args)
			? _args
			: [() => _args]

	// FIXME HACKY: Defer for one microtask so custom element upgrades can happen. Will this always work?
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
