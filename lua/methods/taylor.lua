-- Serie de Taylor
-- Aproxima una función alrededor de un punto x0

local utils = require("utils")

local taylor = {}

-- Calcular factorial
local function factorial(n)
    if n <= 1 then return 1 end
    return n * factorial(n - 1)
end

-- Aproximar derivada n-ésima numéricamente
local function derive_nth(f, n, x, h)
    h = h or 1e-5
    
    if n == 0 then
        return f(x)
    end
    
    local f_prime = function(t)
        return utils.derivative(f, t, h)
    end
    
    for i = 2, n do
        local f_temp = f_prime
        f_prime = function(t)
            return utils.derivative(f_temp, t, h)
        end
    end
    
    return f_prime(x)
end

-- Calcular coeficientes de la serie de Taylor
function taylor.get_coefficients(f, x0, n_terms)
    n_terms = n_terms or 5
    local coefficients = {}
    
    for n = 0, n_terms - 1 do
        local f_n = derive_nth(f, n, x0)
        coefficients[n + 1] = f_n / factorial(n)
    end
    
    return coefficients
end

-- Evaluar la serie de Taylor en un punto x
function taylor.evaluate(coefficients, x0, x, n_terms)
    n_terms = n_terms or #coefficients
    local result = 0
    
    for n = 0, n_terms - 1 do
        if coefficients[n + 1] then
            result = result + coefficients[n + 1] * ((x - x0) ^ n)
        end
    end
    
    return result
end

-- Expandir función como serie de Taylor
function taylor.expand(f, x0, n_terms, eval_x)
    n_terms = n_terms or 5
    
    local coefficients = taylor.get_coefficients(f, x0, n_terms)
    
    local expansion = {}
    expansion.coefficients = coefficients
    expansion.x0 = x0
    expansion.n_terms = n_terms
    
    -- Crear función para evaluar
    expansion.evaluate = function(x)
        return taylor.evaluate(coefficients, x0, x, n_terms)
    end
    
    -- Si se proporciona eval_x, evaluar
    if eval_x then
        expansion.value_at_eval = taylor.evaluate(coefficients, x0, eval_x, n_terms)
    end
    
    return expansion
end

-- Mostrar serie como fórmula (aproximada)
function taylor.formula_string(coefficients, x0, n_terms)
    n_terms = n_terms or #coefficients
    local terms = {}
    
    for n = 0, n_terms - 1 do
        if coefficients[n + 1] then
            local coeff = utils.round(coefficients[n + 1], 6)
            if n == 0 then
                table.insert(terms, tostring(coeff))
            elseif n == 1 then
                table.insert(terms, coeff .. "(x-" .. x0 .. ")")
            else
                table.insert(terms, coeff .. "(x-" .. x0 .. ")^" .. n)
            end
        end
    end
    
    return table.concat(terms, " + ")
end

function taylor.info()
    return {
        name = "Serie de Taylor",
        description = "Aproxima una función como serie de potencias alrededor de x0",
        formula = "f(x) ≈ Σ[f^(n)(x0)/n!*(x-x0)^n]",
        parameters = {
            f = "Función a expandir",
            x0 = "Centro de expansión",
            n_terms = "Número de términos (opcional, default: 5)",
            eval_x = "Punto para evaluar (opcional)"
        },
        pros = {
            "Muy versátil",
            "Base teórica fuerte",
            "Evaluación rápida una vez expandida"
        },
        cons = {
            "Radio de convergencia limitado",
            "Requiere calcular derivadas",
            "Menos precisa lejos de x0"
        }
    }
end

return taylor
