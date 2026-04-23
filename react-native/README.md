# Super Calculadora - React Native App

Aplicación móvil multiplataforma para la Super Calculadora Numérica.

## 🚀 Inicio Rápido

### Instalación

```bash
cd react-native
npm install
```

### Ejecutar

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 📱 Características

### 🎯 Métodos Disponibles

- **Bisección**: Encuentra raíces con cambio de signo
- **Newton-Raphson**: Método cuadrático más rápido
- **Secante**: Sin derivada analítica
- **Punto Fijo**: Iteración funcional
- **Jacobi**: Sistemas lineales iterativos
- **Taylor**: Series de potencias
- **Maclaurin**: Series centradas en cero

### 🎨 Interfaz

- **Navegación por pestañas**: Métodos, Historial, Configuración
- **Formularios dinámicos**: Campos específicos por método
- **Resultados detallados**: Valores y tabla de iteraciones
- **Configuración**: Tema, precisión, límites

### 🔧 Funcionalidades

- **Validación en tiempo real**: Parámetros requeridos
- **Ejemplos precargados**: Un toque para cargar datos de ejemplo
- **Historial**: Guardado automático de cálculos
- **Configuración persistente**: Preferencias guardadas

## 🏗️ Arquitectura

```
src/
├── screens/           # Pantallas principales
│   ├── HomeScreen.tsx     # Lista de métodos
│   ├── MethodScreen.tsx   # Configuración y ejecución
│   ├── HistoryScreen.tsx  # Historial de cálculos
│   └── SettingsScreen.tsx # Configuración
├── components/        # Componentes reutilizables
│   ├── InputForm.tsx      # Formulario de parámetros
│   └── ResultDisplay.tsx  # Visualización de resultados
├── api/               # Cliente HTTP
│   └── calculator.ts      # API para servidor Lua
├── types/             # Definiciones TypeScript
│   └── index.ts           # Interfaces y tipos
└── utils/             # Utilidades
```

## 🔌 API Integration

La app se conecta con el servidor Lua en `http://localhost:8080`:

```typescript
import { CalculatorApi } from "./api/calculator";

// Resolver bisección
const result = await CalculatorApi.solveBiseccion({
  f: "x^2 - 2",
  a: 1,
  b: 2,
  tolerance: 1e-10,
});
```

### Modo Offline

Si el servidor no está disponible, la app funciona en modo local con métodos básicos.

## 📊 Estados de la App

### HomeScreen

- Lista todos los métodos disponibles
- Indicador de estado del servidor
- Navegación a configuración de método

### MethodScreen

- Formulario dinámico según método
- Validación de parámetros
- Ejecución y visualización de resultados
- Tabla de iteraciones expandible

### HistoryScreen

- Lista de cálculos anteriores
- Detalles de parámetros y resultados
- Funcionalidad de exportar (futuro)

### SettingsScreen

- Configuración de interfaz
- Parámetros numéricos por defecto
- Información de la app

## 🎨 Diseño

### Tema

- **Colores principales**: Azul (#2563eb)
- **Éxito**: Verde (#10b981)
- **Error**: Rojo (#dc2626)
- **Fondo**: Gris claro (#f8fafc)

### Componentes

- **Cards**: Bordes redondeados con sombra
- **Botones**: Estados pressed y disabled
- **Formularios**: Labels claros y placeholders
- **Tablas**: Scroll horizontal para datos numéricos

## 🔧 Desarrollo

### Dependencias Principales

- **React Navigation**: Navegación por pestañas y stack
- **Axios**: Cliente HTTP para API
- **Expo**: Plataforma de desarrollo
- **TypeScript**: Tipado fuerte

### Scripts Disponibles

```json
{
  "start": "expo start",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web"
}
```

## 🚀 Próximas Funcionalidades

- [ ] Gráficas de convergencia con react-native-chart-kit
- [ ] Exportar resultados (PDF, CSV)
- [ ] Modo oscuro completo
- [ ] Animaciones de carga
- [ ] Persistencia de historial
- [ ] Compartir cálculos
- [ ] Modo offline avanzado

## 📱 Plataformas Soportadas

- ✅ **iOS**: iPhone y iPad
- ✅ **Android**: Teléfonos y tablets
- ✅ **Web**: Navegadores modernos
- ✅ **Windows**: Desktop (futuro)
- ✅ **macOS**: Desktop (futuro)

## 🔗 Conexión con Backend

Para desarrollo completo:

1. **Iniciar servidor Lua**:

   ```bash
   cd lua
   lua server.lua
   ```

2. **Actualizar API_BASE_URL** en `api/calculator.ts`

3. **Probar conexión** desde la app

---

**¡La app está lista para usar!** 🎉

Para desarrollo avanzado, consulta la documentación del backend Lua y la API de Expo.
