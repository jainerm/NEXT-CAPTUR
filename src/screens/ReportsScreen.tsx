import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Modal,
  Platform,
  Alert,
} from 'react-native';
import { CalendarDays, Send, Trash2, X } from 'lucide-react-native';
import ScreenHeader from '../components/screen-header';
import TextField from '../core/ui/TextField';
import Select from '../core/ui/Select';
import Button from '../core/ui/Button';
import FontText from '../theme/FontText';
import { palette } from '../theme/colors';

const initialReports = [
  {
    id: 'rep-001',
    title: 'Acta de inventario',
    date: '2023-10-27 10:30',
    sent: false,
  },
  {
    id: 'rep-002',
    title: 'General de Activos por Sucursal',
    date: '2023-10-26 15:45',
    sent: false,
  },
  {
    id: 'rep-003',
    title: 'Total de Activos por Categoría',
    date: '2023-10-25 09:12',
    sent: false,
  },
];

const reportTypes = [
  { label: 'Acta de Inventario', value: 'acta' },
  { label: 'Resumen de Activos', value: 'resumen' },
];

const users = [
  { label: 'Todos', value: 'all' },
  { label: 'USR-001', value: 'usr-001' },
];

const branches = [
  { label: 'Todas', value: 'all' },
  { label: 'Cali', value: 'cali' },
];

const categories = [
  { label: 'Todas', value: 'all' },
  { label: 'Dispositivos Electrónicos', value: 'electronics' },
];

const months = [
  { label: 'Enero', value: 1 },
  { label: 'Febrero', value: 2 },
  { label: 'Marzo', value: 3 },
  { label: 'Abril', value: 4 },
  { label: 'Mayo', value: 5 },
  { label: 'Junio', value: 6 },
  { label: 'Julio', value: 7 },
  { label: 'Agosto', value: 8 },
  { label: 'Septiembre', value: 9 },
  { label: 'Octubre', value: 10 },
  { label: 'Noviembre', value: 11 },
  { label: 'Diciembre', value: 12 },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 8 }, (_, idx) => currentYear - 3 + idx).map(value => ({
  label: value.toString(),
  value,
}));

const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();

