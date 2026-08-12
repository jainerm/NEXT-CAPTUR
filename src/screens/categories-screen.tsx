import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
} from 'react-native';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react-native';
import Button from '../core/ui/Button';
import TextField from '../core/ui/TextField';
import FontText from '../theme/FontText';
import { palette } from '../theme/colors';

const initialItems = [
  {
    id: 'item-1',
    name: 'Televisor',
    color: '#E0F2FE',
    expanded: false,
    detail: 'Incluye pantalla de 55 pulgadas y soporte de pared.',
  },
  {
    id: 'item-2',
    name: 'Teléfono',
    color: '#DCFCE7',
    expanded: false,
    detail: 'Modelo móvil con cámara trasera dual y plan de datos.',
  },
  {
    id: 'item-3',
    name: 'Laptop',
    color: '#F5E9FF',
    expanded: false,
    detail: 'Portátil con 16GB RAM y disco SSD de 512GB.',
  },
];

export default function CategoriesScreen() {
  const [categoryId, setCategoryId] = useState('CAT-001');
  const [categoryName, setCategoryName] = useState('Dispositivos Electrónicos');
  const [items, setItems] = useState(initialItems);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const toastOpacity = useRef(new Animated.Value(0)).current;

  const canRegister = categoryId.trim().length > 0 && categoryName.trim().length > 0;

  const handleAddItem = () => {
    const nextIndex = items.length + 1;
    setItems(current => [
      ...current,
      {
        id: `item-${nextIndex}`,
        name: `Elemento ${nextIndex}`,
        color: ['#E0F2FE', '#DCFCE7', '#F5E9FF'][nextIndex % 3],
        expanded: false,
        detail: '',
      },
    ]);
  };

  const handleRemoveItem = (id: string) => setItems(current => current.filter(item => item.id !== id));

  const toggleItemExpanded = (id: string) => {
    setItems(current =>
      current.map(item =>
        item.id === id ? { ...item, expanded: !item.expanded } : item,
      ),
    );
  };

  const handleItemDetailChange = (id: string, detail: string) => {
    setItems(current =>
      current.map(item =>
        item.id === id ? { ...item, detail } : item,
      ),
    );
  };

  const handleSaveCategory = () => {
    console.log('Guardar categoría', {
      id: categoryId,
      name: categoryName,
      items,
    });
    setConfirmationVisible(true);
  };

  useEffect(() => {
    if (!confirmationVisible) {
      toastOpacity.setValue(0);
      return;
    }

    Animated.timing(toastOpacity, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();

    const timeout = setTimeout(() => {
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setConfirmationVisible(false));
    }, 2200);

    return () => clearTimeout(timeout);
  }, [confirmationVisible, toastOpacity]);

  const saveButtonText = canRegister ? 'Guardar Categoría' : 'Completa los datos';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <FontText style={styles.cardTitle}>Gestión de Categorías</FontText>
          <TextField
            label="ID. Categoría"
            placeholder="CAT-001"
            value={categoryId}
            onChangeText={setCategoryId}
          />
          <TextField
            label="Nombre"
            placeholder="Dispositivos Electrónicos"
            value={categoryName}
            onChangeText={setCategoryName}
          />
        </View>

        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <FontText style={styles.sectionTitle}>Elementos</FontText>
            <TouchableOpacity style={styles.addButton} onPress={handleAddItem} activeOpacity={0.75}>
              <Plus size={20} color={palette.white.main} />
            </TouchableOpacity>
          </View>

          {items.map(item => (
            <View key={item.id} style={[styles.itemContainer, { backgroundColor: item.color }]}>
              <TouchableOpacity
                style={styles.itemRow}
                activeOpacity={0.8}
                onPress={() => toggleItemExpanded(item.id)}>
                <FontText style={styles.itemName}>{item.name}</FontText>
                <View style={styles.itemActions}>
                  <TouchableOpacity style={styles.iconAction} activeOpacity={0.7}>
                    {item.expanded ? (
                      <ChevronUp size={18} color={palette.darkGray.main} />
                    ) : (
                      <ChevronDown size={18} color={palette.darkGray.main} />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.iconAction, styles.deleteAction]}
                    onPress={() => handleRemoveItem(item.id)}
                    activeOpacity={0.7}>
                    <Trash2 size={18} color={palette.red.main} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
              {item.expanded && (
                <View style={styles.itemDetails}>
                  <TextField
                    label="Detalle"
                    placeholder="Escribe información adicional..."
                    value={item.detail}
                    onChangeText={value => handleItemDetailChange(item.id, value)}
                    multiline
                  />
                </View>
              )}
            </View>
          ))}

          <Button
            title={saveButtonText}
            onPress={handleSaveCategory}
            disabled={!canRegister}
            style={styles.registerButton}
          />
        </View>
        {confirmationVisible && (
          <Animated.View style={[styles.confirmationToast, { opacity: toastOpacity }]}>
            <FontText style={styles.confirmationText}>Categoría guardada correctamente</FontText>
          </Animated.View>
        )}
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
    marginBottom: 18,
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
  itemContainer: {
    borderRadius: 18,
    padding: 0,
    marginBottom: 12,
    overflow: 'hidden',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.darkGray.main,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconAction: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: palette.white.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  iconRotated: {
    transform: [{ rotate: '180deg' }],
  },
  itemDetails: {
    paddingHorizontal: 18,
    paddingBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  detailText: {
    fontSize: 14,
    color: palette.darkGray.light,
    lineHeight: 20,
  },
  deleteAction: {
    backgroundColor: palette.white.main,
  },
  registerButton: {
    marginTop: 10,
  },
  confirmationToast: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 32,
    backgroundColor: palette.green.main,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  confirmationText: {
    color: palette.white.main,
    fontSize: 15,
    fontWeight: '700',
  },
});
