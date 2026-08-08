import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import {palette} from '../../theme/colors';
import FontText from '../../theme/FontText';
import {borderRadius, fontSizes, spacing} from './constants';
import {InputProps} from './types';
import {ChevronDown, X} from 'lucide-react-native';

interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectProps extends InputProps {
  value?: string | number;
  options: SelectOption[];
  onSelect: (option: SelectOption) => void;
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  value,
  options,
  onSelect,
  placeholder = 'Seleccionar...',
  error,
  helperText,
  disabled,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (option: SelectOption) => {
    onSelect(option);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {label && (
        <FontText style={[styles.label, !!error && styles.labelError]}>
          {label}
        </FontText>
      )}

      <TouchableOpacity
        activeOpacity={0.7}
        disabled={disabled}
        onPress={() => setModalVisible(true)}
        style={[
          styles.selectContainer,
          !!error && styles.selectContainerError,
          disabled && styles.disabled,
        ]}>
        <FontText
          style={[
            styles.valueText,
            !selectedOption && styles.placeholderText,
          ]}>
          {selectedOption ? selectedOption.label : placeholder}
        </FontText>
        <ChevronDown size={20} color={palette.darkGray.main} />
      </TouchableOpacity>

      {(error || helperText) && (
        <FontText style={[styles.helperText, !!error && styles.errorText]}>
          {error || helperText}
        </FontText>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <FontText style={styles.modalTitle}>{label || 'Seleccionar'}</FontText>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={palette.darkGray.main} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={item => item.value.toString()}
              contentContainerStyle={styles.listContent}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    item.value === value && styles.selectedOptionItem,
                  ]}
                  onPress={() => handleSelect(item)}>
                  <FontText
                    style={[
                      styles.optionText,
                      item.value === value && styles.selectedOptionText,
                    ]}>
                    {item.label}
                  </FontText>
                </TouchableOpacity>
              )}
            />
          </SafeAreaView>
        </View>
      </Modal>
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
  labelError: {
    color: palette.red.main,
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: palette.white.main,
    borderWidth: 1.5,
    borderColor: palette.backgroundGray.main,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    height: 52,
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
  selectContainerError: {
    borderColor: palette.red.main,
  },
  valueText: {
    fontSize: fontSizes.md,
    color: palette.darkGray.main,
  },
  placeholderText: {
    color: palette.backgroundGray.dark,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: palette.white.main,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: palette.backgroundGray.light,
  },
  modalTitle: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: palette.darkGray.main,
  },
  listContent: {
    padding: spacing.md,
  },
  optionItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
  },
  selectedOptionItem: {
    backgroundColor: palette.orange.light + '20', // Add some transparency
  },
  optionText: {
    fontSize: fontSizes.md,
    color: palette.darkGray.main,
  },
  selectedOptionText: {
    color: palette.orange.main,
    fontWeight: '600',
  },
});

export default Select;
