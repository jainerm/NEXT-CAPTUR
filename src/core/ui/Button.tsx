import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import {palette} from '../../theme/colors';
import FontText from '../../theme/FontText';
import {borderRadius, fontSizes, spacing} from './constants';
import {ButtonSize, ButtonVariant} from './types';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  fullWidth = true,
}) => {
  const getVariantStyles = (): {container: ViewStyle; text: TextStyle} => {
    switch (variant) {
      case 'secondary':
        return {
          container: {backgroundColor: palette.blue.main},
          text: {color: palette.white.main},
        };
      case 'tertiary':
        return {
          container: {backgroundColor: palette.green.main},
          text: {color: palette.white.main},
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderColor: palette.darkGray.main,
          },
          text: {color: palette.darkGray.main},
        };
      case 'ghost':
        return {
          container: {backgroundColor: 'transparent'},
          text: {color: palette.darkGray.main},
        };
      case 'danger':
        return {
          container: {backgroundColor: palette.red.main},
          text: {color: palette.white.main},
        };
      case 'primary':
      default:
        return {
          container: {backgroundColor: palette.orange.main},
          text: {color: palette.white.main},
        };
    }
  };

  const getSizeStyles = (): {container: ViewStyle; text: TextStyle} => {
    switch (size) {
      case 'sm':
        return {
          container: {paddingVertical: spacing.sm, paddingHorizontal: spacing.md, minHeight: 40},
          text: {fontSize: fontSizes.sm},
        };
      case 'lg':
        return {
          container: {paddingVertical: spacing.lg, paddingHorizontal: spacing.xl, minHeight: 64},
          text: {fontSize: fontSizes.lg},
        };
      case 'md':
      default:
        return {
          container: {paddingVertical: spacing.md, paddingHorizontal: spacing.lg, minHeight: 54},
          text: {fontSize: fontSizes.md},
        };
    }
  };

  const getShadowStyle = (): ViewStyle => {
    if (disabled || loading || variant === 'outline' || variant === 'ghost') return {};

    let shadowColor = '#000';
    switch (variant) {
      case 'primary': shadowColor = palette.orange.main; break;
      case 'secondary': shadowColor = palette.blue.main; break;
      case 'danger': shadowColor = palette.red.main; break;
      case 'tertiary': shadowColor = palette.green.main; break;
    }

    return {
      ...Platform.select({
        ios: {
          shadowColor: shadowColor,
          shadowOffset: {width: 0, height: 8},
          shadowOpacity: 0.25,
          shadowRadius: 10,
        },
        android: {
          elevation: 8,
        },
      }),
    };
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  const shadowStyle = getShadowStyle();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.baseContainer,
        variantStyles.container,
        sizeStyles.container,
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        shadowStyle,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? palette.orange.main : palette.white.main}
          size="small"
        />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <FontText style={[styles.baseText, variantStyles.text, sizeStyles.text, textStyle]}>
            {title}
          </FontText>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseText: {
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: palette.backgroundGray.main,
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
});

export default Button;
