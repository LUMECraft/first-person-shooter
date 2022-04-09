import {render} from 'solid-js/web'
import {App} from './App'

let appName = 'LUMECraft First Person Shooter'
Session.set('appTitle', appName)

Tracker.autorun(() => {
	document.title = Session.get('appTitle')
})

main()
function main() {
	const root = document.createElement('div')
	root.id = 'root' // needed for styling
	document.body.append(root)

	render(() => <App></App>, root)
}

// type t = JSX.Element
