const r = require('raylib');
const { join } = require('path')
const { Player } = require('./player')

r.InitWindow(800, 600, "Novatek - Test 1");
r.SetTargetFPS(60);
r.DisableCursor(); // Hide cursor for FPS movement

const image = r.LoadImage(join(__dirname, 'resources', 'bild.png')) // Loaded in CPU memory (RAM)
const texture = r.LoadTextureFromImage(image) // Image converted to texture, GPU memory (VRAM)
r.UnloadImage(image)

// const player = {
//     position: { x: 0, y: 1, z: 0 },
//     size: { width: 0.5, height: 2, depth: 0.5 },
//     speed: 0.1
// };

const player = new Player({ x: 0, y: 1, z: 0 }, { width: 0.5, height: 2, depth: 0.5 }, 0.1);

const camera = {
    position: { x: player.position.x, y: player.position.y + 1.5, z: player.position.z },
    target: { x: player.position.x, y: player.position.y + 1.5, z: player.position.z + 1 },
    up: { x: 0, y: 1, z: 0 },
    fovy: 75,
    projection: r.CAMERA_PERSPECTIVE
};

// Generate a cube mesh and convert it to a model
const mesh = r.GenMeshCube(2, 2, 2);
const model = r.LoadModelFromMesh(mesh);

// Assign texture to the model
model.materials[0].maps[r.MATERIAL_MAP_ALBEDO].texture = texture;

// Obstacles (Cubes)
const obstacles = [
    { position: { x: 3, y: 1, z: 3 }, size: { width: 2, height: 2, depth: 2 } },
    { position: { x: -3, y: 1, z: -3 }, size: { width: 2, height: 2, depth: 2 } },
];

let yaw = 0, pitch = 0+360;

function checkCollision(newPos) {
    // Check ground collision (stay above y = 1)
    if (newPos.y < 1) return false;

    // Check obstacle collision
    for (const obj of obstacles) {
        if (
            Math.abs(newPos.x - obj.position.x) < (player.size.width + obj.size.width) / 2 &&
            Math.abs(newPos.y - obj.position.y) < (player.size.height + obj.size.height) / 2 &&
            Math.abs(newPos.z - obj.position.z) < (player.size.depth + obj.size.depth) / 2
        ) {
            return false;
        }
    }
    return true;
}

while (!r.WindowShouldClose()) {
    // --- MOUSE LOOK ---
    const mouseDelta = r.GetMouseDelta();
    yaw -= mouseDelta.x * 0.1;
    pitch -= mouseDelta.y * 0.1;
    pitch = Math.max(-89, Math.min(89, pitch));

    const radYaw = yaw * (Math.PI / 180);
    const radPitch = pitch * (Math.PI / 180);

    const forward = {
        x: Math.cos(radPitch) * Math.sin(radYaw),
        y: Math.sin(radPitch),
        z: Math.cos(radPitch) * Math.cos(radYaw),
    };

    const right = {
        x: -Math.cos(radYaw),
        z: Math.sin(radYaw),
    };

    // --- MOVEMENT WITH COLLISION ---
    let newPos = { ...player.position };

    if (r.IsKeyDown(r.KEY_W)) {
        newPos.x += Math.sin(radYaw) * player.speed;
        newPos.z += Math.cos(radYaw) * player.speed;
    }
    if (r.IsKeyDown(r.KEY_S)) {
        newPos.x -= Math.sin(radYaw) * player.speed;
        newPos.z -= Math.cos(radYaw) * player.speed;
    }
    if (r.IsKeyDown(r.KEY_D)) {
        newPos.x += right.x * player.speed;
        newPos.z += right.z * player.speed;
    }
    if (r.IsKeyDown(r.KEY_A)) {
        newPos.x -= right.x * player.speed;
        newPos.z -= right.z * player.speed;
    }
    if(r.IsKeyDown(r.KEY_SPACE)) {
        newPos.y += player.speed * 5;
    }
    if(r.IsKeyDown(r.KEY_LEFT_SHIFT)) {
        newPos.y -= player.speed;
    }

    // Apply movement only if no collision
    if (checkCollision(newPos)) {
        player.position = newPos;
    }

    // --- UPDATE CAMERA ---
    camera.position = { x: player.position.x, y: player.position.y + 1.5, z: player.position.z };
    camera.target = { 
        x: camera.position.x + forward.x, 
        y: camera.position.y + forward.y, 
        z: camera.position.z + forward.z 
    };

    // --- DRAWING ---
    r.BeginDrawing();
    r.ClearBackground(r.SKYBLUE);

    r.BeginMode3D(camera);
    
    // Draw Ground (Flat rectangle)
    r.DrawCube({ x: 0, y: -0.01, z: 0 }, 20, 0.1, 20, r.DARKGREEN);  // Very thin cube as ground
    r.DrawModel(model, { x: 0, y: 0, z: 0 }, 1, r.WHITE);

    // Draw Player (as a Rectangle)
    r.DrawCube(player.position, player.size.width, player.size.height, player.size.depth, r.BLUE);

    // Draw Obstacles
    for (const obj of obstacles) {
        r.DrawCube(obj.position, obj.size.width, obj.size.height, obj.size.depth, r.RED);
    }

    r.EndMode3D();

    r.DrawText("WASD: Move | Mouse: Look | Collision Added!", 10, 10, 20, r.BLACK);
    // Text
    const text = `+`;

    // Measure the text width
    const textWidth = r.MeasureText(text, 40 * 2);

    // Calculate the position to center the text
    const x = (r.GetScreenWidth() - textWidth) / 2;
    const y = (r.GetScreenHeight() - 40 * 2) / 2;  // Center vertically

    // Draw the centered text
    r.DrawText(text, x, y, 40, r.BLACK);
    r.EndDrawing();
}

r.CloseWindow();