import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ListProps {
  title?: string;
  onPress?: () => void;
}

function List({ title = 'List', onPress }: ListProps) {
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

export default memo(List);
