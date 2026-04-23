import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
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

  const renderGraph = () => {
    if (!result.iterations || result.iterations.length < 2) return null;

    // Filter to at most 15 points
    const maxPoints = 15;
    const step = Math.ceil(result.iterations.length / maxPoints);
    const dataPoints = result.iterations.filter((_, i) => i % step === 0 || i === result.iterations.length - 1);

    const labels = dataPoints.map(it => it.iteration.toString());
    
    let data: number[] = [];
    let legend: string[] = [];
    
    if (methodKey === 'biseccion' || methodKey === 'newton_raphson' || methodKey === 'secante' || methodKey === 'punto_fijo') {
      data = dataPoints.map(it => {
         const val = methodKey === 'biseccion' ? it.c : it.x;
         return typeof val === 'number' ? val : 0;
      });
      legend = ['Aproximación de Raíz (x)'];
    } else if (methodKey === 'jacobi') {
       data = dataPoints.map(it => typeof it.error === 'number' ? it.error : 0);
       legend = ['Error'];
    } else {
       return null;
    }

    if (data.length === 0 || data.some(isNaN)) return null;

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.tableTitle}>📈 Gráfica de Convergencia</Text>
        <LineChart
          data={{
            labels: labels,
            datasets: [{ data }],
            legend: legend
          }}
          width={Dimensions.get('window').width - 70}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          yAxisInterval={1}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 4,
            color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(75, 85, 99, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: '#2563eb'
            }
          }}
          bezier
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
      </View>
    );
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
          return ['Iter', 'a', 'b', 'c', 'f(c)', 'Error', 'Paso a paso'];
        case 'newton_raphson':
          return ['Iter', 'x', 'f(x)', "f'(x)", 'x₊₁', 'Error', 'Paso a paso'];
        case 'secante':
          return ['Iter', 'x₋₁', 'x', 'f(x)', 'x₊₁', 'Error', 'Paso a paso'];
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
                    <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>{formatNumber(iteration.c)}</Text>
                    <Text style={[
                      styles.tableCell,
                      (iteration.fc || 0) > 0 ? { color: '#dc2626', backgroundColor: '#fee2e2' } : { color: '#2563eb', backgroundColor: '#dbeafe' }
                    ]}>
                      {formatNumber(iteration.fc)}
                    </Text>
                    <Text style={styles.tableCell}>{formatNumber(iteration.error)}</Text>
                    <Text style={[styles.tableCell, styles.detailsCell]}>{iteration.details}</Text>
                  </>
                )}
                {methodKey === 'newton_raphson' && (
                  <>
                    <Text style={styles.tableCell}>{formatNumber(iteration.x)}</Text>
                    <Text style={styles.tableCell}>{formatNumber(iteration.f_x)}</Text>
                    <Text style={styles.tableCell}>{formatNumber(iteration.f_prime_x)}</Text>
                    <Text style={styles.tableCell}>{formatNumber(iteration.x_new)}</Text>
                    <Text style={styles.tableCell}>{formatNumber(iteration.error)}</Text>
                    <Text style={[styles.tableCell, styles.detailsCell]}>{iteration.details}</Text>
                  </>
                )}
                {methodKey === 'secante' && (
                  <>
                    <Text style={styles.tableCell}>{formatNumber(iteration.x_minus_1)}</Text>
                    <Text style={styles.tableCell}>{formatNumber(iteration.x)}</Text>
                    <Text style={styles.tableCell}>{formatNumber(iteration.f_x)}</Text>
                    <Text style={styles.tableCell}>{formatNumber(iteration.x_new)}</Text>
                    <Text style={styles.tableCell}>{formatNumber(iteration.error)}</Text>
                    <Text style={[styles.tableCell, styles.detailsCell]}>{iteration.details}</Text>
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

      {renderGraph()}

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
  chartContainer: {
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
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
    paddingHorizontal: 8,
  },
  detailsCell: {
    minWidth: 350,
    textAlign: 'left',
    fontStyle: 'italic',
    fontFamily: 'sans-serif',
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