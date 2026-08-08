import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Home, Box, BarChart3, Settings2} from 'lucide-react-native';
import DashboardScreen from '../modules/dashboard/screens/dashboard-screen';
import InventoryScreen from './InventoryScreen';
import ReportsScreen from './ReportsScreen';
import SettingsScreen from './SettingsScreen';

const Tab = createBottomTabNavigator();

export default function HomeScreen() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({color, size}) => {
          switch (route.name) {
            case 'Inicio':
              return <Home color={color} size={size} />;
            case 'Inventario':
              return <Box color={color} size={size} />;
            case 'Reportes':
              return <BarChart3 color={color} size={size} />;
            case 'Ajustes':
              return <Settings2 color={color} size={size} />;
            default:
              return null;
          }
        },
        tabBarActiveTintColor: '#1f2937',
        tabBarInactiveTintColor: '#6b7280',
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen name="Inicio" component={DashboardScreen} />
      <Tab.Screen name="Inventario" component={InventoryScreen} />
      <Tab.Screen name="Reportes" component={ReportsScreen} />
      <Tab.Screen name="Ajustes" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
