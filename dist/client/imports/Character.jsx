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
import { component } from 'classy-solid';
import { FbxModel, isMesh } from 'lume';
let Character = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var Character = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            Character = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        // PropTypes!: Props<this, ...>
        root;
        models = [];
        onMount() {
            const promises = [];
            this.models.forEach(m => {
                promises.push(new Promise(resolve => m.on('MODEL_LOAD', resolve)));
            });
            Promise.all(promises).then(() => {
                this.root.three.traverse(n => {
                    if (isMesh(n)) {
                        // TODO attribute for model loaders so we don't have to manually do this to Three.js objects.
                        n.castShadow = true;
                        n.receiveShadow = true;
                    }
                });
            });
        }
        template = () => (<lume-element3d ref={this.root} position="0 320 0" rotation="0 180 0" scale="0.48 0.48 0.48">
			<lume-element3d>
				<lume-fbx-model ref={(e) => this.models.push(e)} src="/ChuckChuck/body.fbx"></lume-fbx-model>
				<lume-fbx-model ref={(e) => this.models.push(e)} src="/ChuckChuck/left_arm.fbx"></lume-fbx-model>
				<lume-fbx-model ref={(e) => this.models.push(e)} src="/ChuckChuck/right_arm.fbx"></lume-fbx-model>
				<lume-fbx-model ref={(e) => this.models.push(e)} src="/ChuckChuck/left_leg.fbx"></lume-fbx-model>
				<lume-fbx-model ref={(e) => this.models.push(e)} src="/ChuckChuck/right_leg.fbx"></lume-fbx-model>
			</lume-element3d>
		</lume-element3d>);
    };
    return Character = _classThis;
})();
export { Character };
//# sourceMappingURL=Character.jsx.map