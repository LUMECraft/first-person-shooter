/*
todo
- raycast on shoot
- make particle blast
- add health bar
- on shoot player
  - show (red?) particle blast
  - lower health
- on 0 health
  - disconnect player
  - blast particles when player body disappears
  - show dead icon
  - for now, just refresh to respawn (kinda funny if you think about the implications of how web apps work)
- add shot count
- add number of kills
- add match name/ID as URL query param
*/

import {defineElements, Events, FbxModel, Node, Scene} from 'lume'
import {createEffect, createMemo, createSignal, Index, onCleanup, onMount, Show, untrack} from 'solid-js'
import createThrottle from '@solid-primitives/throttle'
import {Character} from './Character'
import {Rifle} from './Rifle'
// import {Tween, Easing} from '@tweenjs/tween.js'
import {reactive, signal, component, Props, createSignalObject} from 'classy-solid'
import {FirstPersonCamera} from './FirstPersonCamera'
import {Lights} from './Lights'
import {Player, playersCollection} from '../imports/collections/players'
import {MapItem, mapItems} from '../imports/collections/mapItems'

// Define all the LUME elements with their default names.
defineElements()

@component
@reactive
export class App {
	PropTypes!: Props<this, never> // never means no JSX props

	@signal playerId = ''
	@signal player: Player | undefined = undefined
	@signal players: Player[] = []

	playerElements = createSignalObject(new Set<Node>(), {equals: false})

	constructor() {
		// debug
		window.playerElements = this.playerElements
	}

	@signal mapItems: MapItem[] = []

	readonly crouchAmount = 100

	head!: FbxModel
	scene!: Scene

	onMount() {
		trackerAutorun(() => (this.players = playersCollection.find().fetch()))
		trackerAutorun(() => (this.mapItems = mapItems.find().fetch()))

		createEffect(() => {
			if (!this.playerId) return

			let computation: Tracker.Computation

			Tracker.autorun(comp => {
				computation = comp
				this.player = playersCollection.findOne({id: this.playerId})
			})

			onCleanup(() => computation.stop())
		})

		// join player to the match
		Meteor.call('addPlayer', (_error: any, id: string) => {
			queueMicrotask(() => (this.playerId = id))
			window.addEventListener('unload', () => Meteor.call('disconnect', id))
		})

		createEffect(() => {
			if (!this.playerId) return
			const int = setInterval(() => Meteor.call('heartbeat', this.playerId), 500)
			onCleanup(() => clearInterval(int))
		})

		createEffect(() => {
			if (!this.player) return

			this.head.on(Events.MODEL_LOAD, () => {
				this.head.three.traverse(n => {
					if (n.material) {
						const m = n as THREE.Mesh
						// TODO attribute for model loaders so we don't have to manually do this to Three.js objects.
						m.castShadow = true
						m.receiveShadow = true
						// m.material.transparent = true
						// m.material.opacity = 0
					}
				})
			})
		})
		// setTimeout(() => {
		// }, 1000)
	}

	// TODO this is very simple naive throttling
	onPlayerMove = createThrottle(
		({x, y, z, rx, ry, crouch}: {x: number; y: number; z: number; rx: number; ry: number; crouch: boolean}) => {
			Meteor.call('updatePlayer', {id: this.playerId, x, y, z, rx, ry, crouch})
		},
		20,
	)

