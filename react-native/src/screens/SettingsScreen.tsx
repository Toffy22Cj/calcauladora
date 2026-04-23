import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';

const SettingsScreen: React.FC = () => {
  const [settings, setSettings] = useState({
    darkMode: false,
    autoSave: true,
    showIterations: true,
    precision: 6,
    maxIterations: 1000,
    defaultTolerance: 1e-10,
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetSettings = () => {
    Alert.alert(
      'Resetear Configuración',
      '¿Estás seguro de que quieres restaurar la configuración por defecto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Resetear',
          style: 'destructive',
          onPress: () => {
            setSettings({
              darkMode: false,
              autoSave: true,
              showIterations: true,
              precision: 6,
              maxIterations: 1000,
              defaultTolerance: 1e-10,
            });
          },
        },
      ]
    );
  };

  const SettingItem = ({
    title,
    subtitle,
    children,
  }: {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingText}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {children}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Configuración</Text>
        <Text style={styles.subtitle}>Personaliza tu experiencia</Text>
      </View>

      <View style={styles.content}>
        {/* Interfaz */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎨 Interfaz</Text>

          <SettingItem title="Modo Oscuro" subtitle="Cambiar a tema oscuro">
            <Switch
              value={settings.darkMode}
              onValueChange={(value) => updateSetting('darkMode', value)}
              trackColor={{ false: '#d1d5db', true: '#2563eb' }}
              thumbColor={settings.darkMode ? '#fff' : '#f4f3f4'}
            />
          </SettingItem>
        </View>

        {/* Comportamiento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Comportamiento</Text>

          <SettingItem title="Guardar Automáticamente" subtitle="Guardar cálculos en historial">
            <Switch
              value={settings.autoSave}
              onValueChange={(value) => updateSetting('autoSave', value)}
              trackColor={{ false: '#d1d5db', true: '#2563eb' }}
              thumbColor={settings.autoSave ? '#fff' : '#f4f3f4'}
            />
          </SettingItem>

          <SettingItem title="Mostrar Iteraciones" subtitle="Mostrar tabla de iteraciones por defecto">
            <Switch
              value={settings.showIterations}
              onValueChange={(value) => updateSetting('showIterations', value)}
              trackColor={{ false: '#d1d5db', true: '#2563eb' }}
              thumbColor={settings.showIterations ? '#fff' : '#f4f3f4'}
            />
          </SettingItem>
        </View>

        {/* Numérico */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔢 Configuración Numérica</Text>

          <SettingItem title="Precisión de Display" subtitle="Decimales a mostrar">
            <View style={styles.numberControls}>
              <TouchableOpacity
                style={styles.numberButton}
                onPress={() => updateSetting('precision', Math.max(1, settings.precision - 1))}
              >
                <Text style={styles.numberButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.numberValue}>{settings.precision}</Text>
              <TouchableOpacity
                style={styles.numberButton}
                onPress={() => updateSetting('precision', Math.min(15, settings.precision + 1))}
              >
                <Text style={styles.numberButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </SettingItem>

          <SettingItem title="Máx. Iteraciones" subtitle="Límite por defecto">
            <View style={styles.numberControls}>
              <TouchableOpacity
                style={styles.numberButton}
                onPress={() => updateSetting('maxIterations', Math.max(10, settings.maxIterations - 100))}
              >
                <Text style={styles.numberButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.numberValue}>{settings.maxIterations}</Text>
              <TouchableOpacity
                style={styles.numberButton}
                onPress={() => updateSetting('maxIterations', Math.min(10000, settings.maxIterations + 100))}
              >
                <Text style={styles.numberButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </SettingItem>
        </View>

        {/* Acerca de */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ Acerca de</Text>

          <View style={styles.aboutContainer}>
            <Text style={styles.appName}>Super Calculadora Numérica</Text>
            <Text style={styles.version}>Versión 1.0.0</Text>
            <Text style={styles.description}>
              Calculadora avanzada con métodos numéricos profesionales para encontrar raíces,
              resolver sistemas lineales y aproximar funciones.
            </Text>
            <Text style={styles.features}>
              ✨ 7 métodos implementados{'\n'}
              🎯 Precisión configurable{'\n'}
              📱 Multiplataforma{'\n'}
              🔬 Backend Lua profesional
            </Text>
          </View>
        </View>

        {/* Reset */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.resetButton} onPress={resetSettings}>
            <Text style={styles.resetButtonText}>🔄 Resetear Configuración</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  settingText: {
    flex: 1,
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  numberControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  numberValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginHorizontal: 15,
    minWidth: 30,
    textAlign: 'center',
  },
  aboutContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  version: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 15,
  },
  description: {
    fontSize: 14,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 15,
  },
  features: {
    fontSize: 14,
    color: '#10b981',
    textAlign: 'center',
    lineHeight: 22,
  },
  resetButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;