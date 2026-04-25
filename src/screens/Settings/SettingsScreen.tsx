import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
  FlatList,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { logout } from '@redux/slices/authSlice';
import authService from '@services/authService';

interface SettingsScreenProps {
  navigation: any;
}

const MENU_ITEMS = [
  { id: 'account', title: 'Account Settings', icon: '👤' },
  { id: 'notifications', title: 'Notifications', icon: '🔔' },
  { id: 'storage', title: 'Storage & Sync', icon: '💾' },
  { id: 'security', title: 'Security', icon: '🔐' },
  { id: 'about', title: 'About', icon: 'ℹ️' },
  { id: 'help', title: 'Help & Support', icon: '❓' },
];

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [offlineMode, setOfflineMode] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [selectedMenuItem, setSelectedMenuItem] = useState<string | null>(null);

  const handleMenuPress = (id: string) => {
    setSelectedMenuItem(id);
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            await authService.logout();
            dispatch(logout());
            navigation.navigate('PhoneLogin');
          } catch (error) {
            Alert.alert('Error', 'Failed to logout');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            // TODO: Implement account deletion
            Alert.alert('Account Deleted', 'Your account has been deleted');
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
          <View style={styles.placeholder} />
        </View>

        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name}</Text>
            <Text style={styles.profilePhone}>{user?.phoneNumber}</Text>
            <Text style={styles.profileParty}>
              {user?.party} • {user?.state}
            </Text>
          </View>
        </View>

        {/* Quick Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Quick Settings</Text>

          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>🔔 Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive push notifications
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#3a3a4e', true: '#00d4ff' }}
              thumbColor={notificationsEnabled ? '#fff' : '#999'}
            />
          </View>

          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>📱 Offline Mode</Text>
              <Text style={styles.settingDescription}>
                Edit offline, sync when online
              </Text>
            </View>
            <Switch
              value={offlineMode}
              onValueChange={setOfflineMode}
              trackColor={{ false: '#3a3a4e', true: '#00d4ff' }}
              thumbColor={offlineMode ? '#fff' : '#999'}
            />
          </View>

          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>🔄 Auto Sync</Text>
              <Text style={styles.settingDescription}>
                Sync templates automatically
              </Text>
            </View>
            <Switch
              value={autoSync}
              onValueChange={setAutoSync}
              trackColor={{ false: '#3a3a4e', true: '#00d4ff' }}
              thumbColor={autoSync ? '#fff' : '#999'}
            />
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <FlatList
            data={MENU_ITEMS}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleMenuPress(item.id)}
              >
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuText}>{item.title}</Text>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Danger Zone */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>🚪 Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.deleteButtonText}>🗑️ Delete Account</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Prachar v1.0.0</Text>
          <Text style={styles.appInfoText}>Made with ❤️ for India</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a4e',
  },
  backButton: {
    color: '#00d4ff',
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 30,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a3e',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3a3a4e',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00d4ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  profilePhone: {
    color: '#999',
    fontSize: 12,
    marginBottom: 2,
  },
  profileParty: {
    color: '#00d4ff',
    fontSize: 12,
    fontWeight: '500',
  },
  settingsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2a2a3e',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#3a3a4e',
  },
  settingLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  settingDescription: {
    color: '#999',
    fontSize: 12,
    marginTop: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a3e',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#3a3a4e',
  },
  menuIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  menuText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  menuArrow: {
    color: '#999',
    fontSize: 18,
  },
  logoutButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#ff3333',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  appInfoText: {
    color: '#999',
    fontSize: 12,
    marginBottom: 4,
  },
});

export default SettingsScreen;
