import {StyleSheet, Text, View} from 'react-native';
import {ArrowUpRight, ArrowDownRight, ArrowRight} from 'lucide-react-native';
import FontText from '../../../theme/FontText';

export type SummaryRow = {
  label: string;
  progress: number;
  color: string;
};

export type SummaryCardProps = {
  title: string;
  total: string;
  delta: string;
  deltaPositive?: boolean;
  deltaTrend?: 'up' | 'down' | 'equal';
  rows: SummaryRow[];
};

export default function SummaryCard({
  title,
  total,
  delta,
  deltaPositive = true,
  deltaTrend,
  rows,
}: SummaryCardProps) {
  const trend = deltaTrend ?? (delta === '0%' || delta === '0' ? 'equal' : deltaPositive ? 'up' : 'down');
  const TrendIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : ArrowRight;
  const trendColor = trend === 'up' ? '#22C55E' : trend === 'down' ? '#DC2626' : '#6B7280';
  const badgeStyle = [
    styles.deltaBadge,
    trend === 'up' ? styles.deltaPositive : trend === 'down' ? styles.deltaNegative : styles.deltaNeutral,
  ];
  const textStyle = [
    styles.deltaText,
    trend === 'down' ? styles.deltaNegativeText : trend === 'equal' ? styles.deltaNeutralText : null,
  ];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <FontText style={styles.cardTitle}>{title}</FontText>
          <FontText style={styles.cardAmount}>{total}</FontText>
        </View>

        <View style={badgeStyle}>
          <TrendIcon color={trendColor} size={14} strokeWidth={2.5} />
          <Text style={textStyle}>{delta}</Text>
        </View>
      </View>

      {rows.map(row => (
        <View key={row.label} style={styles.rowItem}>
          <Text style={styles.rowLabel}>{row.label}</Text>
          <View style={styles.rowBarTrack}>
            <View
              style={[
                styles.rowBarFill,
                {
                  width: `${Math.min(Math.max(row.progress, 0), 1) * 100}%`,
                  backgroundColor: row.color,
                },
              ]}
            />
          </View>
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
    padding: 22,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  cardTitle: {
    color: '#7C7C7C',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  cardAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#111',
    lineHeight: 42,
  },
  deltaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 18,
  },
  deltaPositive: {
    backgroundColor: '#E8F5E9',
  },
  deltaNegative: {
    backgroundColor: '#FEF2F2',
  },
  deltaNeutral: {
    backgroundColor: '#F3F4F6',
  },
  deltaIcon: {
    marginRight: 6,
  },
  deltaText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16A34A',
  },
  deltaNegativeText: {
    color: '#B91C1C',
  },
  deltaNeutralText: {
    color: '#4B5563',
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  rowLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E1E1E',
    marginRight: 12,
  },
  rowBarTrack: {
    flex: 1,
    height: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 999,
    overflow: 'hidden',
  },
  rowBarFill: {
    height: '100%',
    borderRadius: 999,
  },
});
