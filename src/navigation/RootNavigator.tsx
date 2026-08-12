import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import UsersScreen from '../screens/UsersScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import BranchesScreen from '../screens/BranchesScreen';
import ConnectivityScreen from '../screens/ConnectivityScreen';

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
      <Stack.Screen name="Users" component={UsersScreen} />
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="Branches" component={BranchesScreen} />
      <Stack.Screen name="Connectivity" component={ConnectivityScreen} />
    </Stack.Navigator>
  );
}

export type {RootStackParamList};
