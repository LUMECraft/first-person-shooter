import { FbxModel, Element3D, Scene } from 'lume';
import { type Props, type SignalObject } from 'classy-solid';
import { FirstPersonCamera } from './FirstPersonCamera';
import { type Player } from '../../imports/collections/players';
import { type MapItem } from '../../imports/collections/mapItems';
export declare class App {
    PropTypes: Props<this, never>;
    playerId: string;
    player: Player | undefined;
    players: Pick<Player, 'id'>[];
    health: number;
    dead: boolean;
    playerElements: SignalObject<Map<Element3D, string>>;
    mapItems: MapItem[];
    intersectedElements: Element3D[];
    readonly crouchAmount = 100;
    head: FbxModel;
    scene: Scene;
    onMount(): void;
    onPlayerMove: [fn: (args_0: {
        x: number;
        y: number;
        z: number;
        rx: number;
        ry: number;
        crouch: boolean;
    }) => void, clear: () => void];
    camera: import("classy-solid").SignalFunction<FirstPersonCamera | undefined>;
    template: () => import("solid-js").JSX.Element;
}
//# sourceMappingURL=App.d.ts.map