	template() {
		return (
			<>
				<lume-scene ref={this.scene} perspective="800" webgl enable-css="false" shadowmap-type="pcfsoft">
					<lume-node size-mode="proportional proportional" size="1 1">
						<Lights />

						{/* sky */}
						<lume-sphere
							has="basic-material"
							color="#94c4ff"
							sidedness="double"
							size="100000"
							mount-point="0.5 0.5 0.5"
						></lume-sphere>

						{/* ground */}
						<lume-plane
							color="#626e43"
							rotation="90 0 0"
							mount-point="0.5 0.5"
							size="200000 200000"
							position="0 315 0"
						></lume-plane>

						{/* TODO better loading experience */}
						<Show when={this.player} fallback={<lume-box size="200 200 200" color="pink"></lume-box>}>
							{/* @ts-expect-error JSX type in classy-solid needs update */}
							<FirstPersonCamera
								onPlayerMove={this.onPlayerMove[0]}
								crouchAmount={this.crouchAmount}
								intersectObjects={this.playerElements.get()}
							>
								<lume-node position="40 120 -100" slot="camera-child">
									<Rifle shootOnClick={true} onShoot={() => Meteor.call('shoot', this.playerId)} />
								</lume-node>

								{/* This is the current player's head, but we don't need to show it in first-person PoV. */}
								<lume-node
									position="0 320 50"
									rotation="0 180 0"
									scale="0.48 0.48 0.48"
									slot="camera-child"
								>
									<lume-fbx-model
										ref={this.head}
										rotation="0 0 0"
										src="/ChuckChuck/head.fbx"
									></lume-fbx-model>
								</lume-node>

								{/* move player body backward just a tad for better view when looking down */}
								<lume-node position="0 0 40">
									<Character />
								</lume-node>
							</FirstPersonCamera>

							<Index each={this.players}>
								{player => {
									if (player().id === this.playerId) return null

									const [rifle, setRifle] = createSignal<Rifle>()
									let head!: FbxModel
									let playerElement!: Node

									onMount(() => {
										const shots = createMemo(() => player().shots)

										let firstRun = true

										createEffect(() => {
											if (!shots() || !rifle()) return
											if (firstRun) return (firstRun = false)

											rifle()!.shoot()
										})

										createEffect(() => {
											if (!player().connected) return

											head.on(Events.MODEL_LOAD, () => {
												head.three.traverse(n => {
													if (n.material) {
														const m = n as THREE.Mesh
														// TODO attribute for model loaders so we don't have to manually do this to Three.js objects.
														m.castShadow = true
														m.receiveShadow = true
													}
												})
											})
										})

										this.playerElements.get().add(playerElement)
										this.playerElements.set(v => v) // trigger reactivity
										console.log('add player element', [...this.playerElements.get()])
										debugger
									})

									return (
										// The rotation/position attributes here are essentially duplicate of what <FirstPersonCamera> is doing.
										// TODO: consolidate the duplication
										<Show
											when={player().connected}
											fallback={untrack(() => {
												this.playerElements.get().delete(playerElement)
												this.playerElements.set(v => v) // trigger reactivity
												console.log('delete player element', [...this.playerElements.get()])
												debugger
												return <></>
											})}
										>
											<lume-node
												ref={playerElement}
												// ref={el => {
												// 	untrack(() => {
												// 		this.playerElements.get().add((playerElement = el))
												// 		this.playerElements.set(v => v) // trigger reactivity
												// 	})
												// }}
												rotation={[0, player().ry]}
												position={[player().x, player().y, player().z]}
											>
												<lume-node rotation={[player().rx]}>
													<lume-node position="40 120 -100">
														<Rifle instance={setRifle} />
													</lume-node>

													<lume-node
														position="0 320 0"
														rotation="0 180 0"
														scale="0.48 0.48 0.48"
														slot="camera-child"
													>
														<lume-fbx-model
															ref={head}
															rotation="0 0 0"
															src="/ChuckChuck/head.fbx"
														></lume-fbx-model>
													</lume-node>
												</lume-node>

												<Character />
											</lume-node>
										</Show>
									)
								}}
							</Index>
						</Show>

						{/* map */}
						<Index each={this.mapItems}>
							{item => {
								const scale = mapItemScales[item().type]
								let model!: FbxModel

								// model.on(Events.MODEL_LOAD, () => {
								setTimeout(() => {
									model.three.traverse(n => {
										if (n.material) {
											const m = n as THREE.Mesh
											// TODO attribute for model loaders so we don't have to manually do this to Three.js objects.
											m.castShadow = true
											m.receiveShadow = true
										}
									})
								}, 1000)

								return (
									<lume-fbx-model
										ref={model}
										position={[item().x, 320, item().z]}
										src={`/${item().type}.fbx`}
										scale={[scale, scale, scale]}
									></lume-fbx-model>
								)
							}}
						</Index>
					</lume-node>
				</lume-scene>

				<div class="crosshair"></div>
			</>
		)
	}
}

const mapItemScales = {
	tree: 2,
	big_tree: 1,
	shrub: 1.4,
	shrub2: 1.4,
	stone: 1.5,
}

function trackerAutorun(effect) {
	let computation: Tracker.Computation
	Tracker.autorun(comp => {
		computation = comp
		effect()
	})
	onCleanup(() => computation.stop())
}
