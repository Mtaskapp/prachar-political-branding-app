import React, { useState, useRef, useEffect } from 'react';
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
import { setLoading, setError, setAuthToken } from '@redux/slices/authSlice';
import authService from '@services/authService';

interface OTPVerificationScreenProps {
  navigation: any;
  route: any;
}

const OTPVerificationScreen: React.FC<OTPVerificationScreenProps> = ({
  navigation,
  route,
}) => {
  const { phoneNumber } = route.params;
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleVerifyOTP = async () => {
    if (!otp.trim() || otp.length < 4) {
      Alert.alert('Error', 'Please enter a valid OTP');
      return;
    }

    setIsLoading(true);
    try {
      dispatch(setLoading(true));
      const response = await authService.verifyOTP(phoneNumber, otp);

      if (response.success) {
        dispatch(setAuthToken(response.data.token));
        Alert.alert('Success', 'OTP verified successfully');
        navigation.navigate('UserProfile', { phoneNumber });
      } else {
        Alert.alert('Error', response.message || 'Invalid OTP');
        dispatch(setError(response.message));
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Alert.alert('Error', 'Failed to verify OTP. Please try again.');
      dispatch(setError('Failed to verify OTP'));
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  };

  const handleResendOTP = async () => {
    setTimer(60);
    setCanResend(false);
    try {
      const response = await authService.sendOTP(phoneNumber);
      if (response.success) {
        Alert.alert('Success', 'OTP resent to your phone number');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>
            We sent a code to {phoneNumber}
          </Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Enter OTP</Text>
          <TextInput
            style={styles.otpInput}
            placeholder="0000"
            placeholderTextColor="#999"
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
            editable={!isLoading}
          />
          <Text style={styles.helperText}>Check your SMS messages</Text>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleVerifyOTP}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Verify OTP</Text>
            )}
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive code?</Text>
            <TouchableOpacity
              onPress={handleResendOTP}
              disabled={!canResend}
            >
              <Text
                style={[
                  styles.resendButton,
                  !canResend && styles.resendButtonDisabled,
                ]}
              >
                {canResend ? 'Resend OTP' : `Resend in ${timer}s`}
              </Text>
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
    paddingVertical: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backText: {
    color: '#00d4ff',
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    marginBottom: 40,
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
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  otpInput: {
    backgroundColor: '#2a2a3e',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3a3a4e',
    padding: 14,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00d4ff',
    letterSpacing: 10,
    textAlign: 'center',
    marginBottom: 12,
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
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  resendText: {
    color: '#999',
    fontSize: 12,
    marginRight: 4,
  },
  resendButton: {
    color: '#00d4ff',
    fontSize: 12,
    fontWeight: '600',
  },
  resendButtonDisabled: {
    color: '#666',
  },
});

export default OTPVerificationScreen;
