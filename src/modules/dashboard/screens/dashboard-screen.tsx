import { ScrollView, StyleSheet, Text, View } from 'react-native';
import SummaryCard from '../components/summary-card';
import MetricCard from '../components/metric-card';
import BranchTotalsCard from '../components/branch-total-card';
import { palette } from '../../../theme/colors';
import FontText from '../../../theme/FontText';

export default function DashboardScreen() {
  const metricItems = [
    { title: 'Muebles y Enseres', value: '$500k', percentage: 0.4, ringColor: '#F97316' },
    { title: 'Inventario Total', value: '$820k', percentage: 0.68, ringColor: '#3B82F6' },
    { title: 'Ventas Actuales', value: '$320k', percentage: 0.54, ringColor: '#10B981' },
  ];

  const summaryData = {
    title: 'Total',
    total: '$1,250,000',
    delta: '+5%',
    deltaPositive: true,
    rows: [
      { label: 'Sucursal A', progress: 0.92, color: '#F44336' },
      { label: 'Sucursal B', progress: 0.68, color: '#FB8C00' },
      { label: 'Sucursal C', progress: 0.82, color: '#EF5350' },
    ],
  };

  const branchTotals = [
    { date: '15/07/24', branch: 'A', total: '58' },
    { date: '12/07/24', branch: 'C', total: '72' },
    { date: '10/07/24', branch: 'B', total: '45' },
    { date: '05/07/24', branch: 'A', total: '61' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scroll}>
      <View style={styles.container}>
        <View style={styles.sectionContainer}>
          <FontText style={styles.title}>Total activos por sucursal</FontText>
          <SummaryCard {...summaryData} />
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.title}>Resumen categorías</Text>
          <View style={styles.metricsRow}>
            {metricItems.map(item => (
              <MetricCard
                key={item.title}
                title={item.title}
                value={item.value}
                percentage={item.percentage}
                ringColor={item.ringColor}
              />
            ))}
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.title}>Activos recientes</Text>
          <BranchTotalsCard title="Últimos totales" subtitle="Por fecha y sucursal" items={branchTotals} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: '#F6F7FB',
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
    paddingHorizontal: 15,
    paddingVertical: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: palette.green.dark,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  metricsRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    // marginVertical: 24,
    gap: 8,
  },
  sectionContainer: {
    marginVertical: 12,
    gap: 6,
    backgroundColor: palette.green.transparent,
    padding: 12,
    borderRadius: 12,
  },
});
