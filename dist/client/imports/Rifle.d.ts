import { type Props } from 'classy-solid';
import throttle from 'lodash.throttle';
import { FbxModel, type Box, type Element3D, type Sphere } from 'lume';
export declare class Rifle {
    PropTypes: Props<Partial<this>, 'shootOnClick' | 'onShoot' | 'shotThrottle' | 'instance'>;
    /**
     * If true will automatically shoot when the user clicks anywhere in the scene.
     */
    shootOnClick: boolean;
    /**
     * If provided will be called any time the gun is fired.
     */
    onShoot: (() => void) | null;
    /**
     * Throttles the rate at which the gun fires. 0 means no throttle.
     */
    shotThrottle: number;
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
    instance: ((i: this) => void) | null;
    timeouts: Set<number>;
    root: Element3D;
    model: FbxModel;
    gunshot: HTMLAudioElement;
    tracer: Box;
    explosion: Sphere;
    shoot: ReturnType<typeof throttle>;
    _shoot(): void;
    onMount(): void;
    template: () => import("solid-js").JSX.Element;
}
//# sourceMappingURL=Rifle.d.ts.map