const r = require('raylib');

r.InitWindow(800, 600, "Novatek - Test 2");
r.SetTargetFPS(60);

// -- Functions -- \\
function checkCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

// -- Classes -- \\ (Because i cant do separate Files)
// -- Player -- \\
class Player {
    constructor(x, y, speed = 5, obstacles = []) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.width = 20;
        this.height = 20;
        this.obstacles = obstacles;
    }

    update() {
        if (r.IsKeyDown(r.KEY_RIGHT) || r.IsKeyDown(r.KEY_D)) this.x += this.speed;
        if (r.IsKeyDown(r.KEY_LEFT) || r.IsKeyDown(r.KEY_A)) this.x -= this.speed;
        if (r.IsKeyDown(r.KEY_DOWN) || r.IsKeyDown(r.KEY_S)) this.y += this.speed;
        if (r.IsKeyDown(r.KEY_UP) || r.IsKeyDown(r.KEY_W)) this.y -= this.speed;
    }

    draw() {
        r.DrawRectangle(this.x, this.y, this.width, this.height, r.BLUE);
    }
}

class Entity {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
    }

    update() {
        switch (this.type) {
            case "item":
                for (let i = 0; i < this.obstacles.length; i++) {
                    if (checkCollision(this, this.obstacles[i])) {
                        return;
                    }
                }
                break;
            default:
                console.error("Game ran over a problem. It ran over it and drove back to drive over it again and again.")
                break;
        }
    }
}


// -- Variables -- \\
const player = new Player(400, 300, 5);

// -- Game Loop -- \\
while (!r.WindowShouldClose()) {
    player.update();
    
    // -- Drawing -- \\
    r.BeginDrawing();

    r.ClearBackground(r.SKYBLUE);

    player.draw();

    r.EndDrawing();
}

r.CloseWindow();