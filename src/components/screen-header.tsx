import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import {
  Menu,
  X,
  Users,
  Layers,
  MapPin,
  Wifi,
  LogOut,
  Grid,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontText from '../theme/FontText';
import { palette } from '../theme/colors';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/Root-navigator';

const { width } = Dimensions.get('window');
const drawerWidth = Math.min(300, width * 0.75);

const menuItems: {
  key: string;
  label: string;
  icon: any;
  screen: keyof RootStackParamList;
  danger?: boolean;
}[] = [
    { key: 'Inicio', label: 'Gestor', icon: Layers, screen: 'Home' },
    { key: 'Usuarios', label: 'Usuarios', icon: Users, screen: 'Users' },
    { key: 'Categorías', label: 'Categorías', icon: Grid, screen: 'Categories' },
    { key: 'Sucursales', label: 'Sucursales', icon: MapPin, screen: 'Branches' },
    { key: 'Conectividad', label: 'Conectividad', icon: Wifi, screen: 'Connectivity' },
    { key: 'Finalizar', label: 'Finalizar', icon: LogOut, danger: true, screen: 'Login' },
  ];

const routeTitleMap: Record<string, string> = {
  Inicio: 'Inventario Principal',
  Inventario: 'Toma de inventario',
  Reportes: 'Reportes de inventario',
  Ajustes: 'Ajustes',
  Usuarios: 'Usuarios',
  Categorías: 'Categorías',
  Sucursales: 'Sucursales',
  Conectividad: 'Conectividad',
};

interface ScreenHeaderProps {
  routeName: string;
}

export default function ScreenHeader({ routeName }: ScreenHeaderProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState(routeName);

  useEffect(() => {
    setSelectedKey(routeName);
  }, [routeName]);

  const toggleMenu = () => setIsOpen(current => !current);

  const handleMenuPress = (key: string) => {
    const nextItem = menuItems.find(item => item.key === key);
    if (!nextItem) return;

    setSelectedKey(key);
    setIsOpen(false);

    if (nextItem.screen === 'Login') {
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      return;
    }

    navigation.navigate(nextItem.screen);
  };

  const title = routeTitleMap[routeName] ?? 'Captúr';

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable style={styles.menuButton} onPress={toggleMenu}>
          <Menu size={24} color={palette.darkGray.main} />
        </Pressable>

        <View style={styles.titleWrapper}>
          <FontText style={styles.title}>{title}</FontText>
        </View>

        <View style={styles.spacer} />
      </View>

      <Modal
        transparent={true}
        visible={isOpen}
        animationType="fade"
        onRequestClose={toggleMenu}>
        <View style={styles.modalContainer}>
          <Pressable style={styles.modalBackdrop} onPress={toggleMenu} />
          <View style={[styles.modalDrawer, { paddingTop: Math.max(insets.top, 20) }]}>
            <View style={styles.drawerHeader}>
              <View style={styles.drawerBadge}>
                <Layers size={20} color={palette.white.main} />
              </View>
              <View style={styles.drawerTitleWrapper}>
                <FontText style={styles.drawerTitle}>Gestor</FontText>
                <FontText style={styles.drawerSubtitle}>Administrador</FontText>
              </View>
              <Pressable style={styles.closeButton} onPress={toggleMenu}>
                <X size={20} color={palette.darkGray.main} />
              </Pressable>
            </View>

            <View style={styles.menuItemsContainer}>
              {menuItems.map(item => {
                const Icon = item.icon;
                const isActive = item.key === selectedKey;
                return (
                  <Pressable
                    key={item.key}
                    style={[styles.menuItem, isActive && styles.menuItemActive]}
                    onPress={() => handleMenuPress(item.key)}>
                    <View style={styles.itemIcon}>
                      <Icon size={18} color={item.danger ? palette.red.main : (isActive ? palette.orange.main : palette.darkGray.main)} />
                    </View>
                    <FontText style={[styles.itemLabel, isActive && styles.itemLabelActive, item.danger && styles.itemDanger]}>
                      {item.label}
                    </FontText>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 10,
    backgroundColor: palette.white.main,
    borderBottomWidth: 1,
    borderBottomColor: palette.backgroundGray.main,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: palette.backgroundGray.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrapper: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.darkGray.main,
  },
  spacer: {
    width: 44,
  },
  modalContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalDrawer: {
    width: drawerWidth,
    backgroundColor: palette.white.main,
    height: '100%',
    paddingHorizontal: 18,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 16,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  drawerBadge: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: palette.orange.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerTitleWrapper: {
    flex: 1,
    marginLeft: 12,
  },
  drawerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.darkGray.main,
  },
  drawerSubtitle: {
    fontSize: 12,
    color: palette.darkGray.light,
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemsContainer: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  menuItemActive: {
    backgroundColor: '#FEF3C7',
  },
  itemIcon: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  itemLabel: {
    fontSize: 15,
    color: palette.darkGray.main,
    fontWeight: '600',
  },
  itemLabelActive: {
    color: palette.orange.main,
  },
  itemDanger: {
    color: palette.red.main,
  },
});
