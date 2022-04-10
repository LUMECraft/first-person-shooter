import {defineElements, Scene} from 'lume'
import {createEffect, createMemo, createSignal, Index, onCleanup, onMount, Show} from 'solid-js'
import createThrottle from '@solid-primitives/throttle'
import {Character} from './Character'
import {Rifle} from './Rifle'
// import {Tween, Easing} from '@tweenjs/tween.js'
import {reactive, signal, component, Props} from 'classy-solid'
import {FirstPersonCamera} from './FirstPersonCamera'
import {Lights} from './Lights'
import {Player, playersCollection} from '../imports/collections/players'

// type t = React.Component<{n: number}>
// type t2 = JSX.ElementClass

// Define all the LUME elements with their default names.
defineElements()

@component
@reactive
export class App {
	PropTypes!: Props<this, never> // never means no JSX props

	@signal playerId = ''
	@signal player: Player | undefined = undefined
	@signal players: Player[] = []

	scene!: Scene

	onMount() {
		createEffect(() => {
			let computation: Tracker.Computation

			Tracker.autorun(comp => {
				computation = comp
				this.players = playersCollection.find({}).fetch()
			})

			onCleanup(() => computation.stop())
		})

		createEffect(() => {
			if (!this.playerId) return

			let computation: Tracker.Computation

			Tracker.autorun(comp => {
				computation = comp
				this.player = playersCollection.findOne({id: this.playerId})
			})

			onCleanup(() => computation.stop())
		})

		Meteor.call('addPlayer', (_error: any, id: string) => {
			queueMicrotask(() => {
				console.log('client player id: ', id)
				this.playerId = id
			})

			window.addEventListener('unload', () => {
				Meteor.call('disconnect', id)
			})
		})
	}

	updatePlayer() {}

	onPlayerMove = createThrottle(({x, y, z, rx, ry}: {x: number; y: number; z: number; rx: number; ry: number}) => {
		Meteor.call('updatePlayer', {id: this.playerId, x, y, z, rx, ry, crouch: this.player!.crouch})
	}, 20) // TODO what's a good throttle value?

	template() {
		return (
			<>
				<lume-scene ref={this.scene} perspective="800" webgl enable-css="false" shadowmap-type="pcfsoft">
					<lume-node size-mode="proportional proportional" size="1 1">
						<Lights />

						{/* background */}
						{/* <lume-sphere
							has="basic-material"
							color="white"
							sidedness="double"
							texture="https://assets.codepen.io/191583/airplane-hanger-env-map.jpg"
							size="100000"
							mount-point="0.5 0.5 0.5"
						></lume-sphere> */}

						{/* floor */}
						<lume-plane
							color="brown"
							rotation="90 0 0"
							mount-point="0.5 0.5"
							size="5000 5000"
							position="0 300 0"
						></lume-plane>

						{/* TODO better loading experience */}
						<Show when={this.player} fallback={<lume-box size="200 200 200" color="pink"></lume-box>}>
							{/* @ts-expect-error JSX type in classy-solid needs update */}
							<FirstPersonCamera onPlayerMove={this.onPlayerMove[0]}>
								<lume-node position="40 120 -100" slot="camera-child">
									<Rifle shootOnClick={true} onShoot={() => Meteor.call('shoot', this.playerId)} />
								</lume-node>

								<lume-node
									position="0 320 0"
									rotation="0 180 0"
									scale="0.48 0.48 0.48"
									slot="camera-child"
								>
									<lume-fbx-model
										id="model"
										rotation="0 0 0"
										src="/ChuckChuck/head.fbx"
									></lume-fbx-model>
								</lume-node>

								<Character />
							</FirstPersonCamera>

							<Index each={this.players}>
								{player => {
									if (player().id === this.playerId) return null

									const [rifle, setRifle] = createSignal<Rifle>()

									onMount(() => {
										const shot = createMemo(() => player().shots)

										let firstRun = true

										createEffect(() => {
											if (!shot() || !rifle() || firstRun) return
											if (firstRun) return (firstRun = false)

											rifle()!.shoot()
										})
									})

									return (
										// The rotation/position attributes here are essentially duplicate of what <FirstPersonCamera> is doing.
										// TODO: consolidate the duplication
										<lume-node
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
														id="model"
														rotation="0 0 0"
														src="/ChuckChuck/head.fbx"
													></lume-fbx-model>
												</lume-node>
											</lume-node>

											<Character />
										</lume-node>
									)
								}}
							</Index>
						</Show>
					</lume-node>
				</lume-scene>

				<div class="crosshair"></div>
			</>
		)
	}
}
