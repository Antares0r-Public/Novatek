const r = require('raylib');
const { join } = require('path')
const { Player } = require('./player')

r.InitWindow(800, 600, "Novatek - Test 1");
r.SetTargetFPS(60);
r.DisableCursor(); // Hide cursor for FPS movement

// const image = r.LoadImage(join(__dirname, 'resources', 'bild.png')) // Loaded in CPU memory (RAM)
// const texture = r.LoadTextureFromImage(image) // Image converted to texture, GPU memory (VRAM)
// r.UnloadImage(image)
// console.log(image.data);

// const player = {
//     position: { x: 0, y: 1, z: 0 },
//     size: { width: 0.5, height: 2, depth: 0.5 },
//     speed: 0.1
// };

let radYaw;
let obstacles = [
    { position: { x: 3, y: 1, z: 3 }, size: { width: 2, height: 2, depth: 2 } },
    { position: { x: -3, y: 1, z: -3 }, size: { width: 2, height: 2, depth: 2 } },
];

// this.position = position;
// this.size = size;
// this.speed = speed;
// this.r = r;
// this.radYaw = radYaw;
// this.obstacles = obstacles;
// this.right = {
//     x: -Math.cos(this.radYaw),
//     z: Math.sin(this.radYaw),
// };

const player = new Player({ x: 0, y: 1, z: 0 }, { width: 0.5, height: 2, depth: 0.5 }, 0.1, r, radYaw, obstacles);

const camera = {
    position: { x: player.position.x, y: player.position.y + 1.5, z: player.position.z },
    target: { x: player.position.x, y: player.position.y + 1.5, z: player.position.z + 1 },
    up: { x: 0, y: 1, z: 0 },
    fovy: 75,
    projection: r.CAMERA_PERSPECTIVE
};

// Generate a cube mesh and convert it to a model
// const mesh = r.GenMeshCube(2, 2, 2);
// const model = r.LoadModelFromMesh(mesh);

// Assign texture to the model
// model.materials[0].maps[r.MATERIAL_MAP_ALBEDO].texture = texture;

// Obstacles (Cubes)

let yaw = 0, pitch = 0+360;


while (!r.WindowShouldClose()) {
    // --- MOUSE LOOK ---
    const mouseDelta = r.GetMouseDelta();
    yaw -= mouseDelta.x * 0.1;
    pitch -= mouseDelta.y * 0.1;
    pitch = Math.max(-89, Math.min(89, pitch));

    radYaw = yaw * (Math.PI / 180);
    radPitch = pitch * (Math.PI / 180);

    const forward = {
        x: Math.cos(radPitch) * Math.sin(radYaw),
        y: Math.sin(radPitch),
        z: Math.cos(radPitch) * Math.cos(radYaw),
    };


    // --- INPUT ---
    player.checkForInput();



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
    // r.DrawModel(model, { x: 0, y: 0, z: 0 }, 1, r.WHITE);

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