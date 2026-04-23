import axios from 'axios';
import { MethodInfo, CalculationResult, MethodParams, ApiResponse } from '../types';

// Configuración del cliente HTTP
const API_BASE_URL = 'http://localhost:8080'; // Cambiar cuando tengas el servidor corriendo

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cliente de la API de calculadora
export class CalculatorApi {
  // Obtener lista de métodos disponibles
  static async getMethods(): Promise<ApiResponse<Record<string, MethodInfo>>> {
    try {
      const response = await api.get('/api/methods');
      return response.data;
    } catch (error) {
      console.error('Error fetching methods:', error);
      return {
        success: false,
        error: 'No se pudo conectar con el servidor',
      };
    }
  }

  // Obtener información de la calculadora
  static async getInfo(): Promise<ApiResponse<any>> {
    try {
      const response = await api.get('/api/info');
      return response.data;
    } catch (error) {
      console.error('Error fetching info:', error);
      return {
        success: false,
        error: 'No se pudo conectar con el servidor',
      };
    }
  }

  // Resolver usando bisección
  static async solveBiseccion(params: {
    f: string;
    a: number;
    b: number;
    tolerance?: number;
    max_iterations?: number;
  }): Promise<ApiResponse<CalculationResult>> {
    try {
      const response = await api.post('/api/solve/biseccion', params);
      return response.data;
    } catch (error) {
      console.error('Error solving biseccion:', error);
      return {
        success: false,
        error: 'Error en el cálculo',
      };
    }
  }

  // Método genérico para resolver cualquier método
  static async solve(method: string, params: MethodParams): Promise<ApiResponse<CalculationResult>> {
    try {
      const response = await api.post(`/api/solve/${method}`, params);
      return response.data;
    } catch (error) {
      console.error(`Error solving ${method}:`, error);
      return {
        success: false,
        error: 'Error en el cálculo',
      };
    }
  }

  // Health check
  static async healthCheck(): Promise<boolean> {
    try {
      const response = await api.get('/health');
      return response.data.status === 'ok';
    } catch (error) {
      return false;
    }
  }
}

// Funciones de utilidad para el cliente
export const calculatorUtils = {
  // Convertir función de string a expresión (para validación local)
  parseFunction: (funcStr: string): ((x: number) => number) | null => {
    try {
      // Crear función segura (solo para validación)
      return new Function('x', `return ${funcStr};`) as (x: number) => number;
    } catch (error) {
      console.error('Error parsing function:', error);
      return null;
    }
  },

  // Validar parámetros básicos
  validateParams: (method: string, params: MethodParams): { valid: boolean; error?: string } => {
    switch (method) {
      case 'biseccion':
        if (!params.f) {
          return { valid: false, error: 'Se requiere la ecuación f' };
        }
        if (params.a !== undefined && params.b !== undefined && params.a >= params.b) {
          return { valid: false, error: 'a debe ser menor que b' };
        }
        break;

      case 'newton_raphson':
        if (!params.f || !params.f_prime) {
          return { valid: false, error: 'Se requieren las ecuaciones f y f\'' };
        }
        break;

      case 'secante':
        if (!params.f) {
          return { valid: false, error: 'Se requiere la ecuación f' };
        }
        break;

      case 'punto_fijo':
        if (!params.g) {
          return { valid: false, error: 'Se requiere la ecuación g' };
        }
        break;

      case 'jacobi':
        if (params.parserError) {
          return { valid: false, error: params.parserError };
        }
        if (!params.A || !params.b || params.A.length === 0) {
          return { valid: false, error: 'Por favor, ingresa el sistema de ecuaciones' };
        }
        break;
    }

    return { valid: true };
  },
};