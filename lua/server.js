const express = require("express");
const { spawn } = require("child_process");
const app = express();
const port = 8080;

// Middleware para parsear JSON
app.use(express.json());

// Función para ejecutar comandos Lua
function runLuaCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    const lua = spawn("lua", ["-e", command], {
      cwd: __dirname,
      stdio: ["pipe", "pipe", "pipe"],
    });

    let output = "";
    let errorOutput = "";

    lua.stdout.on("data", (data) => {
      output += data.toString();
    });

    lua.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    lua.on("close", (code) => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        reject(new Error(`Lua error: ${errorOutput}`));
      }
    });

    lua.on("error", (err) => {
      reject(err);
    });
  });
}

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Super Calculadora API",
    timestamp: new Date().toISOString(),
  });
});

// Get available methods
app.get("/api/methods", async (req, res) => {
  try {
    const result = await runLuaCommand(`
      local calculator = require("./calculator")
      local methods = calculator.list_methods()
      local json = require("json")
      print(json.encode({success = true, methods = methods}))
    `);

    const parsed = JSON.parse(result);
    res.json(parsed);
  } catch (error) {
    console.error("Error getting methods:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

// Get calculator info
app.get("/api/info", async (req, res) => {
  try {
    const result = await runLuaCommand(`
      local calculator = require("./calculator")
      local info = calculator.info()
      local json = require("json")
      print(json.encode({success = true, info = info}))
    `);

    const parsed = JSON.parse(result);
    res.json(parsed);
  } catch (error) {
    console.error("Error getting info:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

// Solve biseccion
app.post("/api/solve/biseccion", async (req, res) => {
  try {
    const { f, a, b, tolerance, max_iterations } = req.body;

    if (!f || a === undefined || b === undefined) {
      return res.status(400).json({
        success: false,
        error: "Parámetros requeridos: f, a, b",
      });
    }

    const tolerance_val = tolerance || 1e-10;
    const max_iter = max_iterations || 100;

    const luaCommand = `
      local calculator = require("./calculator")
      local json = require("json")
      local result = calculator.solve("biseccion", {
        f = "${f}",
        a = ${a},
        b = ${b},
        tolerance = ${tolerance_val},
        max_iterations = ${max_iter}
      })
      print(json.encode(result))
    `;

    const result = await runLuaCommand(luaCommand);
    const parsed = JSON.parse(result);
    res.json(parsed);
  } catch (error) {
    console.error("Error solving biseccion:", error);
    res.status(500).json({
      success: false,
      error: "Error al resolver ecuación",
    });
  }
});

// CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.listen(port, "127.0.0.1", () => {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🧮 Super Calculadora Numérica");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`📍 Servidor Node.js escuchando en http://localhost:${port}`);
  console.log("🔗 API Endpoints:");
  console.log("   GET  /health");
  console.log("   GET  /api/methods");
  console.log("   GET  /api/info");
  console.log("   POST /api/solve/biseccion");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("");
  console.log("✅ Servidor listo para recibir conexiones de React Native");
});
