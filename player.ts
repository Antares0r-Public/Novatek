
export interface Player {
    position: { x: number, y: number, z: number };
    size: { width: number, height: number, depth: number };
    speed: number;
}

export class Player implements Player {

    constructor(position, size, speed) {
        this.position = position;
        this.size = size;
        this.speed = speed;
    }
} 
