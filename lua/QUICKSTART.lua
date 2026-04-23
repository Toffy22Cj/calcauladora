#!/usr/bin/env lua
-- QUICKSTART.lua - Guía de inicio rápido

-- ============================================
-- 🚀 SUPER CALCULADORA NUMÉRICA - QUICKSTART
-- ============================================

-- Configurar path si es necesario
if not package.path:match("lua") then
    package.path = './lua/?.lua;' .. package.path
end

local calc = require("calculator")

print("\n" .. string.rep("═", 70))
print("🧮 SUPER CALCULADORA NUMÉRICA LUA")
print(string.rep("═", 70) .. "\n")

-- ============= EJEMPLO 1: Bisección =============
print("📍 EJEMPLO 1: Encontrar √2 usando Bisección")
print("─" .. string.rep("─", 68) .. "\n")

-- Definir la función
local function f1(x)
    return x^2 - 2
end

-- Resolver
local raiz, iteraciones = calc.methods.biseccion.solve(f1, 1, 2, 1e-10)

print("Función: f(x) = x² - 2")
print("Intervalo: [1, 2]")
print("Resultado: √2 ≈ " .. raiz)
print("Error real: " .. math.abs(raiz - math.sqrt(2)))
print("Iteraciones necesarias: " .. #iteraciones)
print("\nPrimeras 5 iteraciones:")
for i = 1, math.min(5, #iteraciones) do
    local it = iteraciones[i]
    print(string.format("  %d: [%.6f, %.6f] → c=%.6f, f(c)=%.6f",
        it.iteration, it.a, it.b, it.c, it.fc))
end

-- ============= EJEMPLO 2: Newton-Raphson =============
print("\n\n📍 EJEMPLO 2: Mismo problema con Newton-Raphson")
print("─" .. string.rep("─", 68) .. "\n")

local function f2(x)
    return x^2 - 2
end

local function df2(x)
    return 2*x
end

local raiz2, iteraciones2 = calc.methods.newton_raphson.solve(f2, df2, 1.5, 1e-15)

print("Función: f(x) = x² - 2")
print("Derivada: f'(x) = 2x")
print("Aproximación inicial: x₀ = 1.5")
print("Resultado: √2 ≈ " .. raiz2)
print("Iteraciones necesarias: " .. #iteraciones2 .. " (¡mucho más rápido!)")

-- ============= EJEMPLO 3: Punto Fijo =============
print("\n\n📍 EJEMPLO 3: Punto Fijo - Resolver x = cos(x)")
print("─" .. string.rep("─", 68) .. "\n")

local function g(x)
    return math.cos(x)
end

local raiz3, iteraciones3 = calc.methods.punto_fijo.solve(g, 0.5, 1e-10)

print("Función de iteración: g(x) = cos(x)")
print("Buscamos: x = cos(x)")
print("Resultado: x ≈ " .. raiz3)
print("Verificación: cos(" .. raiz3 .. ") = " .. g(raiz3))
print("Iteraciones: " .. #iteraciones3)

-- ============= EJEMPLO 4: Sistema Lineal =============
print("\n\n📍 EJEMPLO 4: Jacobi - Resolver sistema 2×2")
print("─" .. string.rep("─", 68) .. "\n")

print("Sistema:")
print("   3x - y  = 2")
print("  -x + 4y = 5")

local A = {{3, -1}, {-1, 4}}
local b = {2, 5}

local solucion, iteraciones4 = calc.methods.jacobi.solve(A, b, nil, 1e-10)

print("\nSolución: x = " .. solucion[1] .. ", y = " .. solucion[2])
print("Iteraciones: " .. #iteraciones4)

-- Verificar: Ax = b
local ax1 = 3*solucion[1] - solucion[2]
local ax2 = -solucion[1] + 4*solucion[2]
print("Verificación:")
print("  3x - y  = " .. ax1 .. " (esperado: 2)")
print("  -x + 4y = " .. ax2 .. " (esperado: 5)")

-- ============= MOSTRAR MENÚ DE OPCIONES =============
print("\n\n" .. string.rep("═", 70))
print("✨ OPCIONES DISPONIBLES")
print(string.rep("═", 70) .. "\n")

local metodos = calc.list_methods()
for nombre, info in pairs(metodos) do
    print("▶ " .. info.name)
    print("  " .. info.description)
    print()
end

print("\n" .. string.rep("═", 70))
print("📚 PRÓXIMOS PASOS:")
print(string.rep("═", 70))
print("1. Revisa el archivo README.md para documentación completa")
print("2. Lee TECHNICAL.md para API detallada")
print("3. Ejecuta: lua examples.lua (más ejemplos)")
print("4. Ejecuta: lua tests/test_methods.lua (validar todo funciona)")
print("")
print("5. INTEGRACIÓN CON REACT NATIVE:")
print("   - El código Lua está listo para ser usado desde una API")
print("   - Próximo: Crear servidor HTTP con Lapis")
print("   - Luego: Conectar desde React Native")
print("")
print("¡Felicidades! Tu calculadora numérica está lista. 🎉")
print("")

print(string.rep("═", 70) .. "\n")
