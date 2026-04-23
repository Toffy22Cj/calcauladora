-- Método de Punto Fijo
-- Encuentra x tal que x = g(x)

local utils = require("utils")

local punto_fijo = {}

function punto_fijo.solve(g, x0, tolerance, max_iterations)
    -- Valores por defecto
    tolerance = tolerance or utils.EPSILON
    max_iterations = max_iterations or utils.MAX_ITERATIONS

    -- Validar parámetros
    if not utils.is_function(g) then
        return nil, "g debe ser una función"
    end
    if not utils.is_number(x0) then
        return nil, "x0 debe ser un número"
    end

    local iterations = {}
    local xn = x0
    local iteration = 0

    while iteration < max_iterations do
        iteration = iteration + 1

        -- Aplicar iteración: x_{n+1} = g(x_n)
        local xn_new = g(xn)
        local error = utils.abs(xn_new - xn)

        -- Guardar iteración
        table.insert(iterations, {
            iteration = iteration,
            x = xn,
            g_x = xn_new,
            error = error
        })

        -- Criterio de parada
        if error < tolerance then
            return xn_new, iterations
        end

        xn = xn_new
    end

    return xn, iterations, "Máximo de iteraciones alcanzado"
end

-- Verificar si la función de iteración es contractora (condición de convergencia)
function punto_fijo.is_contractora(g, interval_a, interval_b, samples)
    samples = samples or 10
    
    for i = 0, samples do
        local x = interval_a + (interval_b - interval_a) * i / samples
        local g_prime = utils.derivative(g, x)
        if utils.abs(g_prime) >= 1 then
            return false, "Función no es contractora en x = " .. x
        end
    end
    
    return true
end

function punto_fijo.info()
    return {
        name = "Punto Fijo",
        description = "Encuentra x donde x = g(x) iterando x_{n+1} = g(x_n)",
        parameters = {
            g = "Función de iteración (debe ser contractora)",
            x0 = "Aproximación inicial",
            tolerance = "Tolerancia de convergencia (opcional)",
            max_iterations = "Máximas iteraciones (opcional)"
        },
        convergence = "Lineal",
        pros = {
            "Simple de implementar",
            "Flexible (muchas formas de g)",
            "Base para otros métodos"
        },
        cons = {
            "Convergencia lenta",
            "Requiere que g sea contractora",
            "Sensible a la forma de g"
        },
        note = "Para f(x)=0, usar g(x)=x+c*f(x) o g(x)=x-f(x)/f'(x)"
    }
end

return punto_fijo
