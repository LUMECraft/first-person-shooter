import {ReactiveVar} from 'meteor/reactive-var'
import {render} from 'solid-js/web'
import {App} from './imports/App'
import {Tracker} from 'meteor/tracker'

Meteor.subscribe('players')

const title = new ReactiveVar('LUMECraft First Person Shooter')
Tracker.autorun(() => (document.title = title.get()))

main()

async function main() {
	const root = document.createElement('div')
	root.id = 'root' // needed for styling
	document.body.append(root)

	render(() => <App></App>, root)
}

// type t = JSX.Element
