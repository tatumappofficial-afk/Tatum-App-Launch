import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { colors, fonts } from '@/lib/theme';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>This page doesn't exist.</Text>
      <Link href="/" style={styles.link}>
        <Text style={styles.linkText}>Go home</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.warmSand },
  title: { fontFamily: fonts.playfair.semiBold, fontSize: 18, color: colors.ink },
  link: { marginTop: 16 },
  linkText: { fontFamily: fonts.dmSans.medium, fontSize: 14, color: colors.terra },
});
