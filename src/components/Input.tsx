import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface InputProps {
  title?: string;
  onPress?: () => void;
}

function Input({ title = 'Input', onPress }: InputProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} accessibilityRole="button">
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8 },
  text: { fontSize: 16 },
});

export default memo(Input);
