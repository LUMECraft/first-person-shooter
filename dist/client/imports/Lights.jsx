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
import { DirectionalLight, Motor } from 'lume';
import * as THREE from 'three';
import { createEffect, onCleanup } from 'solid-js';
import { reactive, signal } from 'classy-solid';
import { component } from 'classy-solid';
let Lights = (() => {
    let _classDecorators = [component, reactive];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _debug_decorators;
    let _debug_initializers = [];
    let _debug_extraInitializers = [];
    let _lightSize_decorators;
    let _lightSize_initializers = [];
    let _lightSize_extraInitializers = [];
    var Lights = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _debug_decorators = [signal];
            _lightSize_decorators = [signal];
            __esDecorate(null, null, _debug_decorators, { kind: "field", name: "debug", static: false, private: false, access: { has: obj => "debug" in obj, get: obj => obj.debug, set: (obj, value) => { obj.debug = value; } }, metadata: _metadata }, _debug_initializers, _debug_extraInitializers);
            __esDecorate(null, null, _lightSize_decorators, { kind: "field", name: "lightSize", static: false, private: false, access: { has: obj => "lightSize" in obj, get: obj => obj.lightSize, set: (obj, value) => { obj.lightSize = value; } }, metadata: _metadata }, _lightSize_initializers, _lightSize_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            Lights = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        PropTypes;
        debug = __runInitializers(this, _debug_initializers, false);
        lightSize = (__runInitializers(this, _debug_extraInitializers), __runInitializers(this, _lightSize_initializers, 16000));
        root = __runInitializers(this, _lightSize_extraInitializers);
        light;
        onMount() {
            createEffect(() => {
                const scene = this.root.scene;
                if (!(this.debug && scene))
                    return;
                const helper = new THREE.DirectionalLightHelper(this.light.three, this.lightSize);
                scene.three.add(helper);
                const task = Motor.addRenderTask(() => {
                    helper.update();
                });
                onCleanup(() => {
                    Motor.removeRenderTask(task);
                    scene.three.remove(helper);
                    helper.dispose();
                });
            });
        }
        template = () => (<lume-box ref={this.root} size="300 300 300" color="blue">
			<lume-directional-light ref={this.light} position="4000 -4000 4000" intensity="0.6" color="white" shadow-map-width="4096" shadow-map-height="4096" shadow-camera-far="100000" shadow-camera-top={this.lightSize / 2} shadow-camera-right={this.lightSize / 2} shadow-camera-bottom={-this.lightSize / 2} shadow-camera-left={-this.lightSize / 2}>
				{this.debug && <lume-sphere color="yellow" size="100" mount-point="0.5 0.5 0.5"></lume-sphere>}
			</lume-directional-light>

			<lume-ambient-light color="white" intensity="0.6"></lume-ambient-light>
		</lume-box>);
    };
    return Lights = _classThis;
})();
export { Lights };
//# sourceMappingURL=Lights.jsx.map