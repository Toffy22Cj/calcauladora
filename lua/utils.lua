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

-- Buscar un intervalo automáticamente (para cuando a y b son opcionales)
function utils.find_bracket(f, start_val, max_steps)
    start_val = start_val or 0
    max_steps = max_steps or 200
    local step = 0.5
    
    local fa = f(start_val)
    if fa == 0 then return start_val, start_val end
    
    -- Expandir hacia los lados
    for i = 1, max_steps do
        -- Lado positivo
        local x_pos = start_val + i * step
        if utils.sign_change(f, start_val, x_pos) then
            return start_val, x_pos
        end
        -- Lado negativo
        local x_neg = start_val - i * step
        if utils.sign_change(f, start_val, x_neg) then
            return x_neg, start_val
        end
    end
    
    return nil, nil
end

return utils
