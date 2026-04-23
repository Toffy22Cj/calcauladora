import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, MethodInfo } from '../types';
import { CalculatorApi } from '../api/calculator';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [methods, setMethods] = useState<Record<string, MethodInfo>>({});
  const [loading, setLoading] = useState(true);
  const [serverOnline, setServerOnline] = useState(false);

  useEffect(() => {
    loadMethods();
    checkServerStatus();
  }, []);

  const loadMethods = async () => {
    try {
      const response = await CalculatorApi.getMethods();
      if (response.success && response.data) {
        setMethods(response.data);
      } else {
        // Si no hay servidor, usar métodos locales
        setMethods(getLocalMethods());
      }
    } catch (error) {
      console.error('Error loading methods:', error);
      setMethods(getLocalMethods());
    } finally {
      setLoading(false);
    }
  };

  const checkServerStatus = async () => {
    const online = await CalculatorApi.healthCheck();
    setServerOnline(online);
  };

  const getLocalMethods = (): Record<string, MethodInfo> => {
    return {
      biseccion: {
        name: 'Bisección',
        description: 'Divide el intervalo por la mitad repetidamente para encontrar la raíz',
        parameters: {
          f: 'Función a evaluar',
          a: 'Límite inferior del intervalo',
          b: 'Límite superior del intervalo',
        },
        convergence: 'Lineal (lenta pero garantizada)',
        pros: ['Siempre converge si la raíz está en [a,b]', 'No requiere derivadas'],
        cons: ['Convergencia lenta', 'Requiere cambio de signo'],
      },
      newton_raphson: {
        name: 'Newton-Raphson',
        description: 'Método iterativo que usa la derivada para converger a la raíz',
        parameters: {
          f: 'Función a evaluar',
          f_prime: 'Derivada de la función',
          x0: 'Aproximación inicial',
        },
        convergence: 'Cuadrática (muy rápida)',
        pros: ['Muy rápido cuando funciona', 'Convergencia cuadrática'],
        cons: ['Requiere derivada', 'No siempre converge'],
      },
      secante: {
        name: 'Método de la Secante',
        description: 'Aproxima la derivada usando dos puntos anteriores',
        parameters: {
          f: 'Función a evaluar',
          x0: 'Primera aproximación',
          x1: 'Segunda aproximación',
        },
        convergence: 'Superlineal (1.618 aprox)',
        pros: ['No requiere derivada analítica', 'Converge rápido'],
        cons: ['Necesita dos aproximaciones iniciales'],
      },
      punto_fijo: {
        name: 'Punto Fijo',
        description: 'Encuentra x donde x = g(x) iterando x_{n+1} = g(x_n)',
        parameters: {
          g: 'Función de iteración',
          x0: 'Aproximación inicial',
        },
        convergence: 'Lineal',
        pros: ['Simple de implementar', 'Flexible'],
        cons: ['Convergencia lenta', 'Requiere que g sea contractora'],
      },
      jacobi: {
        name: 'Método de Jacobi',
        description: 'Resuelve sistemas lineales Ax=b de forma iterativa',
        parameters: {
          A: 'Matriz de coeficientes',
          b: 'Vector de términos independientes',
        },
        convergence: 'Lineal (lenta)',
        pros: ['Paralelizable', 'Sin requerir factorización'],
        cons: ['Convergencia lenta', 'No siempre converge'],
      },
      taylor: {
        name: 'Serie de Taylor',
        description: 'Aproxima una función como serie de potencias alrededor de x0',
        parameters: {
          f: 'Función a expandir',
          x0: 'Centro de expansión',
          n_terms: 'Número de términos',
        },
        pros: ['Muy versátil', 'Base teórica fuerte'],
        cons: ['Radio de convergencia limitado'],
      },
      maclaurin: {
        name: 'Serie de Maclaurin',
        description: 'Caso especial de la serie de Taylor centrada en x = 0',
        parameters: {
          f: 'Función a expandir',
          n_terms: 'Número de términos',
        },
        common_series: ['e^x, sin(x), cos(x), ln(1+x)'],
        pros: ['Simplifica cálculos', 'Muchas series conocidas'],
        cons: ['Radio de convergencia limitado'],
      },
    };
  };

  const handleMethodPress = (methodKey: string, methodInfo: MethodInfo) => {
    navigation.navigate('Method', {
      method: methodInfo,
      methodKey: methodKey,
    });
  };

  const renderMethodItem = ({ item }: { item: [string, MethodInfo] }) => {
    const [key, method] = item;
    return (
      <TouchableOpacity
        style={styles.methodCard}
        onPress={() => handleMethodPress(key, method)}
      >
        <View style={styles.methodHeader}>
          <Text style={styles.methodName}>{method.name}</Text>
          <Text style={styles.methodType}>
            {method.convergence ? `(${method.convergence.split(' ')[0]})` : ''}
          </Text>
        </View>
        <Text style={styles.methodDescription}>{method.description}</Text>
        <View style={styles.methodTags}>
          {method.pros && method.pros.length > 0 && (
            <Text style={styles.proTag}>✓ {method.pros[0]}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Cargando métodos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🧮 Super Calculadora</Text>
        <Text style={styles.subtitle}>Métodos Numéricos</Text>
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, serverOnline ? styles.online : styles.offline]}>
            {serverOnline ? '🟢 Servidor Online' : '🔴 Modo Local'}
          </Text>
        </View>
      </View>

      <FlatList
        data={Object.entries(methods)}
        renderItem={renderMethodItem}
        keyExtractor={([key]) => key}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#2563eb',
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e7ff',
    textAlign: 'center',
    marginTop: 5,
  },
  statusContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  online: {
    backgroundColor: '#10b981',
    color: '#fff',
  },
  offline: {
    backgroundColor: '#f59e0b',
    color: '#fff',
  },
  listContainer: {
    padding: 20,
  },
  methodCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  methodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  methodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  methodType: {
    fontSize: 12,
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  methodDescription: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 8,
  },
  methodTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  proTag: {
    fontSize: 12,
    color: '#10b981',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 4,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6b7280',
  },
});

export default HomeScreen;