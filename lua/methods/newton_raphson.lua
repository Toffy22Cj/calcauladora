-- Método de Newton-Raphson
-- Encuentra raíces usando la derivada de la función
-- Fórmula: x_{n+1} = x_n - f(x_n) / f'(x_n)

local utils = require("utils")

local newton = {}

function newton.solve(f, f_prime, x0, tolerance, max_iterations)
    -- Valores por defecto
    tolerance = tolerance or utils.EPSILON
    max_iterations = max_iterations or utils.MAX_ITERATIONS

    -- Autocompletar x0 si falta
    if not x0 then
        local a, b = utils.find_bracket(f)
        if a and b then
            x0 = (a + b) / 2
        else
            return nil, "No se encontró un x0 automáticamente. Por favor ingresa x0 manualmente."
        end
    end

    -- Validar parámetros
    if not utils.is_function(f) then
        return nil, "f debe ser una función"
    end
    if not utils.is_function(f_prime) then
        return nil, "f_prime (derivada) debe ser una función"
    end
    if not utils.is_number(x0) then
        return nil, "x0 debe ser un número"
    end

    local iterations = {}
    local xn = x0
    local iteration = 0

    while iteration < max_iterations do
        iteration = iteration + 1

        local fxn = f(xn)
        local fpxn = f_prime(xn)

        -- Evitar división por cero
        if utils.abs(fpxn) < 1e-15 then
            return nil, "La derivada es demasiado cercana a cero"
        end

        -- Calcular siguiente aproximación
        local xn_new = xn - fxn / fpxn
        local error = utils.abs(xn_new - xn)
        
        local details = "Pendiente (tangente): "..utils.round(fpxn, 4)..". Intersección con eje X en x="..utils.round(xn_new, 4)

        -- Guardar iteración
        table.insert(iterations, {
            iteration = iteration,
            x = xn,
            f_x = fxn,
            f_prime_x = fpxn,
            x_new = xn_new,
            error = error,
            details = details
        })

        -- Criterio de parada
        if error < tolerance or utils.abs(fxn) < tolerance then
            return xn_new, iterations
        end

        xn = xn_new
    end

    return xn, iterations, "Máximo de iteraciones alcanzado"
end

-- Versión que calcula la derivada numéricamente si no se proporciona
function newton.solve_auto(f, x0, tolerance, max_iterations)
    local f_prime = function(x)
        return utils.derivative(f, x)
    end
    return newton.solve(f, f_prime, x0, tolerance, max_iterations)
end

function newton.info()
    return {
        name = "Newton-Raphson",
        description = "Método iterativo que usa la derivada para converger a la raíz",
        parameters = {
            f = "Función a evaluar",
            f_prime = "Derivada de la función",
            x0 = "Aproximación inicial",
            tolerance = "Tolerancia de convergencia (opcional)",
            max_iterations = "Máximas iteraciones (opcional)"
        },
        convergence = "Cuadrática (muy rápida)",
        pros = {
            "Muy rápido cuando funciona",
            "Convergencia cuadrática",
            "General"
        },
        cons = {
            "Requiere derivada",
            "No siempre converge",
            "Sensible a la aproximación inicial"
        }
    }
end

return newton
