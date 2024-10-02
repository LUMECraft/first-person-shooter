export declare const playersCollection: Mongo.Collection<Player, Player>;
export interface Player {
    id: string;
    _id: string;
    health: number;
    x: number;
    y: number;
    z: number;
    rx: number;
    ry: number;
    shots: 0;
    crouch: boolean;
    connected: boolean;
}
//# sourceMappingURL=players.d.ts.map