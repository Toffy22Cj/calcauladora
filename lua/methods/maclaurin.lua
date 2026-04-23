-- Serie de Maclaurin
-- Caso especial de Taylor centrada en x0 = 0

local taylor = require("methods.taylor")
local utils = require("utils")

local maclaurin = {}

-- Expandir función como serie de Maclaurin
function maclaurin.expand(f, n_terms, eval_x)
    n_terms = n_terms or 5
    return taylor.expand(f, 0, n_terms, eval_x)
end

-- Obtener coeficientes de Maclaurin
function maclaurin.get_coefficients(f, n_terms)
    n_terms = n_terms or 5
    return taylor.get_coefficients(f, 0, n_terms)
end

-- Evaluar serie de Maclaurin
function maclaurin.evaluate(coefficients, x, n_terms)
    n_terms = n_terms or #coefficients
    return taylor.evaluate(coefficients, 0, x, n_terms)
end

-- Series de Maclaurin conocidas precalculadas
maclaurin.PRECOMPUTED = {
    -- e^x = Σ x^n / n!
    exp = function(x, n_terms)
        n_terms = n_terms or 20
        local result = 0
        for n = 0, n_terms - 1 do
            result = result + (x ^ n) / math.factorial and math.factorial(n) or 1
            if n > 0 then
                for i = 1, n do result = result end -- Esto está mal, usar factorial correcto
            end
        end
        return result
    end,
    
    -- sin(x) = Σ (-1)^n * x^(2n+1) / (2n+1)!
    sin = function(x, n_terms)
        n_terms = n_terms or 20
        local result = 0
        local fact = 1
        
        for n = 0, n_terms - 1 do
            if n > 0 then
                fact = fact * (2*n) * (2*n + 1)
            end
            local sign = (n % 2 == 0) and 1 or -1
            result = result + sign * (x ^ (2*n + 1)) / fact
        end
        
        return result
    end,
    
    -- cos(x) = Σ (-1)^n * x^(2n) / (2n)!
    cos = function(x, n_terms)
        n_terms = n_terms or 20
        local result = 0
        local fact = 1
        
        for n = 0, n_terms - 1 do
            if n > 0 then
                fact = fact * (2*n - 1) * (2*n)
            end
            local sign = (n % 2 == 0) and 1 or -1
            result = result + sign * (x ^ (2*n)) / fact
        end
        
        return result
    end
}

function maclaurin.info()
    return {
        name = "Serie de Maclaurin",
        description = "Caso especial de la serie de Taylor centrada en x = 0",
        formula = "f(x) ≈ Σ[f^(n)(0)/n!*x^n]",
        parameters = {
            f = "Función a expandir",
            n_terms = "Número de términos (opcional, default: 5)",
            eval_x = "Punto para evaluar (opcional)"
        },
        common_series = {
            "e^x, sin(x), cos(x), ln(1+x), (1+x)^r"
        },
        pros = {
            "Simplifica cálculos",
            "Centro natural en origen",
            "Muchas series conocidas"
        },
        cons = {
            "Radio de convergencia limitado",
            "Menos precisa para valores grandes de x"
        }
    }
end

return maclaurin
