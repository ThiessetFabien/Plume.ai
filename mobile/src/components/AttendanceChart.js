import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Colors } from '../theme/colors';

const screenWidth = Dimensions.get('window').width;

const AttendanceChart = ({ data }) => {
  // Transformation des données pour le Chart Kit
  const chartData = {
    labels: data.labels || ["Semaine 1", "Semaine 2", "Semaine 3", "Semaine 4"],
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
      r: "3",
      strokeWidth: "0",
    },
    propsForLabels: {
      fontSize: 10,
    },
    fillShadowGradient: Colors.primary,
    fillShadowGradientOpacity: 0.2,
    useShadowColorFromDataset: false,
    strokeWidth: 3,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nombre de séances par semaine</Text>
      <LineChart
        style={styles.chart}
        data={chartData}
        width={screenWidth - 64}
        height={220}
        chartConfig={chartConfig}
        bezier
        verticalLabelRotation={0}
        fromZero={true}
        withInnerLines={false}
        withOuterLines={false}
        withShadow={true}
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
