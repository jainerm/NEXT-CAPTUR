import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/login-screen';
import HomeScreen from '../screens/home-screen';
import UsersScreen from '../screens/users-screen';
import CategoriesScreen from '../screens/categories-screen';
import BranchesScreen from '../screens/branches-screen';
import ConnectivityScreen from '../screens/connectivity-screen';
import ScreenHeader from '../components/screen-header';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Users: undefined;
  Categories: undefined;
  Branches: undefined;
  Connectivity: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen 
        name="Users" 
        component={UsersScreen} 
        options={{
          headerShown: true,
          header: () => <ScreenHeader routeName="Usuarios" />,
        }}
      />
      <Stack.Screen 
        name="Categories" 
        component={CategoriesScreen} 
        options={{
          headerShown: true,
          header: () => <ScreenHeader routeName="Categorías" />,
        }}
      />
      <Stack.Screen 
        name="Branches" 
        component={BranchesScreen} 
        options={{
          headerShown: true,
          header: () => <ScreenHeader routeName="Sucursales" />,
        }}
      />
      <Stack.Screen 
        name="Connectivity" 
        component={ConnectivityScreen} 
        options={{
          headerShown: true,
          header: () => <ScreenHeader routeName="Conectividad" />,
        }}
      />
    </Stack.Navigator>
  );
}

export type {RootStackParamList};
