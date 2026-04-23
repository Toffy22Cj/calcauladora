-- Calculator.lua - Punto de entrada principal
-- Exporta todos los métodos numéricos

local calculator = {
    -- Cargar todos los métodos
    methods = {
        biseccion = require("methods.biseccion"),
        newton_raphson = require("methods.newton_raphson"),
        secante = require("methods.secante"),
        punto_fijo = require("methods.punto_fijo"),
        jacobi = require("methods.jacobi"),
        taylor = require("methods.taylor"),
        maclaurin = require("methods.maclaurin")
    },
    
    -- Utilidades
    utils = require("utils")
}

-- Función para listar todos los métodos disponibles
function calculator.list_methods()
    local methods_info = {}
    for name, method in pairs(calculator.methods) do
        if method.info then
            methods_info[name] = method.info()
        end
    end
    return methods_info
end

-- Función para ejecutar un método de forma genérica
function calculator.solve(method_name, params)
    local method = calculator.methods[method_name]
    
    if not method or not method.solve then
        return nil, "Método '" .. method_name .. "' no encontrado o no soporta solve()"
    end
    
    if method_name == 'jacobi' then
        return method.solve(
            params.A,
            params.b,
            params.x0,
            params.tolerance,
            params.max_iterations
        )
    elseif method_name == 'taylor' or method_name == 'maclaurin' then
        return method.solve(
            params.f,
            params.x0,
            params.n_terms,
            params.eval_x
        )
    else
        return method.solve(
            params.f or params.g,
            params.a or params.x0,
            params.b or params.f_prime or params.x1,
            params.tolerance,
            params.max_iterations
        )
    end
end

-- Información general
function calculator.info()
    return {
        name = "Super Calculadora Numérica Lua",
        version = "1.0.0",
        description = "Calculadora avanzada con métodos numéricos para encontrar raíces y resolver sistemas",
        methods = {
            "Bisección",
            "Newton-Raphson",
            "Método de la Secante",
            "Punto Fijo",
            "Jacobi (sistemas lineales)",
            "Serie de Taylor",
            "Serie de Maclaurin"
        }
    }
end

return calculator
