import React, {useState} from 'react';
import {ScrollView, View, StyleSheet, SafeAreaView} from 'react-native';
import {Button, TextField, Select} from './index';
import {spacing, fontSizes} from './constants';
import FontText from '../../theme/FontText';
import {Search, Mail, Lock, User} from 'lucide-react-native';
import {palette} from '../../theme/colors';

const UIComponentsShowcase: React.FC = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<string | number>('');

  const categories = [
    {label: 'Electrónica', value: 'elec'},
    {label: 'Ropa', value: 'cloth'},
    {label: 'Hogar', value: 'home'},
    {label: 'Otros', value: 'other'},
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <FontText style={styles.title}>UI Core Components</FontText>
        
        <View style={styles.section}>
          <FontText style={styles.sectionTitle}>Buttons</FontText>
          <View style={styles.row}>
            <Button title="Primary" onPress={() => {}} variant="primary" style={styles.smallButton} />
            <Button title="Secondary" onPress={() => {}} variant="secondary" style={styles.smallButton} />
          </View>
          <Button 
            title="With Icon" 
            onPress={() => {}} 
            variant="tertiary" 
            leftIcon={<Search size={18} color="white" />}
            style={styles.button}
          />
          <Button title="Outline" onPress={() => {}} variant="outline" style={styles.button} />
          <Button title="Danger" onPress={() => {}} variant="danger" style={styles.button} />
          <Button title="Loading State" onPress={() => {}} loading style={styles.button} />
        </View>

        <View style={styles.section}>
          <FontText style={styles.sectionTitle}>Text Fields</FontText>
          <TextField
            label="Nombre Completo"
            placeholder="Ej. Juan Pérez"
            value={name}
            onChangeText={setName}
            leftIcon={<User size={20} color={palette.darkGray.light} />}
          />
          <TextField
            label="Email"
            placeholder="correo@ejemplo.com"
            keyboardType="email-address"
            leftIcon={<Mail size={20} color={palette.darkGray.light} />}
          />
          <TextField
            label="Contraseña"
            placeholder="********"
            secureTextEntry
            leftIcon={<Lock size={20} color={palette.darkGray.light} />}
            helperText="Mínimo 8 caracteres"
          />
          <TextField
            label="Error State"
            placeholder="Campo con error"
            error="Este campo es obligatorio"
          />
        </View>

        <View style={styles.section}>
          <FontText style={styles.sectionTitle}>Select</FontText>
          <Select
            label="Categoría de Producto"
            options={categories}
            value={category}
            onSelect={(opt) => setCategory(opt.value)}
            placeholder="Selecciona una categoría"
          />
        </View>

        <View style={styles.section}>
          <FontText style={styles.sectionTitle}>Variants & Sizes</FontText>
          <View style={styles.row}>
            <Button title="Small" size="sm" onPress={() => {}} style={{flex: 1, marginRight: 8}} />
            <Button title="Medium" size="md" onPress={() => {}} style={{flex: 1, marginRight: 8}} />
            <Button title="Large" size="lg" onPress={() => {}} style={{flex: 1}} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    padding: spacing.lg,
  },
  title: {
    fontSize: fontSizes.huge,
    fontWeight: 'bold',
    marginBottom: spacing.xl,
    color: palette.darkGray.main,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    marginBottom: spacing.md,
    color: palette.darkGray.main,
    borderBottomWidth: 1,
    borderBottomColor: palette.backgroundGray.light,
    paddingBottom: spacing.xs,
  },
  button: {
    marginBottom: spacing.sm,
  },
  smallButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
});

export default UIComponentsShowcase;
