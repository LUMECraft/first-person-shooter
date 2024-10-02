import { DirectionalLight } from 'lume';
import { type Props } from 'classy-solid';
import type { Box } from 'lume';
export declare class Lights {
    PropTypes: Props<Partial<this>, 'lightSize' | 'debug'>;
    debug: boolean;
    lightSize: number;
    root: Box;
    light: DirectionalLight;
    onMount(): void;
    template: () => import("solid-js").JSX.Element;
}
//# sourceMappingURL=Lights.d.ts.map