const { exec } = require("child_process");
const path = require("path");

const equations = [
  "x^3 - 4*x^2 + 1", // 1. Polinómica
  "e^x - 3",         // 2. Exponencial simple
  "ln(x) - 1.5",     // 3. Logarítmica
  "sen(x) - 0.5",    // 4. Trigonométrica
  "x^2 - 8 - e^-x",  // 5. Polinómica + exp
  "10*sen(x) - 3*ln(x)", // 6. Mixta trig/log
  "x * e^x - 2",     // 7. Multiplicativa exp
  "cos(x) - x",      // 8. Trig / polinómica
  "e^-x * cos(x) - 0.1", // 9. Atenuación
  "x^4 - 10"         // 10. Polinómica grado 4
];

const runTest = (equation, method) => {
  return new Promise((resolve) => {
    const params = { f: equation, max_iterations: 15 };
    if (method === 'newton_raphson') {
        // Newton no funcionará sin derivada, así que lo saltamos para este test automatizado de 10
        resolve({ success: true, ignored: true });
        return;
    }
    
    // Simulate Lua injection similar to server.js
    let expr = equation;
    expr = expr.replace(/sen\(/g, "math.sin(");
    expr = expr.replace(/cos\(/g, "math.cos(");
    expr = expr.replace(/tan\(/g, "math.tan(");
    expr = expr.replace(/ln\(/g, "math.log(");
    expr = expr.replace(/\b([a-zA-Z]+)\b/g, (match) => {
        if (match === "e") return "math.exp(1)";
        if (match === "pi") return "math.pi";
        return match;
    });

    const luaScript = `
      local json = require("json")
      local utils = require("utils")
      local method = require("methods.${method}")

      local function f(x)
          local code = "local x = " .. tostring(x) .. "; return " .. "${expr}"
          local chunk = load(code)
          if chunk then return chunk() else return 0 end
      end

      local paramsStr = '${JSON.stringify(params)}'
      local result, iterations, error_msg = method.solve(f, nil, nil, 1e-10, 15)

      if result then
          print(json.encode({success = true, root = result, count = #iterations}))
      else
          print(json.encode({success = false, error = error_msg}))
      end
    `;

    const proc = exec(`lua -e '${luaScript.replace(/'/g, "'\\''")}'`, { cwd: path.join(__dirname, "../lua") }, (error, stdout, stderr) => {
        if (error) {
            resolve({ success: false, equation, method, error: stderr || error.message });
        } else {
            try {
                const out = JSON.parse(stdout.trim());
                resolve({ ...out, equation, method });
            } catch (e) {
                resolve({ success: false, equation, method, error: "Parse error: " + stdout });
            }
        }
    });
  });
};

async function runAll() {
  console.log("=== INICIANDO TEST DE 10 ECUACIONES DIFERENTES ===\\n");
  
  for (let i = 0; i < equations.length; i++) {
    const eq = equations[i];
    console.log(`Test ${i + 1}: f(x) = ${eq}`);
    
    const resBiseccion = await runTest(eq, 'biseccion');
    if (resBiseccion.success) {
      console.log(`  ✔️  Bisección: Raíz = ${resBiseccion.root.toFixed(6)} (Iteraciones: ${resBiseccion.count})`);
    } else {
      console.log(`  ❌  Bisección: Falló - ${resBiseccion.error}`);
    }

    const resSecante = await runTest(eq, 'secante');
    if (resSecante.success) {
      console.log(`  ✔️  Secante  : Raíz = ${resSecante.root.toFixed(6)} (Iteraciones: ${resSecante.count})`);
    } else {
      console.log(`  ❌  Secante  : Falló - ${resSecante.error}`);
    }
    console.log("-------------------------------------------------");
  }
}

runAll();
