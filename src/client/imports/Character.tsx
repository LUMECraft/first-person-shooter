import {component} from 'classy-solid'
import {FbxModel, isMesh, type Element3D} from 'lume'

export
@component
class Character {
	// PropTypes!: Props<this, ...>

	root!: Element3D
	models: FbxModel[] = []

	onMount() {
		const promises: Promise<void>[] = []

		this.models.forEach(m => {
			promises.push(new Promise<void>(resolve => m.on('MODEL_LOAD', resolve)))
		})

		Promise.all(promises).then(() => {
			this.root.three.traverse(n => {
				if (isMesh(n)) {
					// TODO attribute for model loaders so we don't have to manually do this to Three.js objects.
					n.castShadow = true
					n.receiveShadow = true
				}
			})
		})
	}

	template = () => (
		<lume-element3d ref={this.root} position="0 320 0" rotation="0 180 0" scale="0.48 0.48 0.48">
			<lume-element3d>
				<lume-fbx-model ref={(e: FbxModel) => this.models.push(e)} src="/ChuckChuck/body.fbx"></lume-fbx-model>
				<lume-fbx-model
					ref={(e: FbxModel) => this.models.push(e)}
					src="/ChuckChuck/left_arm.fbx"
				></lume-fbx-model>
				<lume-fbx-model
					ref={(e: FbxModel) => this.models.push(e)}
					src="/ChuckChuck/right_arm.fbx"
				></lume-fbx-model>
				<lume-fbx-model
					ref={(e: FbxModel) => this.models.push(e)}
					src="/ChuckChuck/left_leg.fbx"
				></lume-fbx-model>
				<lume-fbx-model
					ref={(e: FbxModel) => this.models.push(e)}
					src="/ChuckChuck/right_leg.fbx"
				></lume-fbx-model>
			</lume-element3d>
		</lume-element3d>
	)
}