const formatDateString = (value: Date) => {
  const day = String(value.getDate()).padStart(2, '0');
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const year = value.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function ReportsScreen() {
  const [reports, setReports] = useState(initialReports);
  const [reportType, setReportType] = useState('acta');
  const [date, setDate] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [user, setUser] = useState('all');
  const [branch, setBranch] = useState('all');
  const [category, setCategory] = useState('all');
  const [element, setElement] = useState('');
  const [status, setStatus] = useState('all');
  const [format, setFormat] = useState<'pdf' | 'excel'>('pdf');

  const openDatePicker = () => setShowDatePicker(true);

  const handleDateConfirm = () => {
    setDate(formatDateString(selectedDate));
    setShowDatePicker(false);
  };

  const updateSelectedDate = (year: number, month: number, day: number) => {
    const maxDay = getDaysInMonth(year, month);
    setSelectedDate(new Date(year, month - 1, Math.min(day, maxDay)));
  };

  const handleSend = (id: string) => {
    const report = reports.find(report => report.id === id);
    if (!report) return;

    Alert.alert(
      'Enviar reporte',
      `¿Deseas enviar el reporte "${report.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Enviar',
          onPress: () => {
            setReports(prevReports =>
              prevReports.map(item =>
                item.id === id ? { ...item, sent: true } : item,
              ),
            );
            Alert.alert('Reporte enviado', 'El reporte se ha marcado como enviado.');
          },
        },
      ],
    );
  };

  const handleDelete = (id: string) => {
    const report = reports.find(report => report.id === id);
    if (!report) return;

    Alert.alert(
      'Eliminar reporte',
      `¿Seguro que quieres eliminar el reporte "${report.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setReports(prevReports => prevReports.filter(item => item.id !== id));
            Alert.alert('Reporte eliminado', 'El reporte ha sido borrado de la lista.');
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader routeName="Reportes" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <FontText style={styles.cardTitle}>Reportes de Inventario</FontText>

          <Select
            label="Tipo de Reporte"
            value={reportType}
            options={reportTypes}
            onSelect={option => setReportType(String(option.value))}
          />

          <TouchableOpacity activeOpacity={0.8} onPress={openDatePicker}>
            <TextField
              label="Fecha"
              placeholder="Seleccionar fecha"
              value={date}
              editable={false}
              rightIcon={<CalendarDays color={palette.darkGray.main} size={20} />}
            />
          </TouchableOpacity>

          <Select
            label="Usuario"
            value={user}
            options={users}
            onSelect={option => setUser(String(option.value))}
          />

          <Select
            label="Sucursal"
            value={branch}
            options={branches}
            onSelect={option => setBranch(String(option.value))}
          />

          <Select
            label="Categoría"
            value={category}
            options={categories}
            onSelect={option => setCategory(String(option.value))}
          />

          <TextField
            label="Elemento"
            placeholder="Buscar por nombre o código"
            value={element}
            onChangeText={setElement}
          />

          <Select
            label="Estado"
            value={status}
            options={[
              { label: 'Todos', value: 'all' },
              { label: 'Activo', value: 'active' },
              { label: 'Inactivo', value: 'inactive' },
            ]}
            onSelect={option => setStatus(String(option.value))}
          />

          <View style={styles.formatRow}>
            <View style={styles.formatOption}>
              <TouchableOpacity onPress={() => setFormat('excel')} style={styles.radioRow} activeOpacity={0.8}>
                <View style={[styles.radioOuter, format === 'excel' && styles.radioActive]}>
                  {format === 'excel' && <View style={styles.radioInner} />}
                </View>
                <FontText style={styles.radioLabel}>Excel</FontText>
              </TouchableOpacity>
            </View>
            <View style={styles.formatOption}>
              <TouchableOpacity onPress={() => setFormat('pdf')} style={styles.radioRow} activeOpacity={0.8}>
                <View style={[styles.radioOuter, format === 'pdf' && styles.radioActive]}>
                  {format === 'pdf' && <View style={styles.radioInner} />}
                </View>
                <FontText style={styles.radioLabel}>PDF</FontText>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <Button title="Enviar" onPress={() => Alert.alert('Enviar reporte', 'Ruta de envío aún no disponible.')} variant="outline" style={styles.sendButton} />
            <Button title="Generar" onPress={() => Alert.alert('Generar reporte', 'Reporte generado correctamente.')} style={styles.generateButton} />
          </View>
        </View>

        <Modal
          visible={showDatePicker}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowDatePicker(false)}>
          <View style={styles.dateModalOverlay}>
            <View style={styles.dateModalContent}>
              <View style={styles.dateModalHeader}>
                <FontText style={styles.modalTitle}>Seleccionar fecha</FontText>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <X size={24} color={palette.darkGray.main} />
                </TouchableOpacity>
              </View>
              <View style={styles.datePickerRow}>
                <View style={styles.datePickerItem}>
                  <Select
                    label="Día"
                    value={String(selectedDate.getDate())}
                    options={Array.from({ length: getDaysInMonth(selectedDate.getFullYear(), selectedDate.getMonth() + 1) }, (_, index) => ({
                      label: String(index + 1),
                      value: String(index + 1),
                    }))}
                    onSelect={option => updateSelectedDate(selectedDate.getFullYear(), selectedDate.getMonth() + 1, Number(option.value))}
                  />
                </View>
                <View style={styles.datePickerItem}>
                  <Select
                    label="Mes"
                    value={String(selectedDate.getMonth() + 1)}
                    options={months.map(month => ({ label: month.label, value: String(month.value) }))}
                    onSelect={option => updateSelectedDate(selectedDate.getFullYear(), Number(option.value), selectedDate.getDate())}
                  />
                </View>
                <View style={styles.datePickerItem}>
                  <Select
                    label="Año"
                    value={String(selectedDate.getFullYear())}
                    options={years.map(year => ({ label: year.label, value: String(year.value) }))}
                    onSelect={option => updateSelectedDate(Number(option.value), selectedDate.getMonth() + 1, selectedDate.getDate())}
                  />
                </View>
              </View>
              <Button title="Aplicar" onPress={handleDateConfirm} style={styles.applyDateButton} />
            </View>
          </View>
        </Modal>

        <View style={styles.listCard}>
          <FontText style={styles.sectionTitle}>Reportes Generados</FontText>
          {reports.map(report => (
            <View key={report.id} style={styles.reportRow}>
              <View>
                <FontText style={styles.reportTitle}>{report.title}</FontText>
                <FontText style={styles.reportDate}>{report.date}</FontText>
                {report.sent && (
                  <View style={styles.sentBadge}>
                    <FontText style={styles.sentText}>Enviado</FontText>
                  </View>
                )}
              </View>
              <View style={styles.reportActions}>
                <TouchableOpacity style={styles.iconButton} activeOpacity={0.75} onPress={() => handleSend(report.id)}>
                  <Send size={18} color={report.sent ? palette.green.main : palette.orange.main} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} activeOpacity={0.75} onPress={() => handleDelete(report.id)}>
                  <Trash2 size={18} color={palette.red.main} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.backgroundGray.light,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 120,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: palette.white.main,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.darkGray.main,
    marginBottom: 20,
  },
  formatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 16,
  },
  formatOption: {
    flex: 1,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: palette.darkGray.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioActive: {
    borderColor: palette.orange.main,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 6,
    backgroundColor: palette.orange.main,
  },
  radioLabel: {
    fontSize: 14,
    color: palette.darkGray.main,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  sendButton: {
    flex: 1,
    marginRight: 12,
  },
  generateButton: {
    flex: 1,
  },
  listCard: {
    backgroundColor: palette.white.main,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.darkGray.main,
    marginBottom: 16,
  },
  reportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: palette.backgroundGray.main,
  },
  reportTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: palette.darkGray.main,
  },
  reportDate: {
    fontSize: 13,
    color: palette.darkGray.light,
    marginTop: 4,
  },
  reportActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: palette.backgroundGray.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  sentBadge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: palette.green.light,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sentText: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.green.dark,
  },
  dateModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  dateModalContent: {
    backgroundColor: palette.white.main,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  dateModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.darkGray.main,
  },
  datePickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datePickerItem: {
    flex: 1,
    marginRight: 10,
  },
  datePickerItemLast: {
    marginRight: 0,
  },
  applyDateButton: {
    marginTop: 16,
  },
});
