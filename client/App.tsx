import {defineElements, Scene} from 'lume'
import {Character} from './Character'
import {Rifle} from './Rifle'
// import {Tween, Easing} from '@tweenjs/tween.js'
// import {reactive, signal} from 'classy-solid'
import {component, Props} from 'classy-solid'
import {FirstPersonCamera} from './FirstPersonCamera'
import {Lights} from './Lights'

// type t = React.Component<{n: number}>
// type t2 = JSX.ElementClass

// Define all the LUME elements with their default names.
defineElements()

@component
// @reactive
export class App {
	PropTypes!: Props<this, never> // never means no JSX props

	scene!: Scene

	onMount() {}

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
						{/* <lume-plane
							color="brown"
							rotation="90 0 0"
							mount-point="0.5 0.5"
							size="5000 5000"
							position="0 300 0"
						></lume-plane> */}

						<lume-node position="0 320 0">
							<Character />
						</lume-node>

						{/* @ts-expect-error JSX type in classy-solid needs update */}
						<FirstPersonCamera>
							<Rifle />
							<lume-node position="0 320 0">
								<Character />
							</lume-node>
						</FirstPersonCamera>
					</lume-node>
				</lume-scene>

				<div class="crosshair"></div>
			</>
		)
	}
}
