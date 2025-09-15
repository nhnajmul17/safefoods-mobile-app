import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native';

interface WarningIconProps {
  size?: number;
  color?: string;
}

export default function WarningIcon({ size = 60, color = "#f39c12" }: WarningIconProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={[styles.circle, { borderColor: color }]}>
        <Text style={[styles.exclamation, { color, fontSize: size * 0.4 }]}>!</Text>
      </View>
      <View style={[styles.pulse, { borderColor: color, width: size * 1.2, height: size * 1.2 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  circle: {
    borderWidth: 3,
    borderRadius: 50,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(243, 156, 18, 0.1)',
    zIndex: 2,
  },
  exclamation: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pulse: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 50,
    opacity: 0.3,
    zIndex: 1,
  },
});