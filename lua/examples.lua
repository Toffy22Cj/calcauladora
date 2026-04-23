-- examples.lua - Ejemplos de uso de la calculadora

local calc = require("calculator")

print("\n" .. string.rep("=", 60))
print("📚 EJEMPLOS DE USO - SUPER CALCULADORA NUMÉRICA")
print(string.rep("=", 60) .. "\n")

-- ====== EJEMPLO 1: Bisección ======
print("1️⃣  BISECCIÓN - Encontrar √2")
print("-" .. string.rep("-", 58))
local f1 = function(x) return x^2 - 2 end
local root1, iter1 = calc.methods.biseccion.solve(f1, 1, 2, 1e-10)
print("   Raíz: " .. root1)
print("   Iteraciones: " .. #iter1)
print("   Error real: " .. math.abs(root1 - math.sqrt(2)))

-- ====== EJEMPLO 2: Newton-Raphson ======
print("\n2️⃣  NEWTON-RAPHSON - Encontrar ∛2")
print("-" .. string.rep("-", 58))
local f2 = function(x) return x^3 - 2 end
local f2_prime = function(x) return 3*x^2 end
local root2, iter2 = calc.methods.newton_raphson.solve(f2, f2_prime, 1.5, 1e-15)
print("   Raíz: " .. root2)
print("   Iteraciones: " .. #iter2)
print("   Convergencia muy rápida!")

-- ====== EJEMPLO 3: Secante ======
print("\n3️⃣  SECANTE - Encontrar raíz de x^2 - 5")
print("-" .. string.rep("-", 58))
local f3 = function(x) return x^2 - 5 end
local root3, iter3 = calc.methods.secante.solve(f3, 2, 3, 1e-10)
print("   Raíz: " .. root3)
print("   Iteraciones: " .. #iter3)
print("   Verificación: f(" .. root3 .. ") = " .. f3(root3))

-- ====== EJEMPLO 4: Punto Fijo ======
print("\n4️⃣  PUNTO FIJO - Resolver x = cos(x)")
print("-" .. string.rep("-", 58))
local g = function(x) return math.cos(x) end
local root4, iter4 = calc.methods.punto_fijo.solve(g, 0.5, 1e-10)
print("   Raíz: " .. root4)
print("   Iteraciones: " .. #iter4)
print("   Verificación: cos(" .. root4 .. ") = " .. g(root4))

-- ====== EJEMPLO 5: Jacobi ======
print("\n5️⃣  JACOBI - Resolver sistema 2x2")
print("-" .. string.rep("-", 58))
print("   Sistema:")
print("     4x - y + z = 7")
print("     4x - 8y + z = -21")
print("     -2x + y + 5z = 15")
local A = {{4, -1, 1}, {4, -8, 1}, {-2, 1, 5}}
local b = {7, -21, 15}
local sol, iter5 = calc.methods.jacobi.solve(A, b, nil, 1e-10)
print("   Solución: x=" .. sol[1] .. ", y=" .. sol[2] .. ", z=" .. sol[3])
print("   Iteraciones: " .. #iter5)

-- ====== EJEMPLO 6: Taylor ======
print("\n6️⃣  TAYLOR - Expandir ln(x) en x=1")
print("-" .. string.rep("-", 58))
local f6 = function(x) return math.log(x) end
local taylor_expansion = calc.methods.taylor.expand(f6, 1, 6, 1.5)
print("   Evaluando en x=1.5")
print("   Aproximación: " .. taylor_expansion)
print("   Valor real: " .. math.log(1.5))

-- ====== EJEMPLO 7: Maclaurin ======
print("\n7️⃣  MACLAURIN - Aproximar sin(x)")
print("-" .. string.rep("-", 58))
local f7 = math.sin
local mac_exp = calc.methods.maclaurin.expand(f7, 10)
print("   Coeficientes calculados: " .. #mac_exp.coefficients)
local x_test = math.pi / 4
local approx = mac_exp.evaluate(x_test)
print("   Sin(π/4) real: " .. math.sin(x_test))
print("   Aproximación: " .. approx)
print("   Error: " .. math.abs(approx - math.sin(x_test)))

-- ====== Información General ======
print("\n" .. string.rep("=", 60))
print("ℹ️  INFORMACIÓN GENERAL")
print(string.rep("=", 60))
local info = calc.info()
print("   Nombre: " .. info.name)
print("   Métodos disponibles: " .. table.concat(info.methods, ", "))
print("")
