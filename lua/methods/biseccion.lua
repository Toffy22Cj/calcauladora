-- Método de Bisección
-- Encuentra la raíz de una función en un intervalo [a, b]
-- Requiere que f(a) y f(b) tengan signos opuestos

local utils = require("utils")

local biseccion = {}

function biseccion.solve(f, a, b, tolerance, max_iterations)
    -- Valores por defecto
    tolerance = tolerance or utils.EPSILON
    max_iterations = max_iterations or utils.MAX_ITERATIONS

    -- Autocompletar intervalo si falta
    if not a or not b then
        a, b = utils.find_bracket(f)
        if not a or not b then
            return nil, "No se encontró un intervalo automáticamente. Por favor ingresa a y b manualmente."
        end
    end

    -- Validar parámetros
    local valid, error_msg = utils.validate_params(f, a, b, tolerance)
    if not valid then
        return nil, error_msg
    end

    -- Verificar cambio de signo
    if not utils.sign_change(f, a, b) then
        return nil, "f("..a..") y f("..b..") deben tener signos opuestos"
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
        local fa = f(a)
        
        local sign_changed = (fa * fc < 0)
        local details = "f(c) = " .. utils.round(fc, 6) .. ". "
        if sign_changed then
            details = details .. "Como f(a)*f(c) < 0, la raíz está en [a, c]. El nuevo b será c ("..utils.round(c, 4)..")."
        else
            details = details .. "Como f(a)*f(c) > 0, la raíz está en [c, b]. El nuevo a será c ("..utils.round(c, 4)..")."
        end

        -- Guardar información de esta iteración
        table.insert(iterations, {
            iteration = iteration,
            a = a,
            b = b,
            c = c,
            fc = fc,
            error = utils.abs(b - a) / 2,
            details = details
        })

        -- Criterio de parada
        if utils.abs(b - a) < tolerance or utils.abs(fc) < tolerance then
            return c, iterations
        end

        -- Decidir próximo intervalo
        if sign_changed then
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
