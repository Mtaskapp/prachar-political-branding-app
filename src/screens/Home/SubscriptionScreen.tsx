import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAppDispatch } from '@redux/hooks';
import { setLoading } from '@redux/slices/authSlice';

interface SubscriptionScreenProps {
  navigation: any;
}

interface Plan {
  id: string;
  name: string;
  price: string;
  duration: string;
  features: string[];
  isPopular?: boolean;
}

const SUBSCRIPTION_PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    duration: 'Forever',
    features: [
      '5 posters per month',
      '2 videos per month',
      'Basic templates',
      'Standard quality export',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '₹199',
    duration: 'Per month',
    features: [
      'Unlimited posters',
      'Unlimited videos',
      'All templates',
      '4K quality export',
      'Priority support',
      'No watermark',
      'Advanced editing tools',
    ],
    isPopular: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: '₹999',
    duration: 'Per month',
    features: [
      'Everything in Premium',
      'Team collaboration',
      'Custom branding',
      'API access',
      'Dedicated support',
      'Analytics dashboard',
    ],
  },
];

const SubscriptionScreen: React.FC<SubscriptionScreenProps> = ({ navigation }) => {
  const [selectedPlan, setSelectedPlan] = useState('free');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleSelectPlan = (planId: string) => {
    if (planId === 'free') {
      navigation.navigate('Home');
    } else {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert(
          'Subscription',
          `You selected ${planId} plan. Proceeding to payment...`
        );
        // TODO: Implement payment gateway integration
        navigation.navigate('Home');
      }, 1500);
    }
  };

  const handleSkip = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Plan</Text>
          <Text style={styles.subtitle}>
            Unlock powerful features to create amazing campaigns
          </Text>
        </View>

        <View style={styles.plansContainer}>
          {SUBSCRIPTION_PLANS.map((plan) => (
            <View
              key={plan.id}
              style={[
                styles.planCard,
                plan.isPopular && styles.popularPlan,
              ]}
            >
              {plan.isPopular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>Most Popular</Text>
                </View>
              )}

              <Text style={styles.planName}>{plan.name}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>{plan.price}</Text>
                <Text style={styles.duration}>/{plan.duration}</Text>
              </View>

              <View style={styles.featuresContainer}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Text style={styles.featureCheck}>✓</Text>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={[
                  styles.selectButton,
                  plan.id === 'premium' && styles.selectButtonPrimary,
                ]}
                onPress={() => handleSelectPlan(plan.id)}
                disabled={isLoading}
              >
                {isLoading && selectedPlan === plan.id ? (
                  <ActivityIndicator color="#1a1a2e" />
                ) : (
                  <Text
                    style={[
                      styles.selectButtonText,
                      plan.id === 'premium' && styles.selectButtonTextPrimary,
                    ]}
                  >
                    {plan.id === 'free' ? 'Get Started' : 'Subscribe Now'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          disabled={isLoading}
        >
          <Text style={styles.skipButtonText}>Skip for Now</Text>
        </TouchableOpacity>
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
  plansContainer: {
    marginBottom: 30,
  },
  planCard: {
    backgroundColor: '#2a2a3e',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3a3a4e',
  },
  popularPlan: {
    borderColor: '#00d4ff',
    borderWidth: 2,
  },
  popularBadge: {
    backgroundColor: '#00d4ff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  popularBadgeText: {
    color: '#1a1a2e',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00d4ff',
  },
  duration: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureCheck: {
    color: '#00d4ff',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
  },
  featureText: {
    color: '#ccc',
    fontSize: 13,
    flex: 1,
  },
  selectButton: {
    backgroundColor: '#3a3a4e',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4a4a5e',
  },
  selectButtonPrimary: {
    backgroundColor: '#00d4ff',
    borderColor: '#00d4ff',
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  selectButtonTextPrimary: {
    color: '#1a1a2e',
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  skipButtonText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default SubscriptionScreen;
