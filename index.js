const r = require('raylib');

r.InitWindow(800, 600, "Novatek - Test 2");
r.SetTargetFPS(60);

// -- Classes -- \\ (Because i cant do seperate Files)
// -- Player -- \\
class Player {
    constructor(x, y, speed = 5) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.width = 20;
        this.height = 20;
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
            case "":
                
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