import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const SettingItem = ({ icon, title, description, onPress }) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress}>
    <View style={styles.settingIcon}>
      <Ionicons name={icon} size={24} color="#FFFFFF" />
    </View>
    <View style={styles.settingContent}>
      <Text style={styles.settingTitle}>{title}</Text>
      <Text style={styles.settingDescription}>{description}</Text>
    </View>
    <Ionicons name="chevron-forward" size={24} color="#666666" />
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configuración General</Text>
        <SettingItem
          icon="notifications-outline"
          title="Notificaciones"
          description="Administrar notificaciones de la aplicación"
        />
        <SettingItem
          icon="color-palette-outline"
          title="Apariencia"
          description="Cambiar tema y estilo visual"
        />
        <SettingItem
          icon="language-outline"
          title="Idioma"
          description="Cambiar el idioma de la aplicación"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configuración del Gimnasio</Text>
        <SettingItem
          icon="business-outline"
          title="Información del Gimnasio"
          description="Editar detalles del establecimiento"
        />
        <SettingItem
          icon="people-outline"
          title="Planes y Suscripciones"
          description="Administrar planes de membresía y suscripciones"
          onPress={() => router.push('/plans')}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  section: {
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2C2C2C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#888888',
  },
});