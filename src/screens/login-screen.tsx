import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {CheckCircle2, Eye, EyeOff} from 'lucide-react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Button from '../core/ui/Button';
import TextField from '../core/ui/TextField';
import FontText from '../theme/FontText';
import {palette} from '../theme/colors';
import type {RootStackParamList} from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({navigation}: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isFormValid = username.trim().length > 0 && password.trim().length > 0;

  const handleLogin = () => {
    navigation.replace('Home');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          <View style={styles.brandContainer}>
            <FontText style={styles.brand}>Captúr</FontText>
            <View style={styles.iconBadge}>
              <CheckCircle2 color={palette.white.main} size={18} />
            </View>
          </View>

          <FontText style={styles.title}>Bienvenido</FontText>
          <FontText style={styles.subtitle}>Inicia sesión para continuar con tu inventario.</FontText>

          <View style={styles.card}>
            <TextField
              placeholder="Usuario"
              value={username}
              onChangeText={setUsername}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />

            <TextField
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              rightIcon={(
                <TouchableOpacity onPress={() => setShowPassword(current => !current)}>
                  {showPassword ? (
                    <EyeOff color={palette.darkGray.main} size={20} />
                  ) : (
                    <Eye color={palette.darkGray.main} size={20} />
                  )}
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity style={styles.forgotPassword} activeOpacity={0.7}>
              <FontText style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</FontText>
            </TouchableOpacity>

            <Button
              title="Iniciar Sesión"
              onPress={handleLogin}
              disabled={!isFormValid}
              style={styles.loginButton}
            />

            <View style={styles.signupRow}>
              <FontText style={styles.signupText}>¿No tienes una cuenta? </FontText>
              <TouchableOpacity activeOpacity={0.7}>
                <FontText style={styles.signupLink}>Regístrate</FontText>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <View style={styles.divider} />
            <FontText style={styles.footerText}>© 2025 Todos los derechos reservados</FontText>
            <FontText style={styles.footerBrand}>Gesin Sas.</FontText>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: palette.backgroundGray.light,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  brand: {
    fontSize: 32,
    fontWeight: '800',
    color: palette.green.dark,
    letterSpacing: 1,
  },
  iconBadge: {
    marginLeft: 10,
    width: 34,
    height: 34,
    borderRadius: 18,
    backgroundColor: palette.green.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: palette.darkGray.main,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: palette.darkGray.light,
    marginBottom: 28,
    lineHeight: 22,
    maxWidth: '85%',
  },
  card: {
    backgroundColor: palette.white.main,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },
  forgotPassword: {
    marginTop: 4,
    marginBottom: 24,
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    color: palette.orange.main,
    fontSize: 13,
    fontWeight: '600',
  },
  loginButton: {
    marginTop: 8,
  },
  signupRow: {
    marginTop: 22,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  signupText: {
    color: palette.darkGray.main,
    fontSize: 13,
  },
  signupLink: {
    color: palette.orange.main,
    fontSize: 13,
    fontWeight: '700',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  divider: {
    width: 60,
    height: 2,
    borderRadius: 2,
    backgroundColor: palette.backgroundGray.main,
    marginBottom: 16,
  },
  footerText: {
    color: palette.darkGray.light,
    fontSize: 12,
    marginBottom: 4,
  },
  footerBrand: {
    color: palette.darkGray.main,
    fontSize: 13,
    fontWeight: '700',
  },
});
