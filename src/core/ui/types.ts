import {ReactNode} from 'react';
import {TextStyle, ViewStyle} from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface BaseComponentProps {
  style?: ViewStyle;
  children?: ReactNode;
}

export interface InputProps extends BaseComponentProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  disabled?: boolean;
}
