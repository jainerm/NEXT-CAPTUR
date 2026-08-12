import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import Button from '../core/ui/Button';
import FontText from '../theme/FontText';
import { palette } from '../theme/colors';

const settingsOptions = [
  {
    id: 'pending',
    title: 'Dejar pendiente',
    description: 'Permite dejar la tarea pendiente para continuarla más tarde',
  },
  {
    id: 'location',
    title: 'Siempre indicar ubicación',
    description: 'Indica siempre la ubicación actual en las tareas',
  },
  {
    id: 'dailyClose',
    title: 'Hacer cierre diario y enviar',
    description: 'Realiza un cierre diario y envía un informe',
  },
  {
    id: 'signature',
    title: 'Solicitar firma al finalizar',
    description: 'Solicita una firma al finalizar cada tarea',
  },
  {
    id: 'sendAct',
    title: 'Enviar acta al finalizar',
    description: 'Envía un acta al finalizar cada tarea',
  },
];

export default function SettingsScreen() {
  const [toggles, setToggles] = useState({
    pending: false,
    location: false,
    dailyClose: false,
    signature: true,
    sendAct: true,
  });

  const toggleOption = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    Alert.alert('Ajustes guardados', 'Los cambios en la configuración se han guardado correctamente.');
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <FontText style={styles.heading}>Ajustes</FontText>
          <Text style={styles.description}>Configura tu experiencia de trabajo con los ajustes rápidos.</Text>

          {settingsOptions.map(option => (
            <View key={option.id} style={styles.optionRow}>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
              <Switch
                value={toggles[option.id as keyof typeof toggles]}
                onValueChange={() => toggleOption(option.id as keyof typeof toggles)}
                thumbColor={toggles[option.id as keyof typeof toggles] ? palette.white.main : palette.white.main}
                trackColor={{ false: palette.backgroundGray.main, true: palette.green.main }}
              />
            </View>
          ))}

          <Button title="Guardar Ajustes" onPress={handleSave} style={styles.saveButton} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.backgroundGray.light,
  },
  container: {
    padding: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: palette.white.main,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.07,
    shadowRadius: 24,
    elevation: 6,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.darkGray.main,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: palette.darkGray.light,
    marginBottom: 20,
    lineHeight: 20,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: palette.backgroundGray.main,
  },
  optionText: {
    flex: 1,
    paddingRight: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.darkGray.main,
    marginBottom: 6,
  },
  optionDescription: {
    fontSize: 13,
    color: palette.darkGray.light,
    lineHeight: 18,
  },
  saveButton: {
    marginTop: 24,
  },
});
