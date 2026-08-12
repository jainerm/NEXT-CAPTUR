import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {Plus, Edit3, Trash2} from 'lucide-react-native';
import Button from '../core/ui/Button';
import TextField from '../core/ui/TextField';
import FontText from '../theme/FontText';
import {palette} from '../theme/colors';
import ScreenHeader from '../components/ScreenHeader';

const initialLocations = [
  {id: 'loc-1', name: 'Oficina'},
  {id: 'loc-2', name: 'Puesto de trabajo'},
];

export default function BranchesScreen() {
  const [branchId, setBranchId] = useState('');
  const [branchName, setBranchName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [costCenter, setCostCenter] = useState('');
  const [locations, setLocations] = useState(initialLocations);

  const isFormValid =
    branchId.trim().length > 0 &&
    branchName.trim().length > 0 &&
    city.trim().length > 0 &&
    address.trim().length > 0;

  const handleRegisterBranch = () => {
    if (!isFormValid) return;
    setBranchId('');
    setBranchName('');
    setCity('');
    setAddress('');
    setCostCenter('');
  };

  const handleAddLocation = () => {
    setLocations(current => [
      ...current,
      {id: `loc-${current.length + 1}`, name: `Nueva ubicación ${current.length + 1}`},
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader routeName="Sucursales" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <FontText style={styles.cardTitle}>Registro de Sucursales</FontText>

          <TextField
            label="ID Sucursal"
            placeholder="Ingrese ID Sucursal"
            value={branchId}
            onChangeText={setBranchId}
          />
          <TextField
            label="Nombre"
            placeholder="Ingrese Nombre"
            value={branchName}
            onChangeText={setBranchName}
          />
          <TextField
            label="Ciudad"
            placeholder="Ingrese Ciudad"
            value={city}
            onChangeText={setCity}
          />
          <TextField
            label="Dirección"
            placeholder="Ingrese Dirección"
            value={address}
            onChangeText={setAddress}
          />
          <TextField
            label="Centro de costos"
            placeholder="Ingrese Centro de costos"
            value={costCenter}
            onChangeText={setCostCenter}
          />

          <Button
            title="Registrar Sucursal"
            onPress={handleRegisterBranch}
            disabled={!isFormValid}
            style={styles.registerButton}
          />
        </View>

        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <FontText style={styles.sectionTitle}>Ubicaciones</FontText>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddLocation}
              activeOpacity={0.75}>
              <Plus size={20} color={palette.white.main} />
            </TouchableOpacity>
          </View>

          {locations.map(location => (
            <View key={location.id} style={styles.locationItem}>
              <FontText style={styles.locationName}>{location.name}</FontText>
              <View style={styles.locationActions}>
                <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                  <Edit3 size={18} color={palette.orange.main} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
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
    paddingTop: 120,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: palette.white.main,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
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
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.darkGray.main,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: palette.orange.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: palette.backgroundGray.light,
    marginBottom: 12,
  },
  locationName: {
    fontSize: 15,
    fontWeight: '600',
    color: palette.darkGray.main,
  },
  locationActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: palette.white.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
});
