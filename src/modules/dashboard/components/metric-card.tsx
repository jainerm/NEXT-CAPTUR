import {StyleSheet, Text, View} from 'react-native';
import Svg, {Circle} from 'react-native-svg';

export type MetricCardProps = {
  title: string;
  value: string;
  percentage?: number;
  backgroundColor?: string;
  titleColor?: string;
  valueColor?: string;
  ringColor?: string;
};

export default function MetricCard({
  title,
  value,
  percentage = 0.4,
  backgroundColor = '#FFFFFF',
  titleColor = '#4B5563',
  valueColor = '#111827',
  ringColor = '#FB8C00',
}: MetricCardProps) {
  const safePercentage = Math.min(Math.max(percentage, 0), 1);
  const size = 56;
  const strokeWidth = 9;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - safePercentage);

  return (
    <View style={[styles.card, {backgroundColor}]}> 
      <Text style={[styles.title, {color: titleColor}]}>{title}</Text>
      <View style={styles.chartWrapper}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#F3F4F6"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={ringColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <View style={styles.chartCenter}>
          <Text style={styles.percentage}>{Math.round(safePercentage * 100)}%</Text>
        </View>
      </View>
      <Text style={[styles.value, {color: valueColor}]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: 176,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
    textTransform: 'capitalize',
    letterSpacing: 0.3,
  },
  chartWrapper: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  chartCenter: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentage: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  value: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
});
