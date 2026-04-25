import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAppDispatch } from '@redux/hooks';
import { setLoading, setError } from '@redux/slices/authSlice';
import authService from '@services/authService';

interface PhoneLoginScreenProps {
  navigation: any;
}

const PhoneLoginScreen: React.FC<PhoneLoginScreenProps> = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  };

  const handleSendOTP = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    try {
      dispatch(setLoading(true));
      const response = await authService.sendOTP(phoneNumber);

      if (response.success) {
        Alert.alert('Success', 'OTP sent to your phone number');
        navigation.navigate('OTPVerification', { phoneNumber });
      } else {
        Alert.alert('Error', response.message || 'Failed to send OTP');
        dispatch(setError(response.message));
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
      dispatch(setError('Failed to send OTP'));
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Prachar</Text>
        <Text style={styles.subtitle}>Political Branding App</Text>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Enter Your Phone Number</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.countryCode}>+91</Text>
            <TextInput
              style={styles.phoneInput}
              placeholder="9876543210"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              maxLength={10}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              editable={!isLoading}
            />
          </View>
          <Text style={styles.helperText}>We'll send you an OTP for verification</Text>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSendOTP}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send OTP</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>By continuing, you agree to our</Text>
          <View style={styles.links}>
            <TouchableOpacity>
              <Text style={styles.link}>Terms of Service</Text>
            </TouchableOpacity>
            <Text style={styles.separator}>•</Text>
            <TouchableOpacity>
              <Text style={styles.link}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00d4ff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 40,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a3e',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3a3a4e',
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  countryCode: {
    color: '#00d4ff',
    fontWeight: '600',
    fontSize: 16,
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 14,
    paddingRight: 12,
    fontSize: 16,
    color: '#fff',
  },
  helperText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#00d4ff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
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
  footer: {
    alignItems: 'center',
  },
  footerText: {
    color: '#999',
    fontSize: 12,
    marginBottom: 8,
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  link: {
    color: '#00d4ff',
    fontSize: 12,
    marginHorizontal: 8,
  },
  separator: {
    color: '#999',
  },
});

export default PhoneLoginScreen;
