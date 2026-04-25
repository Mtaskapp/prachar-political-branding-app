import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useAppDispatch } from '@redux/hooks';
import { setLoading, setUser } from '@redux/slices/authSlice';
import authService from '@services/authService';

interface UserProfileScreenProps {
  navigation: any;
  route: any;
}

const STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

const PARTIES = [
  'BJP',
  'INC',
  'AAP',
  'DMK',
  'AIADMK',
  'TMC',
  'BJD',
  'JDU',
  'RJD',
  'SS',
  'NCP',
  'SP',
  'BSP',
  'TDP',
  'CPI(M)',
  'Other',
];

const UserProfileScreen: React.FC<UserProfileScreenProps> = ({
  navigation,
  route,
}) => {
  const { phoneNumber } = route.params;
  const [name, setName] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedConstituency, setSelectedConstituency] = useState('');
  const [selectedParty, setSelectedParty] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showPartyDropdown, setShowPartyDropdown] = useState(false);
  const dispatch = useAppDispatch();

  const handleCreateProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    if (!selectedState) {
      Alert.alert('Error', 'Please select your state');
      return;
    }
    if (!selectedConstituency.trim()) {
      Alert.alert('Error', 'Please enter your constituency');
      return;
    }
    if (!selectedParty) {
      Alert.alert('Error', 'Please select your party');
      return;
    }

    setIsLoading(true);
    try {
      dispatch(setLoading(true));
      const response = await authService.updateUserProfile('user-id', {
        name,
        state: selectedState,
        constituency: selectedConstituency,
        party: selectedParty,
        phoneNumber,
      });

      if (response.success) {
        dispatch(
          setUser({
            id: response.data.userId,
            phoneNumber,
            name,
            state: selectedState,
            constituency: selectedConstituency,
            party: selectedParty,
            isVerified: false,
          })
        );
        Alert.alert('Success', 'Profile created successfully');
        navigation.navigate('SubscriptionScreen');
      } else {
        Alert.alert('Error', response.message || 'Failed to create profile');
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      Alert.alert('Error', 'Failed to create profile. Please try again.');
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Your Profile</Text>
          <Text style={styles.subtitle}>
            Tell us about yourself to get started
          </Text>
        </View>

        <View style={styles.formContainer}>
          {/* Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
              editable={!isLoading}
            />
          </View>

          {/* State Dropdown */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Select State</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowStateDropdown(!showStateDropdown)}
            >
              <Text
                style={[
                  styles.dropdownText,
                  !selectedState && styles.placeholderText,
                ]}
              >
                {selectedState || 'Select your state'}
              </Text>
              <Text style={styles.dropdownIcon}>
                {showStateDropdown ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>
            {showStateDropdown && (
              <View style={styles.dropdownMenu}>
                <FlatList
                  data={STATES}
                  keyExtractor={(item) => item}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedState(item);
                        setShowStateDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>

          {/* Constituency Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Constituency</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your constituency"
              placeholderTextColor="#999"
              value={selectedConstituency}
              onChangeText={setSelectedConstituency}
              editable={!isLoading}
            />
          </View>

          {/* Party Dropdown */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Select Party</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowPartyDropdown(!showPartyDropdown)}
            >
              <Text
                style={[
                  styles.dropdownText,
                  !selectedParty && styles.placeholderText,
                ]}
              >
                {selectedParty || 'Select your party'}
              </Text>
              <Text style={styles.dropdownIcon}>
                {showPartyDropdown ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>
            {showPartyDropdown && (
              <View style={styles.dropdownMenu}>
                <FlatList
                  data={PARTIES}
                  keyExtractor={(item) => item}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedParty(item);
                        setShowPartyDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleCreateProfile}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#1a1a2e" />
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </TouchableOpacity>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
  },
  formContainer: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#2a2a3e',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3a3a4e',
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#fff',
  },
  dropdown: {
    backgroundColor: '#2a2a3e',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3a3a4e',
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 14,
    color: '#fff',
    flex: 1,
  },
  placeholderText: {
    color: '#999',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#00d4ff',
  },
  dropdownMenu: {
    backgroundColor: '#2a2a3e',
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#3a3a4e',
    maxHeight: 200,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a4e',
  },
  dropdownItemText: {
    color: '#fff',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#00d4ff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#0088aa',
    opacity: 0.6,
  },
  buttonText: {
    color: '#1a1a2e',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UserProfileScreen;
