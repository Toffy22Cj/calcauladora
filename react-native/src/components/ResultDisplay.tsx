import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { CalculationResult, IterationData } from '../types';

interface ResultDisplayProps {
  result: CalculationResult;
  methodKey: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, methodKey }) => {
  const [showIterations, setShowIterations] = React.useState(false);

  const formatNumber = (num: number | number[] | undefined): string => {
    if (num === undefined) return 'N/A';
    if (Array.isArray(num)) return formatVector(num);
    return num.toExponential(6);
  };

  const formatVector = (vec: number | number[] | undefined): string => {
    if (vec === undefined) return 'N/A';
    if (typeof vec === 'number') return vec.toFixed(6);
    return `[${vec.map(x => x.toFixed(6)).join(', ')}]`;
  };

  const renderResult = () => {
    if (!result.success) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>❌ Error en el cálculo</Text>
          <Text style={styles.errorMessage}>{result.error_message}</Text>
        </View>
      );
    }

    switch (methodKey) {
      case 'biseccion':
      case 'newton_raphson':
      case 'secante':
      case 'punto_fijo':
        return (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>✅ Raíz encontrada</Text>
            <Text style={styles.resultValue}>
              x = {formatNumber(result.root)}
            </Text>
            <Text style={styles.resultInfo}>
              Iteraciones: {result.iterations.length}
            </Text>
            <Text style={styles.resultInfo}>
              Error final: {formatNumber(result.iterations[result.iterations.length - 1]?.error)}
            </Text>
          </View>
        );

      case 'jacobi':
        return (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>✅ Solución encontrada</Text>
            <Text style={styles.resultValue}>
              x = {formatVector(result.solution)}
            </Text>
            <Text style={styles.resultInfo}>
              Iteraciones: {result.iterations.length}
            </Text>
            <Text style={styles.resultInfo}>
              Error final: {formatNumber(result.iterations[result.iterations.length - 1]?.error)}
            </Text>
          </View>
        );

      case 'taylor':
      case 'maclaurin':
        return (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>✅ Serie expandida</Text>
            {result.coefficients && (
              <View style={styles.coefficientsContainer}>
                <Text style={styles.coefficientsTitle}>Coeficientes:</Text>
                {result.coefficients.map((coeff: number, i: number) => (
                  <Text key={i} style={styles.coefficient}>
                    a{i} = {formatNumber(coeff)}
                  </Text>
                ))}
              </View>
            )}
            {result.value_at_eval !== undefined && (
              <Text style={styles.resultValue}>
                f({result.x0 || 0}) ≈ {formatNumber(result.value_at_eval)}
              </Text>
            )}
            <Text style={styles.resultInfo}>
              Términos: {result.n_terms}
            </Text>
          </View>
        );

      default:
        return (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>✅ Cálculo completado</Text>
            <Text style={styles.resultInfo}>
              Iteraciones: {result.iterations.length}
            </Text>
          </View>
        );
    }
  };

  const renderIterationTable = () => {
    if (!result.iterations || result.iterations.length === 0) return null;

    const getHeaders = () => {
      switch (methodKey) {
        case 'biseccion':
          return ['Iter', 'a', 'b', 'c', 'f(c)', 'Error'];
        case 'newton_raphson':
          return ['Iter', 'x', 'f(x)', 'f\'(x)', 'x₊₁', 'Error'];
        case 'secante':
          return ['Iter', 'x₋₁', 'x', 'f(x)', 'x₊₁', 'Error'];
        case 'punto_fijo':
          return ['Iter', 'x', 'g(x)', 'Error'];
        case 'jacobi':
          return ['Iter', 'x', 'Error'];
        default:
          return ['Iter', 'Valor', 'Error'];
      }
    };

    const headers = getHeaders();

    return (
      <View style={styles.tableContainer}>
        <Text style={styles.tableTitle}>📊 Tabla de Iteraciones</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            {/* Header */}
            <View style={styles.tableRow}>
              {headers.map((header, i) => (
                <Text key={i} style={[styles.tableCell, styles.tableHeader]}>
                  {header}
                </Text>
              ))}
            </View>

            {/* Data rows */}
            {result.iterations.slice(0, 20).map((iteration: IterationData, i: number) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.tableCell}>{iteration.iteration}</Text>
                {methodKey === 'biseccion' && (
                  <>
                    <Text style={styles.tableCell}>{formatNumber(iteration.a)}</Text>
                    <Text style={styles.tableCell}>{formatNumber(iteration.b)}</Text>
                    <Text style={styles.tableCell}>{formatNumber(iteration.c)}</Text>
                    <Text style={styles.tableCell}>{formatNumber(iteration.fc)}</Text>
                    <Text style={styles.tableCell}>{formatNumber(iteration.error)}</Text>
                  </>
                )}
                {methodKey === 'newton_raphson' && (
                  <>
                    <Text style={styles.tableCell}>{formatNumber(iteration.x)}</Text>
                    <Text style={styles.tableCell}>{formatNumber(iteration.f_x)}</Text>
                    <Text style={styles.tableCell}>{formatNumber(iteration.f_prime_x)}</Text>
                    <Text style={styles.tableCell}>{formatNumber(iteration.x_new)}</Text>
                    <Text style={styles.tableCell}>{formatNumber(iteration.error)}</Text>
                  </>
                )}
                {methodKey === 'secante' && (
                  <>
                    <Text style={styles.tableCell}>{formatNumber(iteration.x_minus_1)}</Text>
                    <Text style={styles.tableCell}>{formatNumber(iteration.x)}</Text>
                    <Text style={styles.tableCell}>{formatNumber(iteration.f_x)}</Text>
                    <Text style={styles.tableCell}>{formatNumber(iteration.x_new)}</Text>
                    <Text style={styles.tableCell}>{formatNumber(iteration.error)}</Text>
                  </>
                )}
                {methodKey === 'punto_fijo' && (
                  <>
                    <Text style={styles.tableCell}>{formatNumber(iteration.x)}</Text>
                    <Text style={styles.tableCell}>{formatNumber(iteration.g_x)}</Text>
                    <Text style={styles.tableCell}>{formatNumber(iteration.error)}</Text>
                  </>
                )}
                {methodKey === 'jacobi' && (
                  <>
                    <Text style={styles.tableCell}>{formatVector(iteration.x)}</Text>
                    <Text style={styles.tableCell}>{formatNumber(iteration.error)}</Text>
                  </>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
        {result.iterations.length > 20 && (
          <Text style={styles.tableNote}>
            Mostrando primeras 20 iteraciones de {result.iterations.length} totales
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderResult()}

      {result.iterations && result.iterations.length > 0 && (
        <View style={styles.iterationsSection}>
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setShowIterations(!showIterations)}
          >
            <Text style={styles.toggleButtonText}>
              {showIterations ? '🔽 Ocultar' : '🔼 Mostrar'} Iteraciones
            </Text>
          </TouchableOpacity>

          {showIterations && renderIterationTable()}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resultContainer: {
    padding: 20,
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 10,
  },
  resultValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
    textAlign: 'center',
  },
  resultInfo: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 5,
  },
  coefficientsContainer: {
    alignSelf: 'stretch',
    marginTop: 10,
  },
  coefficientsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  coefficient: {
    fontSize: 14,
    color: '#4b5563',
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 14,
    color: '#dc2626',
    textAlign: 'center',
  },
  iterationsSection: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  toggleButton: {
    padding: 15,
    alignItems: 'center',
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  tableContainer: {
    padding: 15,
  },
  tableTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 8,
  },
  tableCell: {
    minWidth: 80,
    fontSize: 12,
    color: '#4b5563',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  tableHeader: {
    fontWeight: 'bold',
    color: '#1f2937',
    backgroundColor: '#f9fafb',
    paddingVertical: 10,
  },
  tableNote: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
});

export default ResultDisplay;