import React, { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Edit3, Trash2, User } from 'lucide-react-native';
import Button from '../core/ui/Button';
import TextField from '../core/ui/TextField';
import Select from '../core/ui/Select';
import FontText from '../theme/FontText';
import { palette } from '../theme/colors';

const branchOptions = [
  { label: 'Cali', value: 'cali' },
  { label: 'Bogotá', value: 'bogota' },
  { label: 'Medellín', value: 'medellin' },
];

const initialUsers = [
  { id: 'USR-001', name: 'Juan Pérez', branch: 'Cali' },
  { id: 'USR-002', name: 'María Rodríguez', branch: 'Cali' },
];

export default function UsersScreen() {
  const [userId, setUserId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [branch, setBranch] = useState<string | number>('cali');
  const [users, setUsers] = useState(initialUsers);

  const selectedBranch = useMemo(
    () => branchOptions.find(option => option.value === branch) ?? branchOptions[0],
    [branch],
  );

  const isFormValid = userId.trim().length > 0 && firstName.trim().length > 0 && lastName.trim().length > 0;

  const handleRegister = () => {
    if (!isFormValid) return;

    const nextUser = {
      id: userId.trim(),
      name: `${firstName.trim()} ${lastName.trim()}`,
      branch: selectedBranch.label,
    };

    setUsers(current => [nextUser, ...current]);
    setUserId('');
    setFirstName('');
    setLastName('');
    setBranch(branchOptions[0].value);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <FontText style={styles.cardTitle}>Registro de Usuarios</FontText>

          <TextField
            label="ID. Usuario"
            placeholder="Ingrese ID Usuario"
            value={userId}
            onChangeText={setUserId}
          />

          <TextField
            label="Nombres"
            placeholder="Ingrese Nombres"
            value={firstName}
            onChangeText={setFirstName}
          />

          <TextField
            label="Apellidos"
            placeholder="Ingrese Apellidos"
            value={lastName}
            onChangeText={setLastName}
          />

          <Select
            label="Sucursal"
            value={branch}
            options={branchOptions}
            onSelect={option => setBranch(option.value)}
          />

          <Button
            title="Registrar Usuario"
            onPress={handleRegister}
            disabled={!isFormValid}
            style={styles.registerButton}
          />
        </View>

        <View style={styles.listSection}>
          <FontText style={styles.sectionTitle}>Usuarios Registrados</FontText>
          {users.map(user => (
            <View key={user.id} style={styles.userItem}>
              <View style={styles.userInfo}>
                <View style={styles.userAvatar}>
                  <User size={20} color={palette.orange.main} />
                </View>
                <View style={styles.userText}>
                  <FontText style={styles.userName}>{user.name}</FontText>
                  <FontText style={styles.userMeta}>{user.id} · {user.branch}</FontText>
                </View>
              </View>
              <View style={styles.userActions}>
                <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                  <Edit3 size={18} color={palette.orange.main} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                  <Trash2 size={18} color={palette.red.main} />
                </TouchableOpacity>
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
    paddingTop: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: palette.white.main,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.darkGray.main,
    marginBottom: 20,
  },
  registerButton: {
    marginTop: 10,
  },
  listSection: {
    backgroundColor: palette.white.main,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.darkGray.main,
    marginBottom: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: palette.backgroundGray.main,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  userText: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.darkGray.main,
  },
  userMeta: {
    fontSize: 13,
    color: palette.darkGray.light,
    marginTop: 2,
  },
  userActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: palette.backgroundGray.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
});
