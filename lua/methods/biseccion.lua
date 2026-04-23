-- Método de Bisección
-- Encuentra la raíz de una función en un intervalo [a, b]
-- Requiere que f(a) y f(b) tengan signos opuestos

local utils = require("utils")

local biseccion = {}

function biseccion.solve(f, a, b, tolerance, max_iterations)
    -- Valores por defecto
    tolerance = tolerance or utils.EPSILON
    max_iterations = max_iterations or utils.MAX_ITERATIONS

    -- Validar parámetros
    local valid, error_msg = utils.validate_params(f, a, b, tolerance)
    if not valid then
        return nil, error_msg
    end

    -- Verificar cambio de signo
    if not utils.sign_change(f, a, b) then
        return nil, "f(a) y f(b) deben tener signos opuestos"
    end

    -- Asegurar que a < b
    if a > b then
        a, b = b, a
    end

    local iterations = {}
    local iteration = 0

    while iteration < max_iterations do
        iteration = iteration + 1

        -- Punto medio
        local c = (a + b) / 2
        local fc = f(c)

        -- Guardar información de esta iteración
        table.insert(iterations, {
            iteration = iteration,
            a = a,
            b = b,
            c = c,
            fc = fc,
            error = utils.abs(b - a) / 2
        })

        -- Criterio de parada
        if utils.abs(b - a) < tolerance or utils.abs(fc) < tolerance then
            return c, iterations
        end

        -- Decidir próximo intervalo
        if utils.sign_change(f, a, c) then
            b = c
        else
            a = c
        end
    end

    return (a + b) / 2, iterations, "Máximo de iteraciones alcanzado"
end

-- Información del método
function biseccion.info()
    return {
        name = "Bisección",
        description = "Divide el intervalo por la mitad repetidamente para encontrar la raíz",
        parameters = {
            f = "Función a evaluar",
            a = "Límite inferior del intervalo",
            b = "Límite superior del intervalo",
            tolerance = "Tolerancia de convergencia (opcional, default: 1e-10)",
            max_iterations = "Máximas iteraciones (opcional, default: 1000)"
        },
        requirements = "Requiere que f(a) y f(b) tengan signos opuestos",
        convergence = "Lineal (lenta pero garantizada)",
        pros = {
            "Siempre converge si la raíz está en [a,b]",
            "No requiere derivadas",
            "Predecible"
        },
        cons = {
            "Convergencia lenta",
            "Requiere cambio de signo"
        }
    }
end

return biseccion
