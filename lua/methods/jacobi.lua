-- Método de Jacobi
-- Resuelve sistemas lineales Ax = b

local utils = require("utils")

local jacobi = {}

-- Multiplicar matriz por vector
local function mat_vec_mult(A, v)
    local result = {}
    for i = 1, #A do
        result[i] = 0
        for j = 1, #A[i] do
            result[i] = result[i] + A[i][j] * v[j]
        end
    end
    return result
end

-- Restar dos vectores
local function vec_subtract(v1, v2)
    local result = {}
    for i = 1, #v1 do
        result[i] = v1[i] - v2[i]
    end
    return result
end

-- Norma euclidiana de un vector
local function vec_norm(v)
    local sum = 0
    for i = 1, #v do
        sum = sum + v[i] * v[i]
    end
    return math.sqrt(sum)
end

-- Resolver Ax = b usando método de Jacobi
-- A: matriz de coeficientes (tabla de tablas)
-- b: vector de términos independientes
-- x0: aproximación inicial (opcional)
function jacobi.solve(A, b, x0, tolerance, max_iterations)
    tolerance = tolerance or utils.EPSILON
    max_iterations = max_iterations or utils.MAX_ITERATIONS

    -- Validar que la matriz sea cuadrada
    if #A ~= #b then
        return nil, "Las dimensiones no coinciden"
    end
    if #A ~= #A[1] then
        return nil, "La matriz debe ser cuadrada"
    end

    local n = #A
    
    -- Verificar que la diagonal no sea cero (necesario para Jacobi)
    for i = 1, n do
        if utils.abs(A[i][i]) < 1e-15 then
            return nil, "Elemento diagonal " .. i .. " es cero"
        end
    end

    -- Aproximación inicial
    if not x0 then
        x0 = {}
        for i = 1, n do
            x0[i] = 0
        end
    end

    local iterations = {}
    local x = {}
    for i = 1, n do x[i] = x0[i] end
    
    local iteration = 0

    while iteration < max_iterations do
        iteration = iteration + 1
        
        local x_new = {}

        -- Calcular la nueva aproximación
        for i = 1, n do
            local sum = 0
            for j = 1, n do
                if i ~= j then
                    sum = sum + A[i][j] * x[j]
                end
            end
            x_new[i] = (b[i] - sum) / A[i][i]
        end

        -- Calcular error
        local error_vec = vec_subtract(x_new, x)
        local error = vec_norm(error_vec)

        -- Guardar iteración
        table.insert(iterations, {
            iteration = iteration,
            x = {table.unpack(x_new)},
            error = error
        })

        -- Criterio de parada
        if error < tolerance then
            return x_new, iterations
        end

        x = x_new
    end

    return x, iterations, "Máximo de iteraciones alcanzado"
end

function jacobi.info()
    return {
        name = "Método de Jacobi",
        description = "Resuelve sistemas lineales Ax=b de forma iterativa",
        parameters = {
            A = "Matriz de coeficientes (tabla de tablas)",
            b = "Vector de términos independientes",
            x0 = "Aproximación inicial (opcional)",
            tolerance = "Tolerancia de convergencia (opcional)",
            max_iterations = "Máximas iteraciones (opcional)"
        },
        convergence = "Lineal (lenta)",
        pros = {
            "Paralelizable",
            "Simple de implementar",
            "Sin requerer factorización"
        },
        cons = {
            "Convergencia lenta",
            "No siempre converge",
            "Requiere matriz diagonalmente dominante"
        },
        note = "Funciona mejor cuando la matriz es diagonalmente dominante"
    }
end

return jacobi
