import React, { useMemo, useState } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, View, TouchableOpacity } from 'react-native';
import { CheckCircle2, Wifi, XCircle } from 'lucide-react-native';
import Button from '../core/ui/Button';
import TextField from '../core/ui/TextField';
import FontText from '../theme/FontText';
import { palette } from '../theme/colors';
import ScreenHeader from '../components/screen-header';

const initialConnections = [
  {
    id: 'USR-001',
    date: '2024-01-15 10:30',
    status: 'Activo',
  },
  {
    id: 'USR-002',
    date: '2024-01-14 16:45',
    status: 'Fallida',
  },
];

export default function ConnectivityScreen() {
  const [host, setHost] = useState('192.168.1.1');
  const [port, setPort] = useState('8080');
  const [apiUrl, setApiUrl] = useState('https://api.ejemplo.com');
  const [userId, setUserId] = useState('USR-001');
  const [connections, setConnections] = useState(initialConnections);
  const [connectionStatus, setConnectionStatus] = useState<'Activo' | 'Error'>('Activo');
  const [connectionErrorMessage, setConnectionErrorMessage] = useState('');

  const canSave = host.trim().length > 0 && port.trim().length > 0 && apiUrl.trim().length > 0 && userId.trim().length > 0;

  const validateConnection = () => {
    if (!canSave) {
      setConnectionStatus('Error');
      setConnectionErrorMessage('Completa todos los campos para validar la conexión.');
      return false;
    }

    const hostIsValid = /^\d{1,3}(\.\d{1,3}){3}$/.test(host.trim());
    const urlIsValid = /^https?:\/\/.+/.test(apiUrl.trim());

    if (!hostIsValid || !urlIsValid) {
      setConnectionStatus('Error');
      setConnectionErrorMessage('El host o la URL API son inválidos.');
      return false;
    }

    setConnectionStatus('Activo');
    setConnectionErrorMessage('Conexión válida.');
    return true;
  };

  const handleRegister = () => {
    if (!validateConnection()) {
      return;
    }

    const nextConnection = {
      id: userId.trim(),
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'Activo',
    };
    setConnections(current => [nextConnection, ...current]);
  };

  const handleCancel = () => {
    setHost('');
    setPort('');
    setApiUrl('');
    setUserId('');
  };

  const statusColor = useMemo(
    () => (status: string) =>
      status === 'Activo' ? palette.green.main : palette.red.main,
    [],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader routeName="Conectividad" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Wifi size={20} color={palette.orange.main} />
            <FontText style={styles.cardTitle}>Configuración de Conexión</FontText>
          </View>

          <TextField
            label="IP Host"
            placeholder="192.168.1.1"
            value={host}
            onChangeText={setHost}
          />
          <TextField
            label="Puerto"
            placeholder="8080"
            value={port}
            onChangeText={setPort}
            keyboardType="numeric"
          />
          <TextField
            label="URL API"
            placeholder="https://api.ejemplo.com"
            value={apiUrl}
            onChangeText={setApiUrl}
          />
          <TextField
            label="ID Usuario"
            placeholder="USR-001"
            value={userId}
            onChangeText={setUserId}
          />

          <View style={styles.inlineButtons}>
            <Button
              title="Registrar"
              onPress={handleRegister}
              disabled={!canSave}
              style={styles.registerButton}
            />
            <Button
              title="Cancelar"
              onPress={handleCancel}
              variant="outline"
              style={styles.cancelButton}
            />
          </View>

          {connectionStatus === 'Error' && (
            <View style={styles.connectionErrorBox}>
              <XCircle size={18} color={palette.red.main} />
              <FontText style={styles.connectionErrorText}>{connectionErrorMessage}</FontText>
            </View>
          )}
        </View>

        <View style={styles.listCard}>
          <FontText style={styles.sectionTitle}>Conexiones Registradas</FontText>
          {connections.map(connection => (
            <View key={`${connection.id}-${connection.date}`} style={styles.connectionRow}>
              <View>
                <FontText style={styles.connectionId}>{connection.id}</FontText>
                <FontText style={styles.connectionSub}>{connection.date}</FontText>
              </View>
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, { backgroundColor: statusColor(connection.status) }]} />
                <FontText style={styles.statusLabel}>{connection.status}</FontText>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.backgroundGray.light,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 120,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: palette.white.main,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.darkGray.main,
    marginLeft: 10,
  },
  inlineButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 10,
  },
  registerButton: {
    flex: 1,
  },
  cancelButton: {
    flex: 1,
  },
  listCard: {
    backgroundColor: palette.white.main,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.darkGray.main,
    marginBottom: 16,
  },
  connectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: palette.backgroundGray.main,
  },
  connectionId: {
    fontSize: 15,
    fontWeight: '700',
    color: palette.darkGray.main,
  },
  connectionSub: {
    fontSize: 13,
    color: palette.darkGray.light,
    marginTop: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 6,
    marginRight: 8,
  },
  connectionErrorBox: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  connectionErrorText: {
    marginLeft: 10,
    color: palette.red.main,
    fontSize: 14,
    fontWeight: '600',
  },
  statusLabel: {
    fontSize: 13,
    color: palette.darkGray.main,
    fontWeight: '600',
  },
});
