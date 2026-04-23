# Super Calculadora Numérica - Lua + React Native

Calculadora científica avanzada con métodos numéricos profesionales para encontrar raíces, resolver sistemas y aproximar funciones.

## 🎯 Métodos Implementados

### Búsqueda de Raíces (f(x) = 0)

| Método             | Velocidad  | Precisión | Requisitos           |
| ------------------ | ---------- | --------- | -------------------- |
| **Bisección**      | Lenta      | Alta      | f(a)·f(b) < 0        |
| **Newton-Raphson** | Muy Rápida | Muy Alta  | f'(x) disponible     |
| **Secante**        | Rápida     | Alta      | Dos aprox. iniciales |
| **Punto Fijo**     | Lenta      | Media     | x = g(x) contractora |

### Sistemas Lineales (Ax = b)

- **Jacobi**: Iterativo, paralelizable, lento pero estable

### Aproximación de Funciones

- **Taylor**: Series de potencias alrededor de x₀
- **Maclaurin**: Caso especial (x₀ = 0) con series precomputadas

---

## 📁 Estructura del Proyecto

```
LUACALCULADORA/
├── lua/
│   ├── calculator.lua          # Punto de entrada
│   ├── server.lua              # API REST
│   ├── utils.lua               # Funciones compartidas
│   ├── methods/
│   │   ├── biseccion.lua
│   │   ├── newton_raphson.lua
│   │   ├── secante.lua
│   │   ├── punto_fijo.lua
│   │   ├── jacobi.lua
│   │   ├── taylor.lua
│   │   └── maclaurin.lua
│   └── tests/
│       └── test_methods.lua    # Pruebas unitarias
├── react-native/
│   ├── App.tsx
│   ├── components/
│   ├── screens/
│   └── api/
└── README.md
```

---

## 🚀 Cómo Usar

### Desde Lua Directamente

```lua
local calc = require("calculator")

-- Usar bisección
local f = function(x) return x^2 - 2 end
local root, iterations = calc.methods.biseccion.solve(f, 1, 2, 1e-10)

print("Raíz encontrada:", root)
print("Iteraciones:", #iterations)
```

### Desde la API REST

```bash
# Encontrar raíz con Newton-Raphson
curl -X POST http://localhost:8080/solve \
  -H "Content-Type: application/json" \
  -d '{
    "method": "newton_raphson",
    "f": "x^2 - 2",
    "f_prime": "2*x",
    "x0": 1.5
  }'
```

---

## 💡 Consejos de Uso

1. **Bisección**: Usa cuando necesites garantía de convergencia
2. **Newton-Raphson**: Perfecto para raíces simples, muy rápido
3. **Secante**: Si no tienes derivada analítica
4. **Punto Fijo**: Flexible, útil después de transformar f(x)=0
5. **Jacobi**: Para sistemas grandes y paralelos
6. **Taylor/Maclaurin**: Aproxima funciones complicadas

---

## 🔧 Desarrollo

### Instalar Dependencias

```bash
# Lua (ya instalado en Linux)
lua -v

# Luarocks (para paquetes Lua)
sudo apt-get install luarocks

# Servidor HTTP
luarocks install lpeg
```

### Ejecutar Pruebas

```bash
cd lua/tests
lua test_methods.lua
```

### Iniciar Servidor

```bash
cd lua
lua server.lua
```

---

## 📱 React Native

Frontend multiplataforma con:

- Interfaz intuitiva para cada método
- Gráficos de convergencia
- Historial de cálculos
- Modo oscuro/claro

```bash
cd react-native
npm install
npm run dev      # Web
npm run android  # Android
npm run ios      # iOS
```

---

## 📊 Próximas Mejoras

- [ ] Método de Newton multidimensional
- [ ] Métodos de minimización
- [ ] Integración numérica
- [ ] Ecuaciones diferenciales
- [ ] Exportar resultados (PDF, CSV)
- [ ] Gráficas interactivas
- [ ] Documentación con LaTeX

---

## 📝 Licencia

MIT - Uso libre con reconocimiento

---

**Hecho con ❤️ en Lua + React Native**
