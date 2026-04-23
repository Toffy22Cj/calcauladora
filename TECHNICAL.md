# Documentación Técnica - Super Calculadora Numérica

Documentación completa y guía de desarrollo para la implementación de métodos numéricos.

## 📋 Tabla de Contenidos

1. [Módulos Disponibles](#módulos-disponibles)
2. [API Pública](#api-pública)
3. [Arquitectura](#arquitectura)
4. [Extensibilidad](#extensibilidad)
5. [Optimización](#optimización)

---

## Módulos Disponibles

### `calculator.lua`

Punto de entrada principal que exporta todos los métodos.

**Funciones:**

- `calculator.list_methods()` - Lista todos los métodos con info
- `calculator.solve(method_name, params)` - Ejecuta un método genéricamente
- `calculator.info()` - Información general

### `utils.lua`

Funciones utilitarias compartidas.

**Constantes:**

- `utils.EPSILON` = 1e-10 (precisión por defecto)
- `utils.MAX_ITERATIONS` = 1000

**Funciones:**

- `utils.is_number(value)` - Valida tipo numérico
- `utils.abs(value)` - Valor absoluto
- `utils.round(value, decimals)` - Redondear
- `utils.derivative(f, x, h)` - Derivada numérica
- `utils.validate_params(f, a, b, tol)` - Validar parámetros
- `utils.sign_change(f, a, b)` - Detecta cambio de signo

---

## API Pública

### Métodos de Búsqueda de Raíces

#### `biseccion.solve(f, a, b, tolerance, max_iterations)`

**Retorna:** `(root, iterations, error_message)`

```lua
local f = function(x) return x^2 - 2 end
local root, iterations = calc.methods.biseccion.solve(f, 1, 2)
```

**Parámetros:**

- `f`: Función a evaluar
- `a`, `b`: Intervalo [a,b] donde f(a)·f(b) < 0
- `tolerance`: Error máximo deseado
- `max_iterations`: Límite de iteraciones

**Datos de iteración:**

```lua
iterations[i] = {
    iteration = número,
    a = límite inferior,
    b = límite superior,
    c = punto medio,
    fc = f(c),
    error = (b-a)/2
}
```

---

#### `newton_raphson.solve(f, f_prime, x0, tolerance, max_iterations)`

**Retorna:** `(root, iterations, error_message)`

```lua
local f = function(x) return x^2 - 2 end
local df = function(x) return 2*x end
local root = calc.methods.newton_raphson.solve(f, df, 1.5)
```

**Alternativa con derivada numérica:**

```lua
local root = calc.methods.newton_raphson.solve_auto(f, 1.5)
```

**Datos de iteración:**

```lua
iterations[i] = {
    iteration = número,
    x = aproximación actual,
    f_x = f(x),
    f_prime_x = f'(x),
    x_new = siguiente aproximación,
    error = |x_new - x|
}
```

---

#### `secante.solve(f, x0, x1, tolerance, max_iterations)`

**Retorna:** `(root, iterations, error_message)`

```lua
local root = calc.methods.secante.solve(f, 1, 2)
```

---

#### `punto_fijo.solve(g, x0, tolerance, max_iterations)`

**Retorna:** `(root, iterations, error_message)`

```lua
-- Ejemplo: x = cos(x)
local g = function(x) return math.cos(x) end
local root = calc.methods.punto_fijo.solve(g, 0.5)

-- Detectar si converge
local is_good, msg = calc.methods.punto_fijo.is_contractora(g, 0, 1)
```

---

### Métodos para Sistemas Lineales

#### `jacobi.solve(A, b, x0, tolerance, max_iterations)`

**Retorna:** `(solution_vector, iterations, error_message)`

```lua
local A = {{10, 1}, {1, 10}}
local b = {11, 11}
local x, iterations = calc.methods.jacobi.solve(A, b)
-- x[1] ≈ 1, x[2] ≈ 1
```

**Formato de datos:**

- `A`: Matriz NxN en formato tabla de tablas
- `b`: Vector Nx1 en formato tabla
- Retorna vector solución

---

### Métodos de Aproximación

#### `taylor.expand(f, x0, n_terms, eval_x)`

**Retorna:** Objeto con métodos

```lua
local exp = calc.methods.taylor.expand(math.sin, 0, 5)
local coeff = exp.coefficients
local value = exp.evaluate(1.0)
```

**Propiedades:**

```lua
expansion = {
    coefficients = {c0, c1, c2, ...},
    x0 = centro,
    n_terms = número de términos,
    evaluate = function(x) ... end,
    value_at_eval = (si eval_x fue proporcionado)
}
```

#### `taylor.get_coefficients(f, x0, n_terms)`

```lua
local coeff = calc.methods.taylor.get_coefficients(math.exp, 0, 10)
-- coeff[1] = f(0), coeff[2] = f'(0)/1!, ...
```

#### `maclaurin.expand(f, n_terms, eval_x)`

**Caso especial de Taylor en x0=0**

```lua
local exp = calc.methods.maclaurin.expand(math.exp, 15, 1)
print(exp.value_at_eval)  -- e ≈ 2.71828...
```

---

## Arquitectura

### Estructura de Directorios

```
lua/
├── calculator.lua       # Punto de entrada
├── utils.lua           # Utilidades compartidas
├── server.lua          # API REST (futuro)
├── methods/
│   ├── biseccion.lua
│   ├── newton_raphson.lua
│   ├── secante.lua
│   ├── punto_fijo.lua
│   ├── jacobi.lua
│   ├── taylor.lua
│   └── maclaurin.lua
└── tests/
    └── test_methods.lua
```

### Patrón de Módulo

Cada método sigue este patrón:

```lua
local method = {}

function method.solve(params...)
    -- Validar
    -- Iterar
    -- Retornar (solución, historial_iteraciones, opcional_error)
end

function method.info()
    return {
        name = "...",
        description = "...",
        pros = {...},
        cons = {...}
    }
end

return method
```

---

## Extensibilidad

### Agregar Nuevo Método

1. **Crear archivo** en `methods/new_method.lua`
2. **Implementar `solve()`** y **`info()`**
3. **Agregar a `calculator.lua`**:

```lua
new_method = require("methods.new_method"),
```

4. **Agregar pruebas** en `tests/test_methods.lua`

### Ejemplo: Método de Bisección Mejorado

```lua
-- Crear: lua/methods/biseccion_adaptativa.lua

local utils = require("utils")
local biseccion = {}

function biseccion.solve_adaptive(f, a, b)
    -- Lógica adaptativa aquí
    local root, iterations = calc.methods.biseccion.solve(f, a, b)

    -- Mejoras post-procesamiento
    return root, iterations
end

return biseccion
```

---

## Optimización

### Mejoras Recomendadas

1. **Paralelización**: Jacobi es idealizado para GPU
2. **Caching**: Guardar resultados recientes
3. **Precisión Adaptativa**: Ajustar tolerancia dinámicamente
4. **Compilación**: Usar LuaJIT para ~50x velocidad

### Perfilado de Rendimiento

```lua
local before = os.clock()
calc.methods.newton_raphson.solve(f, df, 1.5)
local elapsed = os.clock() - before
print("Tiempo: " .. elapsed .. "s")
```

---

## Próximas Implementaciones

- [ ] Método de Gauss-Seidel
- [ ] Descomposición LU
- [ ] Interpolación
- [ ] Integración numérica
- [ ] Ecuaciones diferenciales
- [ ] Optimización multidimensional

---

**Última actualización:** 23 de abril de 2026
**Versión:** 1.0.0
