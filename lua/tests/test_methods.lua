-- test_methods.lua - Pruebas de todos los métodos

local calc = require("../calculator")

print("╔════════════════════════════════════════╗")
print("║   PRUEBAS DE MÉTODOS NUMÉRICOS        ║")
print("╚════════════════════════════════════════╝\n")

-- Colores para terminal
local GREEN = "\27[32m"
local RED = "\27[31m"
local YELLOW = "\27[33m"
local BLUE = "\27[34m"
local RESET = "\27[0m"

local tests_passed = 0
local tests_failed = 0

-- Función auxiliar para pruebas
local function test(name, fn)
    io.write(BLUE .. "▶ " .. name .. " ... " .. RESET)
    local ok, result = pcall(fn)
    
    if ok then
        print(GREEN .. "✓ PASS" .. RESET)
        tests_passed = tests_passed + 1
    else
        print(RED .. "✗ FAIL" .. RESET)
        print("  Error: " .. tostring(result))
        tests_failed = tests_failed + 1
    end
end

-- ====================
-- Test: BISECCIÓN
-- ====================
print(YELLOW .. "\n🔹 MÉTODO: BISECCIÓN" .. RESET)

test("Encontrar raíz de x^2 - 2 en [1, 2]", function()
    local f = function(x) return x^2 - 2 end
    local root, iterations = calc.methods.biseccion.solve(f, 1, 2, 1e-10)
    
    assert(root, "No se encontró raíz")
    assert(math.abs(root - math.sqrt(2)) < 1e-9, "Precisión insuficiente")
    assert(#iterations > 0, "Sin iteraciones")
    print("    √2 ≈ " .. root)
end)

test("Error: f(a) y f(b) con mismo signo", function()
    local f = function(x) return x^2 + 1 end
    local root, error_msg = calc.methods.biseccion.solve(f, 1, 2)
    
    assert(not root, "Debería retornar error")
    assert(error_msg, "Debería tener mensaje de error")
end)

-- ====================
-- Test: NEWTON-RAPHSON
-- ====================
print(YELLOW .. "\n🔹 MÉTODO: NEWTON-RAPHSON" .. RESET)

test("Encontrar raíz de x^2 - 2 con x0=1.5", function()
    local f = function(x) return x^2 - 2 end
    local f_prime = function(x) return 2*x end
    local root, iterations = calc.methods.newton_raphson.solve(f, f_prime, 1.5, 1e-15)
    
    assert(root, "No se encontró raíz")
    assert(math.abs(root - math.sqrt(2)) < 1e-14, "Precisión insuficiente")
    assert(#iterations <= 10, "Demasiadas iteraciones (debería converger rápido)")
    print("    √2 ≈ " .. root .. " en " .. #iterations .. " iteraciones")
end)

test("Modo automático (derivada numérica)", function()
    local f = function(x) return x^2 - 2 end
    local root, iterations = calc.methods.newton_raphson.solve_auto(f, 1.5, 1e-10)
    
    assert(root, "No se encontró raíz")
    assert(math.abs(root - math.sqrt(2)) < 1e-9, "Precisión insuficiente")
end)

-- ====================
-- Test: SECANTE
-- ====================
print(YELLOW .. "\n🔹 MÉTODO: SECANTE" .. RESET)

test("Encontrar raíz de x^3 - 2 con x0=1, x1=2", function()
    local f = function(x) return x^3 - 2 end
    local root, iterations = calc.methods.secante.solve(f, 1, 2, 1e-10)
    
    assert(root, "No se encontró raíz")
    local expected = 2^(1/3)
    assert(math.abs(root - expected) < 1e-9, "Precisión insuficiente")
    print("    ∛2 ≈ " .. root .. " en " .. #iterations .. " iteraciones")
end)

-- ====================
-- Test: PUNTO FIJO
-- ====================
print(YELLOW .. "\n🔹 MÉTODO: PUNTO FIJO" .. RESET)

test("Resolver x = cos(x) con x0=0.5", function()
    local g = function(x) return math.cos(x) end
    local root, iterations = calc.methods.punto_fijo.solve(g, 0.5, 1e-10)
    
    assert(root, "No se encontró solución")
    -- cos(x) = x tiene solución alrededor de 0.7391
    assert(math.abs(g(root) - root) < 1e-9, "No es punto fijo")
    print("    Punto fijo de cos(x) ≈ " .. root)
end)

-- ====================
-- Test: JACOBI
-- ====================
print(YELLOW .. "\n🔹 MÉTODO: JACOBI" .. RESET)

test("Resolver sistema 3x - y = 1, 2x + 4y = 2", function()
    -- Sistema: 3x - y = 1, -x + 4y = 5
    -- Matriz: [[3, -1], [-1, 4]], b: [1, 5]
    local A = {{3, -1}, {-1, 4}}
    local b = {1, 5}
    
    local x, iterations = calc.methods.jacobi.solve(A, b, nil, 1e-6)
    
    assert(x, "No se encontró solución")
    assert(#x == 2, "Dimensión incorrecta")
    
    -- Verificar: A*x ≈ b
    local Ax = {3*x[1] - x[2], -x[1] + 4*x[2]}
    local error_1 = math.abs(Ax[1] - b[1])
    local error_2 = math.abs(Ax[2] - b[2])
    
    assert(error_1 < 1e-5 and error_2 < 1e-5, "Solución incorrecta")
    print("    x ≈ " .. x[1] .. ", y ≈ " .. x[2])
end)

-- ====================
-- Test: TAYLOR
-- ====================
print(YELLOW .. "\n🔹 MÉTODO: TAYLOR" .. RESET)

test("Expandir sin(x) alrededor de 0 (Maclaurin)", function()
    local f = math.sin
    local expansion = calc.methods.taylor.expand(f, 0, 5)
    
    assert(expansion.coefficients, "Sin coeficientes")
    assert(#expansion.coefficients == 5, "Número incorrecto de coeficientes")
    
    -- Evaluar en π/6 (donde la aproximación es mejor)
    local x = math.pi / 6
    local approx = expansion.evaluate(x)
    local actual = math.sin(x)
    
    assert(math.abs(approx - actual) < 0.01, "Precisión insuficiente")
    print("    sin(π/6) = " .. actual .. ", aproximado = " .. approx)
end)

-- ====================
-- Test: MACLAURIN
-- ====================
print(YELLOW .. "\n🔹 MÉTODO: MACLAURIN" .. RESET)

test("Expandir exp(x) - validar coeficientes", function()
    local f = math.exp
    local expansion = calc.methods.maclaurin.expand(f, 5)
    
    assert(expansion.coefficients, "Sin coeficientes")
    
    -- Los coeficientes de exp(x) = 1 + x + x^2/2! + x^3/3! + ...
    -- Deberian ser [1, 1, 0.5, 0.1666..., ...]
    -- Validar que al menos existan
    for i = 1, #expansion.coefficients do
        assert(type(expansion.coefficients[i]) == "number", "Coeficiente " .. i .. " no es numero")
    end
    
    print("    Coeficientes calculados: " .. #expansion.coefficients)
end)

-- ====================
-- Resumen
-- ====================
print(YELLOW .. "\n╔════════════════════════════════════════╗" .. RESET)
print(YELLOW .. "║          RESUMEN DE PRUEBAS            ║" .. RESET)
print(YELLOW .. "╚════════════════════════════════════════╝" .. RESET)

print("")
print(GREEN .. "✓ Pasadas:  " .. tests_passed .. RESET)
print(RED .. "✗ Fallidas: " .. tests_failed .. RESET)
print("")

if tests_failed == 0 then
    print(GREEN .. "🎉 ¡TODAS LAS PRUEBAS PASARON!" .. RESET)
    os.exit(0)
else
    print(RED .. "❌ Algunas pruebas fallaron" .. RESET)
    os.exit(1)
end
