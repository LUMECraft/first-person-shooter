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
import throttle from 'lodash.throttle';
import { FbxModel, isMesh } from 'lume';
import { createEffect, onCleanup } from 'solid-js';
let Rifle = (() => {
    let _classDecorators = [component, reactive];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _shootOnClick_decorators;
    let _shootOnClick_initializers = [];
    let _shootOnClick_extraInitializers = [];
    let _onShoot_decorators;
    let _onShoot_initializers = [];
    let _onShoot_extraInitializers = [];
    let _shotThrottle_decorators;
    let _shotThrottle_initializers = [];
    let _shotThrottle_extraInitializers = [];
    let _instance_decorators;
    let _instance_initializers = [];
    let _instance_extraInitializers = [];
    var Rifle = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _shootOnClick_decorators = [signal];
            _onShoot_decorators = [signal];
            _shotThrottle_decorators = [signal];
            _instance_decorators = [signal];
            __esDecorate(null, null, _shootOnClick_decorators, { kind: "field", name: "shootOnClick", static: false, private: false, access: { has: obj => "shootOnClick" in obj, get: obj => obj.shootOnClick, set: (obj, value) => { obj.shootOnClick = value; } }, metadata: _metadata }, _shootOnClick_initializers, _shootOnClick_extraInitializers);
            __esDecorate(null, null, _onShoot_decorators, { kind: "field", name: "onShoot", static: false, private: false, access: { has: obj => "onShoot" in obj, get: obj => obj.onShoot, set: (obj, value) => { obj.onShoot = value; } }, metadata: _metadata }, _onShoot_initializers, _onShoot_extraInitializers);
            __esDecorate(null, null, _shotThrottle_decorators, { kind: "field", name: "shotThrottle", static: false, private: false, access: { has: obj => "shotThrottle" in obj, get: obj => obj.shotThrottle, set: (obj, value) => { obj.shotThrottle = value; } }, metadata: _metadata }, _shotThrottle_initializers, _shotThrottle_extraInitializers);
            __esDecorate(null, null, _instance_decorators, { kind: "field", name: "instance", static: false, private: false, access: { has: obj => "instance" in obj, get: obj => obj.instance, set: (obj, value) => { obj.instance = value; } }, metadata: _metadata }, _instance_initializers, _instance_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            Rifle = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        PropTypes;
        /**
         * If true will automatically shoot when the user clicks anywhere in the scene.
         */
        shootOnClick = __runInitializers(this, _shootOnClick_initializers, false
        /**
         * If provided will be called any time the gun is fired.
         */
        );
        /**
         * If provided will be called any time the gun is fired.
         */
        onShoot = (__runInitializers(this, _shootOnClick_extraInitializers), __runInitializers(this, _onShoot_initializers, null
        /**
         * Throttles the rate at which the gun fires. 0 means no throttle.
         */
        ));
        /**
         * Throttles the rate at which the gun fires. 0 means no throttle.
         */
        shotThrottle = (__runInitializers(this, _onShoot_extraInitializers), __runInitializers(this, _shotThrottle_initializers, 0
        // TODO move this to the @component decorator
        /**
         * This is similar to ref={} on regular elements. Pass in a signal setter
         * (or function that accepts the instance as an arg) to get an instance of
         * this component from JSX.
         *
         * Example:
         *
         * ```js
         * return <Rifle instance={setRifle} />
         * ```
         */
        ));
        // TODO move this to the @component decorator
        /**
         * This is similar to ref={} on regular elements. Pass in a signal setter
         * (or function that accepts the instance as an arg) to get an instance of
         * this component from JSX.
         *
         * Example:
         *
         * ```js
         * return <Rifle instance={setRifle} />
         * ```
         */
        instance = (__runInitializers(this, _shotThrottle_extraInitializers), __runInitializers(this, _instance_initializers, null));
        timeouts = (__runInitializers(this, _instance_extraInitializers), new Set());
        root;
        model;
        gunshot;
        tracer;
        explosion;
        shoot = this._shoot.bind(this);
        _shoot() {
            ;
            this.gunshot.cloneNode().play();
            if (Math.random() < 0.25)
                this.tracer.visible = true;
            this.explosion.visible = true;
            const timeout = window.setTimeout(() => {
                this.tracer.visible = false;
                this.explosion.visible = false;
                this.timeouts.delete(timeout);
            }, 100);
            this.timeouts.add(timeout);
            this.onShoot?.();
        }
        onMount() {
            queueMicrotask(() => this.instance?.(this));
            createEffect(() => {
                const scene = this.root.scene;
                if (!scene || !this.shootOnClick)
                    return;
                // TODO move to onmousedown={} prop inside JSX (currently doesn't work, bug?)
                scene.addEventListener('mousedown', this.shoot);
                onCleanup(() => {
                    scene.removeEventListener('mousedown', this.shoot);
                    for (const timeout of this.timeouts)
                        clearTimeout(timeout);
                    this.tracer.visible = false;
                    this.explosion.visible = false;
                });
            });
            createEffect(() => {
                if (this.shotThrottle) {
                    this.shoot = throttle(this._shoot.bind(this), this.shotThrottle, { leading: true, trailing: false });
                    onCleanup(() => this.shoot.cancel());
                }
                else {
                    this.shoot = this._shoot.bind(this);
                }
            });
            // this.model.addEventListener('load', () => {
            this.model.on('MODEL_LOAD', () => {
                this.root.three.traverse(n => {
                    if (isMesh(n)) {
                        // TODO attribute for model loaders so we don't have to manually do this to Three.js objects.
                        n.castShadow = true;
                        n.receiveShadow = true;
                    }
                });
            });
        }
        template = () => (<lume-element3d ref={this.root} position="0 0 -40" scale="0.8 0.8 0.8">
			{/* rifle model */}
			<lume-fbx-model ref={this.model} src="/gun.fbx" rotation="0 -90 0" scale="0.2 0.2 0.2"></lume-fbx-model>

			<lume-element3d position="0 -105 -260">
				{/* muzzle flash */}
				<lume-sphere ref={this.explosion} visible="false" has="basic-material" opacity="0.5" size="100 100 100" color="yellow" mount-point="0.5 0.5 1"></lume-sphere>

				{/* bullet tracer */}
				<lume-box ref={this.tracer} visible="false" has="basic-material" opacity="0.6" size="8 8 8000" color="white" mount-point="0.5 0.5 1"></lume-box>
			</lume-element3d>

			<audio ref={this.gunshot} src="/gunshot.mp3"></audio>
		</lume-element3d>);
    };
    return Rifle = _classThis;
})();
export { Rifle };
//# sourceMappingURL=Rifle.jsx.map