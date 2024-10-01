// import {reactive, signal} from 'classy-solid'
import {component} from 'classy-solid'
import {isMesh, type Element3D} from 'lume'
import {createMutable} from 'solid-js/store'
import type * as THREE from 'three'

export
@component
// @reactive
class Character {
	// PropTypes!: Props<Element3D, '_'>

	root!: Element3D

	onMount() {
		console.log('mount')
		setTimeout(() => {
			this.root.three.traverse(n => {
				if (isMesh(n)) {
					const m = n as THREE.Mesh
					// TODO attribute for model loaders so we don't have to manually do this to Three.js objects.
					m.castShadow = true
					m.receiveShadow = true
				}
			})
		}, 1000)
	}

	constructor() {
		return createMutable(this)
	}

	template = () => {
		console.log('template')
		return (
			<lume-element3d ref={this.root} position="0 320 0" rotation="0 180 0" scale="0.48 0.48 0.48">
				<lume-element3d rotation="0 0 0">
					<lume-fbx-model id="model" rotation="0 0 0" src="/ChuckChuck/body.fbx"></lume-fbx-model>
					<lume-fbx-model id="model" rotation="0 0 0" src="/ChuckChuck/left_arm.fbx"></lume-fbx-model>
					<lume-fbx-model id="model" rotation="0 0 0" src="/ChuckChuck/right_arm.fbx"></lume-fbx-model>
					<lume-fbx-model id="model" rotation="0 0 0" src="/ChuckChuck/left_leg.fbx"></lume-fbx-model>
					<lume-fbx-model id="model" rotation="0 0 0" src="/ChuckChuck/right_leg.fbx"></lume-fbx-model>
				</lume-element3d>
			</lume-element3d>
		)
	}
}
