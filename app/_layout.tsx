import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { getDatabase } from './database/database';

export default function RootLayout() {
  useEffect(() => {
    const initDB = async () => {
      try {
        await getDatabase();
        console.log('Base de datos inicializada correctamente');
      } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
      }
    };

    initDB();
  }, []);

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </>
  )
}
