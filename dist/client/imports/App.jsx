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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
import { FbxModel, Element3D, Scene, isMesh, XYZNumberValues } from 'lume';
import { batch, createEffect, createMemo, createSignal, getOwner, Index, onCleanup, onMount, Show, untrack, } from 'solid-js';
import createThrottle from '@solid-primitives/throttle';
import { Tracker } from 'meteor/tracker';
import { Character } from './Character';
import { Rifle } from './Rifle';
// import {Tween, Easing} from '@tweenjs/tween.js'
import { reactive, signal, component, createSignalObject, createSignalFunction, } from 'classy-solid';
import { FirstPersonCamera } from './FirstPersonCamera';
import { Lights } from './Lights';
import { playersCollection } from '../../imports/collections/players';
import { mapItems } from '../../imports/collections/mapItems';
let App = (() => {
    let _classDecorators = [component, reactive];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _playerId_decorators;
    let _playerId_initializers = [];
    let _playerId_extraInitializers = [];
    let _player_decorators;
    let _player_initializers = [];
    let _player_extraInitializers = [];
    let _players_decorators;
    let _players_initializers = [];
    let _players_extraInitializers = [];
    let _health_decorators;
    let _health_initializers = [];
    let _health_extraInitializers = [];
    let _dead_decorators;
    let _dead_initializers = [];
    let _dead_extraInitializers = [];
    let _mapItems_decorators;
    let _mapItems_initializers = [];
    let _mapItems_extraInitializers = [];
    let _intersectedElements_decorators;
    let _intersectedElements_initializers = [];
    let _intersectedElements_extraInitializers = [];
    var App = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _playerId_decorators = [signal];
            _player_decorators = [signal];
            _players_decorators = [signal];
            _health_decorators = [signal];
            _dead_decorators = [signal];
            _mapItems_decorators = [signal];
            _intersectedElements_decorators = [signal];
            __esDecorate(null, null, _playerId_decorators, { kind: "field", name: "playerId", static: false, private: false, access: { has: obj => "playerId" in obj, get: obj => obj.playerId, set: (obj, value) => { obj.playerId = value; } }, metadata: _metadata }, _playerId_initializers, _playerId_extraInitializers);
            __esDecorate(null, null, _player_decorators, { kind: "field", name: "player", static: false, private: false, access: { has: obj => "player" in obj, get: obj => obj.player, set: (obj, value) => { obj.player = value; } }, metadata: _metadata }, _player_initializers, _player_extraInitializers);
            __esDecorate(null, null, _players_decorators, { kind: "field", name: "players", static: false, private: false, access: { has: obj => "players" in obj, get: obj => obj.players, set: (obj, value) => { obj.players = value; } }, metadata: _metadata }, _players_initializers, _players_extraInitializers);
            __esDecorate(null, null, _health_decorators, { kind: "field", name: "health", static: false, private: false, access: { has: obj => "health" in obj, get: obj => obj.health, set: (obj, value) => { obj.health = value; } }, metadata: _metadata }, _health_initializers, _health_extraInitializers);
            __esDecorate(null, null, _dead_decorators, { kind: "field", name: "dead", static: false, private: false, access: { has: obj => "dead" in obj, get: obj => obj.dead, set: (obj, value) => { obj.dead = value; } }, metadata: _metadata }, _dead_initializers, _dead_extraInitializers);
            __esDecorate(null, null, _mapItems_decorators, { kind: "field", name: "mapItems", static: false, private: false, access: { has: obj => "mapItems" in obj, get: obj => obj.mapItems, set: (obj, value) => { obj.mapItems = value; } }, metadata: _metadata }, _mapItems_initializers, _mapItems_extraInitializers);
            __esDecorate(null, null, _intersectedElements_decorators, { kind: "field", name: "intersectedElements", static: false, private: false, access: { has: obj => "intersectedElements" in obj, get: obj => obj.intersectedElements, set: (obj, value) => { obj.intersectedElements = value; } }, metadata: _metadata }, _intersectedElements_initializers, _intersectedElements_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            App = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        PropTypes; // never means no JSX props
        playerId = __runInitializers(this, _playerId_initializers, '');
        player = (__runInitializers(this, _playerId_extraInitializers), __runInitializers(this, _player_initializers, undefined));
        players = (__runInitializers(this, _player_extraInitializers), __runInitializers(this, _players_initializers, []));
        health = (__runInitializers(this, _players_extraInitializers), __runInitializers(this, _health_initializers, 100));
        dead = (__runInitializers(this, _health_extraInitializers), __runInitializers(this, _dead_initializers, false));
        playerElements = (__runInitializers(this, _dead_extraInitializers), createSignalObject(new Map(), { equals: false }));
        mapItems = __runInitializers(this, _mapItems_initializers, []);
        intersectedElements = (__runInitializers(this, _mapItems_extraInitializers), __runInitializers(this, _intersectedElements_initializers, []));
        crouchAmount = (__runInitializers(this, _intersectedElements_extraInitializers), 100);
        head;
        scene;
        onMount() {
            // join player to the match
            Meteor.call('addPlayer', (_error, id) => {
                queueMicrotask(() => (this.playerId = id));
                window.addEventListener('unload', () => Meteor.call('disconnect', id));
            });
            trackerAutorun(() => (this.players = playersCollection.find({}, { fields: { id: 1 } }).fetch()));
            trackerAutorun(() => (this.mapItems = mapItems.find().fetch()));
            createEffect(() => {
                this.playerId;
                trackerAutorun(() => {
                    this.health = playersCollection.findOne(this.playerId)?.health ?? 100;
                });
            });
            createEffect(() => {
                if (!this.playerId)
                    return;
                // if no more life, die, refresh browser to respawn.
                if (this.health <= 0) {
                    Meteor.call('disconnect', this.playerId);
                    batch(() => {
                        this.dead = true;
                        this.playerId = '';
                        this.player = undefined;
                    });
                }
            });
            createEffect(() => {
                if (!this.playerId)
                    return;
                trackerAutorun(() => (this.player = playersCollection.findOne({ id: this.playerId })));
            });
            createEffect(() => {
                if (!this.playerId)
                    return;
                const int = setInterval(() => Meteor.call('heartbeat', this.playerId), 1000);
                onCleanup(() => clearInterval(int));
            });
            createEffect(() => {
                if (!this.player)
                    return;
                // CONTINUE test with new model load event on lume dom-events  branch
                // this.head.addEventListener('load', () => {
                this.head.on('MODEL_LOAD', () => {
                    this.head.three.traverse(n => {
                        if (isMesh(n)) {
                            // TODO attribute for model loaders so we don't have to manually do this to Three.js objects.
                            n.castShadow = true;
                            n.receiveShadow = true;
                            // n.material.transparent = true
                            // n.material.opacity = 0
                        }
                    });
                });
            });
            createEffect(() => {
                // Assume bullet hits only the first person it reaches.
                const unluckyPlayerId = this.playerElements.get().get(this.intersectedElements[0]);
                if (!unluckyPlayerId)
                    return;
                Meteor.call('hit', unluckyPlayerId);
            });
            // Random initial placement for player
            createEffect(() => {
                if (!this.camera())
                    return;
                // start in a random place
                const pos = this.camera().camPosition;
                const playArea = 10000;
                pos.x = playArea * Math.random() - playArea / 2;
                pos.z = playArea * Math.random() - playArea / 2;
                // start looking in a random direction
                const rot = this.camera().camRotation;
                rot.y = 360 * Math.random();
            });
        }
        // TODO this is very simple naive throttling
        onPlayerMove = createThrottle(({ x, y, z, rx, ry, crouch }) => {
            Meteor.call('updatePlayer', { id: this.playerId, x, y, z, rx, ry, crouch });
        }, 150);
        camera = createSignalFunction();
        template = () => (<>
			<lume-scene ref={this.scene} perspective="800" webgl enable-css="false" shadowmap-type="pcfsoft">
				<lume-element3d size-mode="proportional proportional" size="1 1">
					<Lights />

					{/* sky */}
					<lume-sphere has="basic-material" color="#94c4ff" sidedness="double" size="100000" mount-point="0.5 0.5 0.5"></lume-sphere>

					{/* ground */}
					<lume-plane color="#626e43" rotation="90 0 0" mount-point="0.5 0.5" size="200000 200000" position="0 315 0"></lume-plane>

					{/* TODO better loading experience */}
					<Show when={this.player} fallback={<lume-box size="200 200 200" color="pink"></lume-box>}>
						<FirstPersonCamera instance={this.camera} onPlayerMove={this.onPlayerMove[0]} crouchAmount={this.crouchAmount} elementsToIntersect={new Set(this.playerElements.get().keys())} 
        // TODO we should be able to instead createEffect(() => camera.intersectedElements) but that currently doesn't work.
        onIntersect={(els) => (this.intersectedElements = els ?? [])} autoIntersect={false} // we'll tell it when to intersect, which will be only when we shoot.
        >
							<lume-element3d position="40 120 -100" slot="camera-child">
								<Rifle shootOnClick={true} shotThrottle={400} onShoot={() => {
                if (!this.camera())
                    return;
                // Quick hacky: In an proper game, shot intersection would probably be detected by the server instead of the client to avoid cheating?
                this.camera().intersect();
                Meteor.call('shoot', this.playerId);
            }}/>
							</lume-element3d>

							{/* This is the current player's head, but we don't need to show it in first-person PoV. */}
							<lume-element3d position="0 320 50" rotation="0 180 0" scale="0.48 0.48 0.48" slot="camera-child">
								<lume-fbx-model ref={this.head} rotation="0 0 0" src="/ChuckChuck/head.fbx"></lume-fbx-model>
							</lume-element3d>

							{/* move player body backward just a tad for better view when looking down */}
							<lume-element3d position="0 0 40">
								<Character />
							</lume-element3d>
						</FirstPersonCamera>

						<Index each={this.players}>
							{player => (<PlayerComp thisPlayerId={this.playerId} player={player()} playerElements={this.playerElements}/>)}
						</Index>
					</Show>

					{/* map */}
					<Index each={this.mapItems}>{item => <MapItemComp item={item()}/>}</Index>
				</lume-element3d>
			</lume-scene>

			<div class="overlay">
				<div class="crosshair"></div>

				<div class="health-bar">
					<div class="health-value" style={{ width: this.health + '%' }}></div>
				</div>

				<Show when={this.dead}>
					<div class="dead">
						<h1>
							YER DEAD!
							<br />
							<sub>(refresh browser to respawn)</sub>
						</h1>
					</div>
				</Show>
			</div>
		</>);
    };
    return App = _classThis;
})();
export { App };
const mapItemScales = {
    tree: 2,
    big_tree: 1,
    shrub: 1.4,
    shrub2: 1.4,
    stone: 1.5,
};
function trackerAutorun(effect) {
    let computation;
    Tracker.autorun(comp => {
        computation = comp;
        effect();
    });
    if (getOwner())
        onCleanup(() => computation.stop());
}
function PlayerComp(props) {
    let head;
    let playerElement;
    const [player, setPlayer] = createSignal();
    const [rifle, setRifle] = createSignal();
    const id = createMemo(() => props.player.id);
    onMount(() => {
        createEffect(() => {
            if (id() === props.thisPlayerId)
                return;
            trackerAutorun(() => {
                setPlayer(playersCollection.findOne({ id: id() }));
            });
            const connected = createMemo(() => !!player()?.connected);
            const shots = createMemo(() => player()?.shots ?? 0);
            createEffect(() => {
                if (!connected())
                    return;
                let firstRun = true;
                createEffect(() => {
                    if (!shots() || !rifle())
                        return;
                    if (firstRun)
                        return (firstRun = false);
                    rifle().shoot();
                    return undefined;
                });
                createEffect(() => {
                    untrack(() => props.playerElements.get().set(playerElement, id()));
                    props.playerElements.set(v => v); // trigger reactivity
                    onCleanup(() => {
                        props.playerElements.get().delete(playerElement);
                        props.playerElements.set(v => v); // trigger reactivity
                    });
                });
                // head.addEventListener('load', () => {
                head.on('MODEL_LOAD', () => {
                    head.three.traverse(n => {
                        if (isMesh(n)) {
                            // TODO attribute for model loaders so we don't have to manually do this to Three.js objects.
                            n.castShadow = true;
                            n.receiveShadow = true;
                        }
                    });
                });
            });
        });
    });
    return (
    // The rotation/position attributes here are essentially duplicate of what <FirstPersonCamera> is doing.
    // TODO: consolidate the duplication
    <Show when={id() !== props.thisPlayerId && player()?.connected} fallback={<></>}>
			<lume-element3d ref={playerElement} rotation={new XYZNumberValues([0, player().ry])} position={new XYZNumberValues([player().x, player().y, player().z])}>
				<lume-element3d rotation={new XYZNumberValues([player().rx])}>
					<lume-element3d position="40 120 -100">
						<Rifle instance={setRifle}/>
					</lume-element3d>

					<lume-element3d position="0 320 0" rotation="0 180 0" scale="0.48 0.48 0.48" slot="camera-child">
						<lume-fbx-model ref={head} rotation="0 0 0" src="/ChuckChuck/head.fbx"></lume-fbx-model>
					</lume-element3d>
				</lume-element3d>

				<Character />
			</lume-element3d>
		</Show>);
}
function MapItemComp(props) {
    const scale = mapItemScales[props.item.type];
    let model;
    onMount(() => {
        // model.addEventListener('load', () => {
        model.on('MODEL_LOAD', () => {
            model.three.traverse(n => {
                if (isMesh(n)) {
                    // TODO attribute for model loaders so we don't have to manually do this to Three.js objects.
                    n.castShadow = true;
                    n.receiveShadow = true;
                }
            });
        });
    });
    return (<lume-fbx-model ref={model} position={new XYZNumberValues([props.item.x, 320, props.item.z])} src={`/${props.item.type}.fbx`} scale={new XYZNumberValues([scale, scale, scale])}></lume-fbx-model>);
}
//# sourceMappingURL=App.jsx.map