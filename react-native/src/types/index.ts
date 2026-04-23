// Tipos para la calculadora numérica

export interface MethodInfo {
  name: string;
  description: string;
  parameters: Record<string, string>;
  convergence?: string;
  pros?: string[];
  cons?: string[];
  requirements?: string;
  formula?: string;
  common_series?: string[];
  note?: string;
}

export interface IterationData {
  iteration: number;
  x?: number | number[]; // Para métodos escalares o vectoriales (Jacobi)
  a?: number;
  b?: number;
  c?: number;
  fc?: number;
  f_x?: number;
  f_prime_x?: number;
  x_new?: number;
  x_minus_1?: number;
  g_x?: number;
  error: number;
}

export interface CalculationResult {
  success: boolean;
  method: string;
  root?: number;
  solution?: number[];
  iterations: IterationData[];
  error_message?: string;
  coefficients?: number[];
  x0?: number;
  n_terms?: number;
  evaluate?: (x: number) => number;
  value_at_eval?: number;
}

export interface MethodParams {
  f?: string; // Función como string
  a?: number;
  b?: number;
  x0?: number;
  x1?: number;
  g?: string; // Función de iteración
  f_prime?: string; // Derivada
  A?: number[][]; // Matriz para sistemas
  vector_b?: number[]; // Vector para sistemas (unused but kept for compatibility)
  b?: number[]; // Vector b for systems
  equationsText?: string;
  parserError?: string;
  tolerance?: number;
  max_iterations?: number;
  n_terms?: number;
  eval_x?: number;
}

export interface HistoryItem {
  id: string;
  timestamp: Date;
  method: string;
  params: MethodParams;
  result: CalculationResult;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Navigation Types
export type RootStackParamList = {
  Home: undefined;
  Method: { method: MethodInfo; methodKey: string };
  History: undefined;
  Settings: undefined;
};