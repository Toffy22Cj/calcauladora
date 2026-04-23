import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { HistoryItem } from '../types';

const HistoryScreen: React.FC = () => {
  // Por ahora, datos de ejemplo
  const [history, setHistory] = React.useState<HistoryItem[]>([
    {
      id: '1',
      timestamp: new Date(),
      method: 'biseccion',
      params: { f: 'x^2 - 2', a: 1, b: 2 },
      result: {
        success: true,
        method: 'biseccion',
        root: 1.4142135623842478,
        iterations: [],
      },
    },
  ]);

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => (
    <TouchableOpacity style={styles.historyItem}>
      <View style={styles.historyHeader}>
        <Text style={styles.methodName}>{item.method.toUpperCase()}</Text>
        <Text style={styles.timestamp}>
          {item.timestamp.toLocaleTimeString()}
        </Text>
      </View>
      <Text style={styles.params}>
        {JSON.stringify(item.params, null, 2)}
      </Text>
      {item.result.success && item.result.root && (
        <Text style={styles.result}>
          Resultado: {item.result.root.toFixed(6)}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Historial</Text>
        <Text style={styles.subtitle}>Cálculos anteriores</Text>
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>📝 No hay cálculos guardados</Text>
          <Text style={styles.emptySubtext}>
            Los resultados se guardarán automáticamente aquí
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
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
  subtitle: {
    fontSize: 14,
    color: '#e0e7ff',
    textAlign: 'center',
    marginTop: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },
  listContainer: {
    padding: 20,
  },
  historyItem: {
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
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  methodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  timestamp: {
    fontSize: 12,
    color: '#6b7280',
  },
  params: {
    fontSize: 12,
    color: '#4b5563',
    fontFamily: 'monospace',
    backgroundColor: '#f9fafb',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  result: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
  },
});

export default HistoryScreen;