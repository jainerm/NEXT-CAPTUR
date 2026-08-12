import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Dimensions,
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
  ChevronDown,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import FontText from '../theme/FontText';
import { palette } from '../theme/colors';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/Root-navigator';

const { width } = Dimensions.get('window');
const drawerWidth = Math.min(300, width * 0.72);

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

      {isOpen && (
        <View style={styles.dropdownOverlay}>
          <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={toggleMenu} />
          <View style={styles.dropdown}>
            <View style={styles.drawerHeader}>
              <View style={styles.drawerBadge}>
                <Layers size={20} color={palette.white.main} />
              </View>
              <View>
                <FontText style={styles.drawerTitle}>Gestor</FontText>
                <FontText style={styles.drawerSubtitle}>Administrador</FontText>
              </View>
              <Pressable style={styles.closeButton} onPress={toggleMenu}>
                <X size={20} color={palette.darkGray.main} />
              </Pressable>
            </View>
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = item.key === selectedKey;
              return (
                <Pressable
                  key={item.key}
                  style={[styles.menuItem, isActive && styles.menuItemActive]}
                  onPress={() => handleMenuPress(item.key)}>
                  <View style={styles.itemIcon}>
                    <Icon size={18} color={item.danger ? palette.red.main : palette.darkGray.main} />
                  </View>
                  <FontText style={[styles.itemLabel, item.danger && styles.itemDanger]}>{item.label}</FontText>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 99,
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    backgroundColor: palette.white.main,
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
  titleBadge: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: palette.backgroundGray.light,
  },
  titleBadgeText: {
    color: palette.darkGray.main,
    fontSize: 12,
    fontWeight: '600',
    marginRight: 6,
  },
  spacer: {
    width: 44,
  },
  dropdownOverlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 100,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  dropdown: {
    position: 'absolute',
    top: -60,
    left: -20,
    width: drawerWidth,
    backgroundColor: palette.white.main,
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    borderColor: palette.backgroundGray.main,
    borderWidth: 1,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  drawerBadge: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: palette.orange.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginBottom: 8,
  },
  menuItemActive: {
    backgroundColor: '#FEF3C7',
  },
  itemIcon: {
    width: 32,
    alignItems: 'center',
    marginRight: 12,
  },
  itemLabel: {
    fontSize: 15,
    color: palette.darkGray.main,
    fontWeight: '600',
  },
  itemDanger: {
    color: palette.red.main,
  },
});
