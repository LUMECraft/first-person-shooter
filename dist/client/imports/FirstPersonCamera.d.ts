import { type Props } from 'classy-solid';
import { Element3D, XYZNumberValues, PerspectiveCamera } from 'lume';
import { JSX } from 'solid-js';
export declare class FirstPersonCamera {
    PropTypes: Props<Partial<this>, 'instance' | 'onPlayerMove' | 'crouchAmount' | 'elementsToIntersect' | 'onIntersect' | 'autoIntersect'>;
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
    instance: ((i: this) => void) | null;
    onPlayerMove: ((pos: {
        x: number;
        y: number;
        z: number;
        rx: number;
        ry: number;
        crouch: boolean;
    }) => void) | null;
    crouchAmount: number;
    elementsToIntersect: Set<Element3D> | null;
    intersectedElements: Element3D[];
    onIntersect: ((n: Element3D[]) => void) | null;
    autoIntersect: boolean;
    camRotation: XYZNumberValues;
    camPosition: XYZNumberValues;
    __crouchAmount: number;
    root: Element3D;
    camera: PerspectiveCamera;
    template: (props: this["PropTypes"]) => JSX.Element;
    __playerMove(): void;
    onMount(): void;
    intersectDeferred: boolean;
    throttledIntersect: [fn: () => void, clear: () => void];
    /** Manually tell the camera when to run intersection. */
    intersect(): void;
}
declare function shadow(el: Element, args: () => JSX.Element | [JSX.Element, ShadowRootInit] | true): Promise<void>;
declare module 'solid-js' {
    namespace JSX {
        interface CustomAttributes<T> {
            'use:shadow'?: JSX.Element | typeof shadow;
        }
    }
}
export {};
//# sourceMappingURL=FirstPersonCamera.d.ts.map