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
import { component, reactive, signal } from 'classy-solid';
import createThrottle from '@solid-primitives/throttle';
import { clamp, Motor, Element3D, toRadians, XYZNumberValues, PerspectiveCamera } from 'lume';
import { Raycaster } from 'three';
import { createEffect, onCleanup, JSX, batch } from 'solid-js';
import { render } from 'solid-js/web';
import { Vector2 } from 'three/src/math/Vector2';
const caster = new Raycaster();
let FirstPersonCamera = (() => {
    let _classDecorators = [component, reactive];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instance_decorators;
    let _instance_initializers = [];
    let _instance_extraInitializers = [];
    let _onPlayerMove_decorators;
    let _onPlayerMove_initializers = [];
    let _onPlayerMove_extraInitializers = [];
    let _elementsToIntersect_decorators;
    let _elementsToIntersect_initializers = [];
    let _elementsToIntersect_extraInitializers = [];
    let _intersectedElements_decorators;
    let _intersectedElements_initializers = [];
    let _intersectedElements_extraInitializers = [];
    let _onIntersect_decorators;
    let _onIntersect_initializers = [];
    let _onIntersect_extraInitializers = [];
    let _autoIntersect_decorators;
    let _autoIntersect_initializers = [];
    let _autoIntersect_extraInitializers = [];
    let ___crouchAmount_decorators;
    let ___crouchAmount_initializers = [];
    let ___crouchAmount_extraInitializers = [];
    var FirstPersonCamera = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _instance_decorators = [signal];
            _onPlayerMove_decorators = [signal];
            _elementsToIntersect_decorators = [signal];
            _intersectedElements_decorators = [signal];
            _onIntersect_decorators = [signal];
            _autoIntersect_decorators = [signal];
            ___crouchAmount_decorators = [signal];
            __esDecorate(null, null, _instance_decorators, { kind: "field", name: "instance", static: false, private: false, access: { has: obj => "instance" in obj, get: obj => obj.instance, set: (obj, value) => { obj.instance = value; } }, metadata: _metadata }, _instance_initializers, _instance_extraInitializers);
            __esDecorate(null, null, _onPlayerMove_decorators, { kind: "field", name: "onPlayerMove", static: false, private: false, access: { has: obj => "onPlayerMove" in obj, get: obj => obj.onPlayerMove, set: (obj, value) => { obj.onPlayerMove = value; } }, metadata: _metadata }, _onPlayerMove_initializers, _onPlayerMove_extraInitializers);
            __esDecorate(null, null, _elementsToIntersect_decorators, { kind: "field", name: "elementsToIntersect", static: false, private: false, access: { has: obj => "elementsToIntersect" in obj, get: obj => obj.elementsToIntersect, set: (obj, value) => { obj.elementsToIntersect = value; } }, metadata: _metadata }, _elementsToIntersect_initializers, _elementsToIntersect_extraInitializers);
            __esDecorate(null, null, _intersectedElements_decorators, { kind: "field", name: "intersectedElements", static: false, private: false, access: { has: obj => "intersectedElements" in obj, get: obj => obj.intersectedElements, set: (obj, value) => { obj.intersectedElements = value; } }, metadata: _metadata }, _intersectedElements_initializers, _intersectedElements_extraInitializers);
            __esDecorate(null, null, _onIntersect_decorators, { kind: "field", name: "onIntersect", static: false, private: false, access: { has: obj => "onIntersect" in obj, get: obj => obj.onIntersect, set: (obj, value) => { obj.onIntersect = value; } }, metadata: _metadata }, _onIntersect_initializers, _onIntersect_extraInitializers);
            __esDecorate(null, null, _autoIntersect_decorators, { kind: "field", name: "autoIntersect", static: false, private: false, access: { has: obj => "autoIntersect" in obj, get: obj => obj.autoIntersect, set: (obj, value) => { obj.autoIntersect = value; } }, metadata: _metadata }, _autoIntersect_initializers, _autoIntersect_extraInitializers);
            __esDecorate(null, null, ___crouchAmount_decorators, { kind: "field", name: "__crouchAmount", static: false, private: false, access: { has: obj => "__crouchAmount" in obj, get: obj => obj.__crouchAmount, set: (obj, value) => { obj.__crouchAmount = value; } }, metadata: _metadata }, ___crouchAmount_initializers, ___crouchAmount_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            FirstPersonCamera = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        PropTypes;
        // TODO move this to the @component decorator
        /**
         * This is similar to ref={} on regular elements. Pass in a signal setter
         * (or function that accepts the instance as an arg) to get an instance of
         * this component from JSX.
         *
         * Example:
         *
         * ```js
         * return <FirstPersonCamera getInstance={setCamera} />
         * ```
         */
        instance = __runInitializers(this, _instance_initializers, null);
        onPlayerMove = (__runInitializers(this, _instance_extraInitializers), __runInitializers(this, _onPlayerMove_initializers, null));
        crouchAmount = (__runInitializers(this, _onPlayerMove_extraInitializers), 0);
        elementsToIntersect = __runInitializers(this, _elementsToIntersect_initializers, null
        // TODO we need ability to specify {equals: false} for @signal decorator so we don't have to make a new array each time we update it.
        );
        // TODO we need ability to specify {equals: false} for @signal decorator so we don't have to make a new array each time we update it.
        intersectedElements = (__runInitializers(this, _elementsToIntersect_extraInitializers), __runInitializers(this, _intersectedElements_initializers, []
        // FIXME: we shouldn't need this, but createEffect(() => camera.intersectedElements) is not working right now for some reason. We use a callback for now.
        ));
        // FIXME: we shouldn't need this, but createEffect(() => camera.intersectedElements) is not working right now for some reason. We use a callback for now.
        onIntersect = (__runInitializers(this, _intersectedElements_extraInitializers), __runInitializers(this, _onIntersect_initializers, null));
        autoIntersect = (__runInitializers(this, _onIntersect_extraInitializers), __runInitializers(this, _autoIntersect_initializers, true));
        camRotation = (__runInitializers(this, _autoIntersect_extraInitializers), new XYZNumberValues());
        camPosition = new XYZNumberValues();
        __crouchAmount = __runInitializers(this, ___crouchAmount_initializers, this.crouchAmount);
        root = __runInitializers(this, ___crouchAmount_extraInitializers);
        camera;
        template = (props) => (<lume-element3d ref={this.root} rotation={new XYZNumberValues([0, this.camRotation.y])} position={new XYZNumberValues([this.camPosition.x, this.camPosition.y, this.camPosition.z])} use:shadow={<>
					<slot></slot>

					<lume-perspective-camera ref={this.camera} 
            // @ts-expect-error attribute type is added in newer lume
            active rotation={new XYZNumberValues([this.camRotation.x])} far="200000" zoom={1}>
						<slot name="camera-child"></slot>
					</lume-perspective-camera>

					{/* <lume-camera-rig active rotation={[this.camRotation.x]}>
                    <slot name="camera-child"></slot>
                </lume-camera-rig> */}
				</>}>
			{props.children}
		</lume-element3d>);
        __playerMove() {
            const { x, y, z } = this.camPosition;
            const { x: rx, y: ry } = this.camRotation;
            const crouch = !!this.__crouchAmount;
            this.onPlayerMove?.({ x, y, z, rx, ry, crouch });
        }
        onMount() {
            queueMicrotask(() => this.instance?.(this));
            createEffect(() => (this.camPosition.y = this.__crouchAmount));
            createEffect(() => {
                const scene = this.root.scene;
                if (!scene)
                    return;
                const onmove = (e) => {
                    this.camRotation.y -= e.movementX * 0.1;
                    this.camRotation.x = clamp(this.camRotation.x + e.movementY * 0.1, -90, 90);
                    this.__playerMove();
                };
                const onlockchange = () => {
                    if (!document.pointerLockElement)
                        scene.removeEventListener('pointermove', onmove);
                };
                const onclick = () => {
                    if (document.pointerLockElement)
                        return;
                    scene.requestPointerLock();
                    scene.addEventListener('pointermove', onmove);
                    document.addEventListener('pointerlockchange', onlockchange);
                };
                // TODO move to onmousedown={} prop inside JSX (currently doesn't work, bug?)
                scene.addEventListener('click', onclick);
                onCleanup(() => {
                    scene.removeEventListener('click', onclick);
                    scene.removeEventListener('pointermove', onmove);
                    document.removeEventListener('pointerlockchange', onlockchange);
                });
            });
            const moveSpeed = 1;
            const keysDown = { w: false, a: false, s: false, d: false };
            for (const key of ['w', 'a', 's', 'd']) {
                window.addEventListener('keydown', e => {
                    if (!document.pointerLockElement)
                        return;
                    if (key != e.key.toLowerCase())
                        return;
                    if (keysDown[key])
                        return;
                    keysDown[key] = true;
                    let nextPositionZ = (_dt) => 0;
                    let nextPositionY = (_dt) => 0;
                    if (key === 'w') {
                        nextPositionZ = dt => -Math.cos(toRadians(this.camRotation.y)) * moveSpeed * dt;
                        nextPositionY = dt => -Math.sin(toRadians(this.camRotation.y)) * moveSpeed * dt;
                    }
                    if (key === 'a') {
                        nextPositionZ = dt => Math.sin(toRadians(this.camRotation.y)) * moveSpeed * dt;
                        nextPositionY = dt => -Math.cos(toRadians(this.camRotation.y)) * moveSpeed * dt;
                    }
                    if (key === 's') {
                        nextPositionZ = dt => Math.cos(toRadians(this.camRotation.y)) * moveSpeed * dt;
                        nextPositionY = dt => Math.sin(toRadians(this.camRotation.y)) * moveSpeed * dt;
                    }
                    if (key === 'd') {
                        nextPositionZ = dt => -Math.sin(toRadians(this.camRotation.y)) * moveSpeed * dt;
                        nextPositionY = dt => Math.cos(toRadians(this.camRotation.y)) * moveSpeed * dt;
                    }
                    Motor.addRenderTask((_t, dt) => {
                        this.camPosition.z += nextPositionZ(dt);
                        this.camPosition.x += nextPositionY(dt);
                        this.__playerMove();
                        return keysDown[key];
                    });
                });
                window.addEventListener('keyup', e => {
                    if (!document.pointerLockElement)
                        return;
                    if (key != e.key.toLowerCase())
                        return;
                    keysDown[key] = false;
                });
            }
            let crouched = false;
            window.addEventListener('keydown', e => {
                if (!document.pointerLockElement)
                    return;
                if (e.key != 'Shift')
                    return;
                if (crouched)
                    return;
                crouched = true;
                this.__crouchAmount = this.crouchAmount;
                this.__playerMove();
            });
            // TODO LUME: make raycaster an HTML element so that the ray can be positioned in 3D space just like any other object.
            window.addEventListener('keyup', e => {
                if (e.key != 'Shift')
                    return;
                crouched = false;
                this.__crouchAmount = 0;
                this.__playerMove();
            });
            createEffect(() => {
                if (!this.autoIntersect)
                    return;
                // Any time these change,
                const { x: _x, y: _y, z: _z } = this.camPosition;
                const { x: _rx, y: _ry } = this.camRotation;
                this.__crouchAmount;
                this.elementsToIntersect;
                // schedule a raycast
                this.throttledIntersect[0]();
            });
        }
        intersectDeferred = false;
        throttledIntersect = createThrottle(() => {
            if (this.intersectDeferred)
                return;
            this.intersectDeferred = true;
            Motor.once(async () => {
                // ensure we run this after scene transforms are updated. (TODO better API f.e. Motor.afterRender())
                await Promise.resolve();
                await Promise.resolve();
                this.intersectDeferred = false;
                // update line-of-sight intersections so App can determine who gets shot.
                caster.setFromCamera(new Vector2(0, 0), // cast from the center of the screen
                this.camera.three);
                if (!this.elementsToIntersect)
                    return;
                const intersections = caster.intersectObjects(
                // [...this.elementsToIntersect] // broken in Quest Browser
                Array.from(this.elementsToIntersect)
                    .map(el => el?.three)
                    // fixme bug: undefined values getting in here. This whole thing is a quick hack for Solid Hack. :]
                    .filter(o => !!o));
                batch(() => {
                    this.intersectedElements = [];
                    // TODO this is definitely not optimal
                    for (const i of intersections) {
                        for (const el of this.elementsToIntersect) {
                            if (!el)
                                continue; // FIXME bug, should be no undefineds. Bug in how disconnected players are removed.
                            el.three.traverse(o => {
                                if (i.object === o) {
                                    this.intersectedElements.push(el);
                                }
                            });
                        }
                    }
                    // FIXME we should need this, an outside consumer should be able
                    // to make an effect that depends on cam.intersectedElemnts but
                    // it doesn't work right now for some reason.
                    this.onIntersect?.(this.intersectedElements);
                });
            });
        }, 50); // TODO what's a good value?
        /** Manually tell the camera when to run intersection. */
        intersect() {
            this.throttledIntersect[0]();
        }
    };
    return FirstPersonCamera = _classThis;
})();
export { FirstPersonCamera };
async function shadow(el, args) {
    const _args = args();
    const [shadowChildren, shadowOptions = { mode: 'open' }] = _args === true
        ? [() => <></>] // no args
        : isShadowArgTuple(_args)
            ? _args
            : [() => _args];
    // FIXME HACKY: Defer for one microtask so custom element upgrades can happen. Will this always work?
    await Promise.resolve();
    if (el.tagName.includes('-') && !customElements.get(el.tagName.toLowerCase())) {
        await Promise.race([
            new Promise(resolve => setTimeout(() => {
                console.warn('Custom element is not defined after 1 second, skipping. Overriden attachShadow methods may break if the element is defined later.');
                resolve();
            }, 1000)),
            customElements.whenDefined(el.tagName.toLowerCase()),
        ]);
    }
    const root = el.attachShadow(shadowOptions);
    // @ts-ignore :(
    render(shadowChildren, root);
}
function isShadowArgTuple(a) {
    if (Array.isArray(a) && a.length === 2 && 'mode' in a[1])
        return true;
    return false;
}
//# sourceMappingURL=FirstPersonCamera.jsx.map