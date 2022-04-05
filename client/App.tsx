import {Box, defineElements, Motor, Node, RenderTask, Scene, XYZNumberValues} from 'lume'
// import {Tween, Easing} from '@tweenjs/tween.js'
import {reactive, signal} from 'classy-solid'
import {Constructor} from 'lowclass'
import {onMount, createEffect, Component, onCleanup} from 'solid-js'
import type {JSX} from 'solid-js'
// import {render} from 'solid-js/web'

// type t = React.Component<{n: number}>
// type t2 = JSX.ElementClass

// Define all the LUME elements with their default names.
defineElements()

@component
@reactive
export class App {
	camRotation = new XYZNumberValues()
	camPosition = new XYZNumberValues()

	// PropTypes!: Props<this, 'foo'>

	scene!: Scene
	gunshot!: HTMLAudioElement
	tracer!: Box
	explosion!: Node

	onMount() {
		// TODO move to onmousedown={} prop inside JSX (currently doesn't work, bug?)
		this.scene.addEventListener('mousedown', () => {
			;(this.gunshot.cloneNode() as HTMLAudioElement).play()

			if (Math.random() < 0.25) this.tracer.visible = true
			this.explosion.visible = true

			setTimeout(() => {
				this.tracer.visible = false
				this.explosion.visible = false
			}, 100)
		})

		// TODO move to onmousedown={} prop inside JSX (currently doesn't work, bug?)
		this.scene.addEventListener('click', () => {
			if (document.pointerLockElement) return
			this.scene.requestPointerLock()

			const onmove = (e: PointerEvent) => {
				console.log('move:', e.movementX)

				this.camRotation.y += -e.movementX * 0.1
				this.camRotation.x += e.movementY * 0.1
				this.camRotation = this.camRotation
			}

			this.scene.addEventListener('pointermove', onmove)

			document.addEventListener('pointerlockchange', () => {
				if (!document.pointerLockElement) this.scene.removeEventListener('pointermove', onmove)
			})

			// TODO handle failed pointer lock request :(
		})

		const keysDown = {w: false, a: false, s: false, d: false}

		for (const key of ['w', 'a', 's', 'd'] as const) {
			window.addEventListener('keydown', e => {
				if (!document.pointerLockElement) return
				if (key != e.key) return
				if (keysDown[key]) return

				keysDown[key] = true

				let task: RenderTask

				if (key === 'w') task = () => ((this.camPosition.z -= 10), keysDown[key])
				if (key === 'a') task = () => ((this.camPosition.x -= 10), keysDown[key])
				if (key === 's') task = () => ((this.camPosition.z += 10), keysDown[key])
				if (key === 'd') task = () => ((this.camPosition.x += 10), keysDown[key])

				Motor.addRenderTask(task)
			})

			window.addEventListener('keyup', e => {
				if (!document.pointerLockElement) return
				if (key != e.key) return
				keysDown[key] = false
			})
		}
	}

	template() {
		return (
			<>
				<lume-scene ref={this.scene} perspective="800" webgl>
					<lume-point-light position="200 -200 200" intensity="0.6" color="white"></lume-point-light>

					<lume-ambient-light color="white" intensity="0.6"></lume-ambient-light>

					{/* <!-- background --> */}
					<lume-sphere
						has="basic-material"
						color="white"
						sidedness="double"
						texture="https://assets.codepen.io/191583/airplane-hanger-env-map.jpg"
						size="4000"
						mount-point="0.5 0.5 0.5"
					></lume-sphere>

					<lume-node
						rotation={[0, this.camRotation.y]}
						position={[this.camPosition.x, 0, this.camPosition.z]}
					>
						<lume-perspective-camera active rotation={[this.camRotation.x]}>
							{/* <!-- rifle --> */}
							<lume-node rotation="0 180 0" position="15 5 -15">
								{/* <!-- barrel --> */}
								<lume-box size="4 4 100" color="gray" rotation="0 0 0" position="0 0 0">
									{/* <!-- tip --> */}
									{/* <!-- prettier-ignore --> */}
									<lume-box
										size="1 3 1"
										color="gold"
										align-point="0.5 0 1"
										mount-point="0.5 1 1"
									></lume-box>

									<lume-node ref={this.explosion} visible="false" align-point="0.5 0.5 1">
										<lume-sphere
											has="basic-material"
											opacity="0.5"
											size="20 20 20"
											color="yellow"
											mount-point="0.5 0.5 0"
										></lume-sphere>
									</lume-node>

									<lume-box
										ref={this.tracer}
										visible="false"
										has="basic-material"
										opacity="0.6"
										size="2 2 2000"
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
								{/* <!-- prettier-ignore --> */}
								<lume-box
									size="4 7 25"
									color="gray"
									rotation="8 0 0"
									position="0 0 0"
									mount-point="0 0 1"
									origin="0.5 0.5 1"
								></lume-box>
								{/* <!-- prettier-ignore --> */}
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
							</lume-node>
						</lume-perspective-camera>
					</lume-node>

					{/* <lume-node>
						<lume-camera-rig
							active="false"
							initial-distance="0"
							max-distance="500"
							min-distance="0"
							min-polar-angle="-90"
							max-polar-angle="90"
							rotation="0 0 0"
						></lume-camera-rig>
					</lume-node> */}
				</lume-scene>

				<div class="crosshair"></div>

				<audio ref={this.gunshot} src="/gunshot.mp3"></audio>
			</>
		)
	}
}

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

// https://github.com/ryansolid/dom-expressions/pull/122

interface PossibleComponent {
	onMount?(): void
	onCleanup?(): void
	template?(): JSX.Element
}
interface PossiblyReactiveConstructor {
	signalProperties: string[]
}

// function component<T extends Constructor>(Base: T): T & (() => JSX.Element) {
export function component<T extends Constructor>(
	Base: T,
): Component<{}> & T & {new (): {render: (props: any) => JSX.Element}} {
	const Class = Constructor<PossibleComponent, PossiblyReactiveConstructor>(Base)

	return (((props?: any): JSX.Element => {
		const instance = new Class()

		for (const prop of Class.signalProperties ?? []) {
			if (!(prop in props)) continue // need this? Can prop spread instroduce new props that we'll miss because of this?

			createEffect(() => {
				// @ts-expect-error
				instance[prop] = props[prop]
			})
		}

		if (instance.onMount) onMount(() => instance.onMount!())
		if (instance.onCleanup) onCleanup(() => instance.onCleanup!())

		return instance.template?.() ?? null
	}) as unknown) as T & (() => JSX.Element) & {new (): {render: (props: any) => JSX.Element}} // hacky cast to tell TypeScript to allow the decorator.
}

declare module '@lume/element' {
	namespace JSX {
		interface ElementClass {
			template?(): JSX.Element
		}

		interface ElementAttributesProperty {
			PropTypes: {}
		}
		interface ElementChildrenAttribute {
			children: {}
		}
	}
}

export type Props<T extends object, K extends keyof T> = Pick<T, K> & {
	children?: JSX.Element
}
