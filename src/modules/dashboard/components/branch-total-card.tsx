import {StyleSheet, Text, View} from 'react-native';

export type BranchTotalItem = {
  date: string;
  branch: string;
  total: string;
};

export type BranchTotalsCardProps = {
  title: string;
  subtitle?: string;
  items: BranchTotalItem[];
};

export default function BranchTotalsCard({title, subtitle, items}: BranchTotalsCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.cardTitle}>{title}</Text>
          {subtitle ? <Text style={styles.cardSubtitle}>{subtitle}</Text> : null}
        </View>
      </View>

      <View style={styles.tableHeader}>
        <Text style={[styles.cellText, styles.headerText]}>Fecha</Text>
        <Text style={[styles.cellText, styles.headerText]}>Suc.</Text>
        <Text style={[styles.cellText, styles.headerText, styles.rightAlign]}>Total</Text>
      </View>

      {items.map((item, index) => (
        <View key={`${item.date}-${item.branch}-${index}`} style={styles.tableRow}>
          <Text style={styles.cellText}>{item.date}</Text>
          <Text style={styles.cellText}>{item.branch}</Text>
          <Text style={[styles.cellText, styles.totalText]}>{item.total}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },
  headerRow: {
    marginBottom: 18,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  cardSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#6B7280',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 14,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  cellText: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
  },
  headerText: {
    color: '#6B7280',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  rightAlign: {
    textAlign: 'right',
  },
  totalText: {
    fontWeight: '800',
    textAlign: 'right',
  },
});
