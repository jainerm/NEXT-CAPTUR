import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Home, Box, BarChart3, Settings2} from 'lucide-react-native';
import DashboardScreen from '../modules/dashboard/screens/dashboard-screen';
import InventoryScreen from './inventory-screen';
import ReportsScreen from './reports-screen';
import SettingsScreen from './settings-screen';
import UsersScreen from './users-screen';
import CategoriesScreen from './categories-screen';
import BranchesScreen from './branches-screen';
import ConnectivityScreen from './connectivity-screen';
import ScreenHeader from '../components/screen-header';

const Tab = createBottomTabNavigator();
const DashboardStack = createNativeStackNavigator();

function DashboardStackScreen() {
  return (
    <DashboardStack.Navigator screenOptions={{headerShown: false}}>
      <DashboardStack.Screen name="Dashboard" component={DashboardScreen} />
      <DashboardStack.Screen 
        name="Users" 
        component={UsersScreen} 
        options={{
          headerShown: true,
          header: () => <ScreenHeader routeName="Usuarios" />,
        }}
      />
      <DashboardStack.Screen 
        name="Categories" 
        component={CategoriesScreen} 
        options={{
          headerShown: true,
          header: () => <ScreenHeader routeName="Categorías" />,
        }}
      />
      <DashboardStack.Screen 
        name="Branches" 
        component={BranchesScreen} 
        options={{
          headerShown: true,
          header: () => <ScreenHeader routeName="Sucursales" />,
        }}
      />
      <DashboardStack.Screen 
        name="Connectivity" 
        component={ConnectivityScreen} 
        options={{
          headerShown: true,
          header: () => <ScreenHeader routeName="Conectividad" />,
        }}
      />
    </DashboardStack.Navigator>
  );
}

export default function HomeScreen() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: true,
        header: () => <ScreenHeader routeName={route.name} />,
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
      <Tab.Screen name="Inicio" component={DashboardStackScreen} />
      <Tab.Screen name="Inventario" component={InventoryScreen} />
      <Tab.Screen name="Reportes" component={ReportsScreen} />
      <Tab.Screen name="Ajustes" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
