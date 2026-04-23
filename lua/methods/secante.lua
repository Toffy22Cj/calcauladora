-- Método de la Secante
-- Similar a Newton-Raphson pero aproxima la derivada sin calcularla

local utils = require("utils")

local secante = {}

function secante.solve(f, x0, x1, tolerance, max_iterations)
    -- Valores por defecto
    tolerance = tolerance or utils.EPSILON
    max_iterations = max_iterations or utils.MAX_ITERATIONS

    -- Autocompletar intervalo si falta
    if not x0 or not x1 then
        x0, x1 = utils.find_bracket(f)
        if not x0 or not x1 then
            return nil, "No se encontró x0 y x1 automáticamente. Ingrésalos manualmente."
        end
    end

    -- Validar parámetros
    if not utils.is_function(f) then
        return nil, "f debe ser una función"
    end
    if not utils.is_number(x0) or not utils.is_number(x1) then
        return nil, "x0 y x1 deben ser números"
    end

    local iterations = {}
    local xn_minus_1 = x0
    local xn = x1
    local iteration = 0

    while iteration < max_iterations do
        iteration = iteration + 1

        local fxn = f(xn)
        local fxn_minus_1 = f(xn_minus_1)

        -- Evitar división por cero
        if utils.abs(fxn - fxn_minus_1) < 1e-15 then
            return nil, "Denominador demasiado cercano a cero"
        end

        -- Calcular siguiente aproximación
        local xn_new = xn - fxn * (xn - xn_minus_1) / (fxn - fxn_minus_1)
        local error = utils.abs(xn_new - xn)
        
        local details = "Se proyectó la secante desde x_{i-1}="..utils.round(xn_minus_1, 4).." hasta x_i="..utils.round(xn, 4)..". Intersección en x="..utils.round(xn_new, 4)

        -- Guardar iteración
        table.insert(iterations, {
            iteration = iteration,
            x_minus_1 = xn_minus_1,
            x = xn,
            f_x = fxn,
            x_new = xn_new,
            error = error,
            details = details
        })

        -- Criterio de parada
        if error < tolerance or utils.abs(fxn) < tolerance then
            return xn_new, iterations
        end

        xn_minus_1 = xn
        xn = xn_new
    end

    return xn, iterations, "Máximo de iteraciones alcanzado"
end

function secante.info()
    return {
        name = "Método de la Secante",
        description = "Aproxima la derivada usando dos puntos anteriores",
        parameters = {
            f = "Función a evaluar",
            x0 = "Primera aproximación",
            x1 = "Segunda aproximación",
            tolerance = "Tolerancia de convergencia (opcional)",
            max_iterations = "Máximas iteraciones (opcional)"
        },
        convergence = "Superlineal (1.618 aprox)",
        pros = {
            "No requiere derivada analítica",
            "Converge rápido",
            "General"
        },
        cons = {
            "Necesita dos aproximaciones iniciales",
            "Convergencia más lenta que Newton-Raphson",
            "No siempre converge"
        }
    }
end

return secante
