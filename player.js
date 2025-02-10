export class Player {
    constructor(position, size, speed, r, radYaw, obstacles) {
        this.position = position;
        this.size = size;
        this.speed = speed;
        this.r = r;
        this.radYaw = radYaw;
        this.obstacles = obstacles;
        this.right = {
            x: -Math.cos(this.radYaw),
            z: Math.sin(this.radYaw),
        };
    }

    checkCollision(newPos) {
        // Check ground collision (stay above y = 1)
        if (newPos.y < 1) return false;

        // Check obstacle collision
        for (const obj of this.obstacles) {
            if (
                Math.abs(newPos.x - obj.position.x) < (this.size.width + obj.size.width) / 2 &&
                Math.abs(newPos.y - obj.position.y) < (this.size.height + obj.size.height) / 2 &&
                Math.abs(newPos.z - obj.position.z) < (this.size.depth + obj.size.depth) / 2
            ) {
                return false;
            }
        }
        return true;
    }

    checkForInput() {
        // --- MOVEMENT WITH COLLISION ---
        let newPos = { ...this.position };

        if (this.r.IsKeyDown(this.r.KEY_W)) {
            newPos.x += Math.sin(this.radYaw) * this.speed;
            newPos.z += Math.cos(this.radYaw) * this.speed;
        }
        if (this.r.IsKeyDown(this.r.KEY_S)) {
            newPos.x -= Math.sin(this.radYaw) * this.speed;
            newPos.z -= Math.cos(this.radYaw) * this.speed;
        }
        if (this.r.IsKeyDown(this.r.KEY_D)) {
            newPos.x += this.right.x * this.speed;
            newPos.z += this.right.z * this.speed;
        }
        if (this.r.IsKeyDown(this.r.KEY_A)) {
            newPos.x -= this.right.x * this.speed;
            newPos.z -= this.right.z * this.speed;
        }
        if (this.r.IsKeyDown(this.r.KEY_SPACE)) {
            newPos.y += this.speed;
        }
        if (this.r.IsKeyDown(this.r.KEY_LEFT_SHIFT)) {
            newPos.y -= this.speed;
        }

        // Apply movement only if no collision
        if (this.checkCollision(newPos)) {
            this.position = newPos;
        }
    }
}

