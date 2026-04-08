import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Colors } from '../theme/colors';

const screenWidth = Dimensions.get('window').width;

const AttendanceChart = ({ data }) => {
  // Transformation des données pour le Chart Kit
  const chartData = {
    labels: data.labels || ["Sem 1", "Sem 2", "Sem 3", "Sem 4"],
    datasets: [
      {
        data: data.values || [0, 0, 0, 0],
      },
    ],
  };

  const chartConfig = {
    backgroundColor: Colors.surface,
    backgroundGradientFrom: Colors.surface,
    backgroundGradientTo: Colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`, // Blue
    labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: Colors.secondary,
    },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activité (30j)</Text>
      <BarChart
        style={styles.chart}
        data={chartData}
        width={screenWidth - 48}
        height={220}
        yAxisLabel=""
        chartConfig={chartConfig}
        verticalLabelRotation={0}
        fromZero={true}
        showValuesOnTopOfBars={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
  },
  title: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default AttendanceChart;
