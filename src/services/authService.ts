// Authentication Service - OTP and Login
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://api.prachar.app'; // Replace with your API

interface AuthResponse {
  success: boolean;
  message: string;
  data?: any;
}

interface User {
  id: string;
  phoneNumber: string;
  name: string;
  state: string;
  constituency: string;
  party: string;
  isVerified: boolean;
}

class AuthService {
  // Send OTP to phone number
  async sendOTP(phoneNumber: string): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/send-otp`, {
        phoneNumber: phoneNumber.replace(/\D/g, ''),
      });
      return response.data;
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  }

  // Verify OTP and get auth token
  async verifyOTP(phoneNumber: string, otp: string): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
        phoneNumber: phoneNumber.replace(/\D/g, ''),
        otp,
      });

      if (response.data.success) {
        // Save token to AsyncStorage
        await AsyncStorage.setItem('authToken', response.data.data.token);
        await AsyncStorage.setItem('userId', response.data.data.userId);
      }

      return response.data;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  }

  // Update user profile
  async updateUserProfile(userId: string, profile: Partial<User>): Promise<AuthResponse> {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axios.put(
        `${API_BASE_URL}/user/${userId}/profile`,
        profile,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  // Get user profile
  async getUserProfile(userId: string): Promise<User> {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE_URL}/user/${userId}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userId');
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem('authToken');
    return !!token;
  }
}

export default new AuthService();
