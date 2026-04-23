import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MethodInfo, MethodParams } from '../types';
import { parseLinearEquations } from '../utils/equationParser';

interface InputFormProps {
  methodKey: string;
  methodInfo?: MethodInfo;
  params: MethodParams;
  onParamsChange: (params: MethodParams) => void;
  onLoadExample: () => void;
  onClear: () => void;
}

const InputForm: React.FC<InputFormProps> = ({
  methodKey,
  methodInfo,
  params,
  onParamsChange,
  onLoadExample,
  onClear,
}) => {
  const updateParam = (key: keyof MethodParams, value: any) => {
    onParamsChange({
      ...params,
      [key]: value,
    });
  };

  const renderInput = (
    key: keyof MethodParams,
    label: string,
    placeholder: string,
    keyboardType: 'default' | 'numeric' = 'default',
    multiline: boolean = false
  ) => {
    const value = params[key];
    const displayValue = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value || '');

    return (
      <View key={String(key)} style={styles.inputGroup}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={[styles.input, multiline && styles.multilineInput]}
          placeholder={placeholder}
          value={displayValue}
          onChangeText={(text) => {
            if (keyboardType === 'numeric') {
              const numValue = parseFloat(text);
              updateParam(key, isNaN(numValue) ? undefined : numValue);
            } else if (key === 'A' || key === 'b') {
              try {
                const parsed = JSON.parse(text);
                updateParam(key, parsed);
              } catch {
                updateParam(key, text);
              }
            } else {
              updateParam(key, text);
            }
          }}
          keyboardType={keyboardType === 'numeric' ? 'numeric' : 'default'}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          placeholderTextColor="#9ca3af"
        />
      </View>
    );
  };

  const renderJacobiInput = () => {
    return (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Sistema de Ecuaciones (una por línea)</Text>
        <TextInput
          style={[styles.input, styles.multilineInput, { minHeight: 100 }]}
          placeholder={"5x + y = 12\n2x + 3y = 40"}
          value={params.equationsText as string || ''}
          onChangeText={(text) => {
            const parsed = parseLinearEquations(text);
            onParamsChange({
              ...params,
              equationsText: text,
              A: parsed.error ? undefined : parsed.A,
              b: parsed.error ? undefined : parsed.b,
              parserError: parsed.error
            });
          }}
          multiline={true}
          numberOfLines={5}
          placeholderTextColor="#9ca3af"
        />
        {params.parserError && params.equationsText ? (
          <Text style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{params.parserError}</Text>
        ) : params.A && params.equationsText ? (
          <Text style={{ color: '#10b981', fontSize: 12, marginTop: 4 }}>✓ Sistema convertido a matriz exitosamente</Text>
        ) : null}
      </View>
    );
  };

  const renderMethodSpecificInputs = () => {
    switch (methodKey) {
      case 'biseccion':
        return (
          <>
            {renderInput('f', 'Ecuación f(x)', 'x^2 - 2', 'default', true)}
            {renderInput('a', 'Límite inferior (a) (opcional)', '1', 'numeric')}
            {renderInput('b', 'Límite superior (b) (opcional)', '2', 'numeric')}
            {renderInput('tolerance', 'Tolerancia', '1e-10', 'numeric')}
            {renderInput('max_iterations', 'Número de iteraciones (n)', '7', 'numeric')}
          </>
        );

      case 'newton_raphson':
        return (
          <>
            {renderInput('f', 'Ecuación f(x)', 'x^2 - 2', 'default', true)}
            {renderInput('f_prime', "Derivada f'(x)", '2*x', 'default', true)}
            {renderInput('x0', 'Aprox. inicial (x₀) (opcional)', '1.5', 'numeric')}
            {renderInput('tolerance', 'Tolerancia', '1e-15', 'numeric')}
            {renderInput('max_iterations', 'Número de iteraciones (n)', '7', 'numeric')}
          </>
        );

      case 'secante':
        return (
          <>
            {renderInput('f', 'Ecuación f(x)', 'x^3 - 2', 'default', true)}
            {renderInput('x0', '1ra aproximación (x₀) (opcional)', '1', 'numeric')}
            {renderInput('x1', '2da aproximación (x₁) (opcional)', '2', 'numeric')}
            {renderInput('tolerance', 'Tolerancia', '1e-10', 'numeric')}
            {renderInput('max_iterations', 'Número de iteraciones (n)', '7', 'numeric')}
          </>
        );

      case 'punto_fijo':
        return (
          <>
            {renderInput('g', 'Función de iteración g(x)', 'math.cos(x)', 'default', true)}
            {renderInput('x0', 'Aprox. inicial (x₀) (opcional)', '0.5', 'numeric')}
            {renderInput('tolerance', 'Tolerancia', '1e-10', 'numeric')}
            {renderInput('max_iterations', 'Número de iteraciones (n)', '7', 'numeric')}
          </>
        );

      case 'jacobi':
        return (
          <>
            {renderJacobiInput()}
            {renderInput('x0', 'Aproximación inicial (opcional)', '', 'default', true)}
            {renderInput('tolerance', 'Tolerancia', '1e-10', 'numeric')}
            {renderInput('max_iterations', 'Número de iteraciones', '1000', 'numeric')}
          </>
        );

      case 'taylor':
        return (
          <>
            {renderInput('f', 'Ecuación f(x)', 'math.sin(x)', 'default', true)}
            {renderInput('x0', 'Centro de expansión (x₀)', '0', 'numeric')}
            {renderInput('n_terms', 'Número de términos', '5', 'numeric')}
            {renderInput('eval_x', 'Evaluar en x (opcional)', '', 'numeric')}
            {renderInput('tolerance', 'Tolerancia', '1e-10', 'numeric')}
          </>
        );

      case 'maclaurin':
        return (
          <>
            {renderInput('f', 'Ecuación f(x)', 'math.exp(x)', 'default', true)}
            {renderInput('n_terms', 'Número de términos', '10', 'numeric')}
            {renderInput('eval_x', 'Evaluar en x (opcional)', '1', 'numeric')}
            {renderInput('tolerance', 'Tolerancia', '1e-10', 'numeric')}
          </>
        );

      default:
        return (
          <Text style={styles.errorText}>Método no reconocido</Text>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Parámetros</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.secondaryButton} onPress={onLoadExample}>
            <Text style={styles.secondaryButtonText}>Ejemplo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.clearButton} onPress={onClear}>
            <Text style={styles.clearButtonText}>Limpiar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.form}>
        {renderMethodSpecificInputs()}
      </ScrollView>

      {methodInfo?.requirements && (
        <View style={styles.requirements}>
          <Text style={styles.requirementsTitle}>Requisitos:</Text>
          <Text style={styles.requirementsText}>{methodInfo.requirements}</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  secondaryButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '500',
  },
  clearButton: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  clearButtonText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '500',
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#1f2937',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  requirements: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 4,
  },
  requirementsText: {
    fontSize: 14,
    color: '#92400e',
    lineHeight: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
    padding: 20,
  },
});

export default InputForm;