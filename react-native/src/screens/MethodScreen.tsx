import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, MethodInfo, MethodParams, CalculationResult } from '../types';
import { CalculatorApi, calculatorUtils } from '../api/calculator';
import { methods } from '../utils/methods';
import InputForm from '../components/InputForm';
import ResultDisplay from '../components/ResultDisplay';

type MethodScreenRouteProp = RouteProp<RootStackParamList, 'Method'>;
type MethodScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface MethodScreenProps {}

const MethodScreen: React.FC<MethodScreenProps> = () => {
  const route = useRoute<MethodScreenRouteProp>();
  const navigation = useNavigation<MethodScreenNavigationProp>();

  const methodInfo = route.params?.method;
  const methodKey = route.params?.methodKey || 
    (methodInfo ? Object.keys(methods).find(key => methods[key].name === methodInfo.name) || '' : '');
  const [params, setParams] = useState<MethodParams>({});
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSolve = async () => {
    if (!methodKey) return;
    setErrorMsg(null);

    // Validar parámetros
    const validation = calculatorUtils.validateParams(methodKey, params);
    if (!validation.valid) {
      setErrorMsg(validation.error || 'Parámetros inválidos');
      return;
    }

    setLoading(true);
    try {
      const response = await CalculatorApi.solve(methodKey, params);
      if (response.success && response.data) {
        setResult(response.data);
      } else {
        setErrorMsg(response.error || 'Error en el cálculo (verifica la sintaxis de la ecuación)');
      }
    } catch (error) {
      console.error('Error solving:', error);
      setErrorMsg('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setParams({});
    setResult(null);
    setErrorMsg(null);
  };

  const getMethodExamples = (method: string): MethodParams => {
    switch (method) {
      case 'biseccion':
        return {
          f: 'x^2 - 2',
          a: 1,
          b: 2,
          tolerance: 1e-10,
        };
      case 'newton_raphson':
        return {
          f: 'x^2 - 2',
          f_prime: '2*x',
          x0: 1.5,
          tolerance: 1e-15,
        };
      case 'secante':
        return {
          f: 'x^3 - 2',
          x0: 1,
          x1: 2,
          tolerance: 1e-10,
        };
      case 'punto_fijo':
        return {
          g: 'math.cos(x)',
          x0: 0.5,
          tolerance: 1e-10,
        };
      case 'jacobi':
        return {
          A: [[4, -1], [4, -8]],
          vector_b: [7, -21],
          tolerance: 1e-10,
        };
      case 'taylor':
        return {
          f: 'math.sin(x)',
          x0: 0,
          n_terms: 5,
          eval_x: 1.57, // π/2
        };
      case 'maclaurin':
        return {
          f: 'math.exp(x)',
          n_terms: 10,
          eval_x: 1,
        };
      default:
        return {};
    }
  };

  const loadExample = () => {
    if (methodKey) {
      const example = getMethodExamples(methodKey);
      setParams(example);
      setResult(null);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{methodInfo?.name || 'Método'}</Text>
        {methodInfo?.description && (
          <Text style={styles.description}>{methodInfo.description}</Text>
        )}
      </View>

      <View style={styles.content}>
        <InputForm
          methodKey={methodKey || ''}
          methodInfo={methodInfo}
          params={params}
          onParamsChange={setParams}
          onLoadExample={loadExample}
          onClear={handleClear}
        />

        {errorMsg && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.solveButton, loading && styles.disabledButton]}
            onPress={handleSolve}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Resolver</Text>
            )}
          </TouchableOpacity>
        </View>

        {result && (
          <ResultDisplay
            result={result}
            methodKey={methodKey || ''}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#2563eb',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#e0e7ff',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  content: {
    padding: 20,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  solveButton: {
    backgroundColor: '#10b981',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 8,
    padding: 12,
    marginVertical: 12,
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default MethodScreen;