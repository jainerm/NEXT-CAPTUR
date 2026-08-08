import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {Button, TextField, Select, spacing, fontSizes} from '../core/ui';
import {palette} from '../theme/colors';
import FontText from '../theme/FontText';
import {QrCode, Camera} from 'lucide-react-native';

export default function InventoryScreen() {
  const [form, setForm] = useState({
    idPlaca: '',
    elemento: '',
    marca: '',
    modelo: '',
    serie: '',
    estado: 'En uso',
    ubicacion: '',
    categoria: '',
  });

  const handleInputChange = (key: string, value: any) => {
    setForm(prev => ({...prev, [key]: value}));
  };

  const estados = [
    {label: 'En uso', value: 'En uso'},
    {label: 'Mantenimiento', value: 'Mantenimiento'},
    {label: 'Baja', value: 'Baja'},
  ];

  const categorias = [
    {label: 'Muebles', value: 'muebles'},
    {label: 'Equipos', value: 'equipos'},
    {label: 'Vehículos', value: 'vehiculos'},
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <FontText style={styles.totalText}>
            Total registrados: <FontText style={styles.totalNumber}>1</FontText>
          </FontText>
        </View>

        <View style={styles.formSection}>
          <View style={styles.labelRow}>
            <FontText style={styles.fieldLabel}>Leer Codigo ID Placa</FontText>
            <TouchableOpacity>
              <QrCode size={20} color={palette.orange.main} />
            </TouchableOpacity>
          </View>
          <TextField
            placeholder="Ingrese ID Placa"
            value={form.idPlaca}
            onChangeText={val => handleInputChange('idPlaca', val)}
          />

          <FontText style={styles.fieldLabel}>Elemento</FontText>
          <TextField
            placeholder="Ingrese Elemento"
            value={form.elemento}
            onChangeText={val => handleInputChange('elemento', val)}
          />

          <FontText style={styles.fieldLabel}>Marca</FontText>
          <TextField
            placeholder="Ingrese Marca"
            value={form.marca}
            onChangeText={val => handleInputChange('marca', val)}
          />

          <FontText style={styles.fieldLabel}>Modelo</FontText>
          <TextField
            placeholder="Ingrese Modelo"
            value={form.modelo}
            onChangeText={val => handleInputChange('modelo', val)}
          />

          <View style={styles.labelRow}>
            <FontText style={styles.fieldLabel}>Leer Codigo Serie</FontText>
            <TouchableOpacity>
              <QrCode size={20} color={palette.orange.main} />
            </TouchableOpacity>
          </View>
          <TextField
            placeholder="Ingrese Serie"
            value={form.serie}
            onChangeText={val => handleInputChange('serie', val)}
          />

          <Select
            label="Estado"
            options={estados}
            value={form.estado}
            onSelect={opt => handleInputChange('estado', opt.value)}
          />

          <FontText style={styles.fieldLabel}>Ubicación</FontText>
          <TextField
            placeholder="Ingrese Ubicación"
            value={form.ubicacion}
            onChangeText={val => handleInputChange('ubicacion', val)}
          />

          <Select
            label="Categoría"
            options={categorias}
            value={form.categoria}
            onSelect={opt => handleInputChange('categoria', opt.value)}
            placeholder="Seleccione categoria"
          />
        </View>

        <View style={styles.actions}>
          <Button
            title="Tomar Foto del Activo"
            variant="outline"
            onPress={() => {}}
            leftIcon={<Camera size={20} color={palette.orange.main} />}
            style={styles.photoButton}
            textStyle={{color: palette.orange.main}}
          />
          <Button
            title="Registrar Inventario"
            variant="primary"
            onPress={() => {}}
            style={styles.registerButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContainer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  totalText: {
    fontSize: fontSizes.sm,
    color: palette.darkGray.light,
  },
  totalNumber: {
    color: palette.orange.main,
    fontWeight: 'bold',
  },
  formSection: {
    marginTop: spacing.sm,
  },
  fieldLabel: {
    fontSize: fontSizes.sm,
    color: palette.darkGray.main,
    fontWeight: '600',
    marginBottom: spacing.xs,
    marginLeft: 4,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  actions: {
    marginTop: spacing.lg,
  },
  photoButton: {
    borderColor: palette.orange.main,
    marginBottom: spacing.md,
  },
  registerButton: {
    // La sombra ahora se maneja internamente en el componente Button variant="primary"
  },
});

