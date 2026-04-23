-- Utilidades comunes para todos los métodos numéricos

local utils = {}

-- Precisión por defecto
utils.EPSILON = 1e-10
utils.MAX_ITERATIONS = 1000

-- Validar que sea un número
function utils.is_number(value)
    return type(value) == "number" and value == value -- NaN check
end

-- Validar que sea una función
function utils.is_function(f)
    return type(f) == "function"
end

-- Redondear a N decimales
function utils.round(value, decimals)
    decimals = decimals or 10
    local multiplier = 10 ^ decimals
    return math.floor(value * multiplier + 0.5) / multiplier
end

-- Valor absoluto
function utils.abs(value)
    return value < 0 and -value or value
end

-- Calcular derivada numérica
function utils.derivative(f, x, h)
    h = h or 1e-7
    return (f(x + h) - f(x - h)) / (2 * h)
end

-- Validar parámetros comunes
function utils.validate_params(f, a, b, tol)
    if not utils.is_function(f) then
        return false, "f debe ser una función"
    end
    if not utils.is_number(a) then
        return false, "a debe ser un número"
    end
    if not utils.is_number(b) then
        return false, "b debe ser un número"
    end
    if tol and (not utils.is_number(tol) or tol <= 0) then
        return false, "tolerancia debe ser un número positivo"
    end
    return true
end

-- Comprobar cambio de signo
function utils.sign_change(f, a, b)
    local fa = f(a)
    local fb = f(b)
    return fa * fb < 0
end

return utils
