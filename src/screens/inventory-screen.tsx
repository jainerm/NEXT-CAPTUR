import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Text,
  Image,
  Alert,
} from 'react-native';
import { Button, TextField, Select, spacing, fontSizes } from '../core/ui';
import { palette } from '../theme/colors';
import FontText from '../theme/FontText';
import { QrCode, Camera } from 'lucide-react-native';

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
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const estados = [
    { label: 'En uso', value: 'En uso' },
    { label: 'Mantenimiento', value: 'Mantenimiento' },
    { label: 'Baja', value: 'Baja' },
  ];

  const categorias = [
    { label: 'Muebles', value: 'muebles' },
    { label: 'Equipos', value: 'equipos' },
    { label: 'Vehículos', value: 'vehiculos' },
  ];

  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const openPhotoModal = () => setPhotoModalVisible(true);
  const closePhotoModal = () => setPhotoModalVisible(false);

  const handleCapturePhoto = async () => {
    try {
      const ImagePicker = require('react-native-image-picker');
      const options = {
        mediaType: 'photo',
        quality: 0.8,
        saveToPhotos: true,
        cameraType: 'back',
      };

      ImagePicker.launchCamera(options, (response: any) => {
        if (response.didCancel) {
          return;
        }

        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'No se pudo abrir la cámara.');
          return;
        }

        const asset = response.assets?.[0];
        if (asset?.uri) {
          setPhotoUri(asset.uri);
          setPhotoTaken(true);
          setPhotoModalVisible(false);
          Alert.alert('Foto tomada', 'La imagen del activo ha sido guardada.');
        }
      });
    } catch (error) {
      Alert.alert('Cámara no disponible', 'No se pudo acceder a la cámara en este dispositivo.');
    }
  };

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
            onPress={openPhotoModal}
            leftIcon={<Camera size={20} color={palette.orange.main} />}
            style={styles.photoButton}
            textStyle={{ color: palette.orange.main }}
          />
          {photoTaken && (
            <View style={styles.photoStatus}>
              <Text style={styles.photoStatusText}>Foto tomada</Text>
            </View>
          )}
          <Button
            title="Registrar Inventario"
            variant="primary"
            onPress={() => Alert.alert('Inventario registrado', 'Datos del activo guardados correctamente.')}
            style={styles.registerButton}
          />
        </View>

        <Modal
          visible={photoModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={closePhotoModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.photoModal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Capturar foto del activo</Text>
                <TouchableOpacity onPress={closePhotoModal} style={styles.modalCloseButton}>
                  <Text style={styles.modalCloseText}>×</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.modalSubtitle}>Coloque el activo dentro del marco</Text>
              <View style={styles.cameraFrame}>
                {photoUri ? (
                  <Image source={{ uri: photoUri }} style={styles.cameraPreview} />
                ) : (
                  <View style={styles.cameraPlaceholder} />
                )}
              </View>
              <Button
                title="Capturar Foto"
                variant="primary"
                onPress={handleCapturePhoto}
                style={styles.capturePhotoButton}
              />
            </View>
          </View>
        </Modal>
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
  photoStatus: {
    backgroundColor: palette.green.light,
    paddingVertical: 10,
    borderRadius: 16,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  photoStatusText: {
    color: palette.green.dark,
    fontSize: fontSizes.sm,
    fontWeight: '700',
  },
  registerButton: {
    // La sombra ahora se maneja internamente en el componente Button variant="primary"
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  photoModal: {
    width: '100%',
    borderRadius: 30,
    backgroundColor: palette.white.main,
    padding: spacing.lg,
    alignItems: 'center',
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  modalTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: palette.darkGray.main,
  },
  modalCloseButton: {
    width: 34,
    height: 34,
    borderRadius: 18,
    backgroundColor: palette.backgroundGray.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 22,
    color: palette.darkGray.main,
    lineHeight: 22,
  },
  modalSubtitle: {
    fontSize: fontSizes.sm,
    color: palette.darkGray.light,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  cameraFrame: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 20,
    backgroundColor: '#000',
    overflow: 'hidden',
    marginBottom: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraPlaceholder: {
    width: '90%',
    height: '70%',
    borderRadius: 16,
    backgroundColor: palette.backgroundGray.main,
  },
  cameraPreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  capturePhotoButton: {
    width: '100%',
    marginTop: spacing.sm,
  },
});

