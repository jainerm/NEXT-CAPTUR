import React, {useState} from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  TextInputProps,
  Animated,
  Platform,
} from 'react-native';
import {palette} from '../../theme/colors';
import FontText from '../../theme/FontText';
import {borderRadius, fontSizes, spacing} from './constants';
import {InputProps} from './types';

interface TextFieldProps extends Omit<TextInputProps, 'style'>, InputProps {}

const TextField: React.FC<TextFieldProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  disabled,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const focusAnim = useState(new Animated.Value(0))[0];

  const handleFocus = (e: any) => {
    setIsFocused(true);
    Animated.timing(focusAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    Animated.timing(focusAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onBlur?.(e);
  };

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [palette.backgroundGray.main, palette.orange.main],
  });

  return (
    <View style={styles.container}>
      {label && (
        <FontText style={[styles.label, isFocused && styles.labelFocused, !!error && styles.labelError]}>
          {label}
        </FontText>
      )}
      
      <Animated.View
        style={[
          styles.inputContainer,
          {borderColor: error ? palette.red.main : borderColor},
          isFocused && styles.inputContainerFocused,
          disabled && styles.disabled,
        ]}>
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        
        <TextInput
          style={[styles.input, props.multiline && styles.multiline]}
          placeholderTextColor={palette.backgroundGray.dark}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
          {...props}
        />
        
        {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
      </Animated.View>

      {(error || helperText) && (
        <FontText style={[styles.helperText, !!error && styles.errorText]}>
          {error || helperText}
        </FontText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    width: '100%',
  },
  label: {
    fontSize: fontSizes.sm,
    color: palette.darkGray.main,
    marginBottom: spacing.xs,
    marginLeft: 4,
    fontWeight: '500',
  },
  labelFocused: {
    color: palette.orange.main,
  },
  labelError: {
    color: palette.red.main,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.white.main,
    borderWidth: 1.5,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.sm,
    minHeight: 52,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  inputContainerFocused: {
    backgroundColor: '#FFF',
    ...Platform.select({
      ios: {
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  input: {
    flex: 1,
    fontSize: fontSizes.md,
    color: palette.darkGray.main,
    paddingVertical: Platform.OS === 'ios' ? spacing.sm : spacing.xs,
    fontFamily: 'Google Sans Flex',
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: spacing.sm,
  },
  iconContainer: {
    paddingHorizontal: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helperText: {
    fontSize: fontSizes.xs,
    color: palette.backgroundGray.dark,
    marginTop: 4,
    marginLeft: 4,
  },
  errorText: {
    color: palette.red.main,
  },
  disabled: {
    backgroundColor: palette.backgroundGray.light,
    opacity: 0.7,
  },
});

export default TextField;
