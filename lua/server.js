const express = require("express");
const { spawn } = require("child_process");
const app = express();
const port = 8080;

// Middleware para parsear JSON
app.use(express.json());

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

// Root path
app.get("/", (req, res) => {
  res.send("Super Calculadora API Backend está en línea. Por favor, utiliza la aplicación React Native para interactuar con la calculadora.");
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

// Solve generic method
app.post("/api/solve/:method", async (req, res) => {
  try {
    const method = req.params.method;
    const params = req.body;

    const paramsJson = JSON.stringify(params).replace(/'/g, "\\'");

    const luaCommand = `
      local calculator = require("./calculator")
      local json = require("json")
      local params = json.decode('${paramsJson}')
      
      local function compile_func(expr)
          if type(expr) == "string" then
              -- Parsear matemáticas comunes (ej: sen -> math.sin, 10x -> 10*x)
              expr = expr:gsub("sen%(", "math.sin(")
              expr = expr:gsub("cos%(", "math.cos(")
              expr = expr:gsub("tan%(", "math.tan(")
              expr = expr:gsub("ln%(", "math.log(")
              expr = expr:gsub("%f[%a]e%f[%A]", "math.exp(1)")
              expr = expr:gsub("%f[%a]pi%f[%A]", "math.pi")
              expr = expr:gsub("(%d+)(%a)", "%1*%2")
              
              local load_func = loadstring or load
              return function(x)
                  local code = "local x = " .. tostring(x) .. "; return " .. expr
                  local chunk, err = load_func(code)
                  if chunk then 
                      return chunk() 
                  else 
                      io.stderr:write("Error compiling: " .. tostring(err) .. " Code: " .. code .. "\\n")
                      return 0 
                  end
              end
          end
          return expr
      end

      if params.f then params.f = compile_func(params.f) end
      if params.f_prime then params.f_prime = compile_func(params.f_prime) end
      if params.g then params.g = compile_func(params.g) end

      local root, iterations_or_error, msg = calculator.solve("${method}", params)
      
      local result = { method = "${method}" }
      
      if root == nil then
          result.success = false
          result.error_message = iterations_or_error
      else
          result.success = true
          result.root = root
          result.iterations = iterations_or_error
          result.error_message = msg
          
          -- Manejo especial para Jacobi
          if type(root) == "table" and "${method}" == "jacobi" then
              result.solution = root
              result.root = nil
          end
      end
      
      print(json.encode(result))
    `;

    const result = await runLuaCommand(luaCommand);
    const parsed = JSON.parse(result);
    // Para que coincida con lo esperado por Axios (el response.data será 'parsed')
    res.json({ success: parsed.success, data: parsed, ...parsed });
  } catch (error) {
    console.error(`Error solving ${req.params.method}:`, error);
    res.status(500).json({
      success: false,
      error: "Error al resolver ecuación",
    });
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
