import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  FlatList,
} from 'react-native';
import socialShareService from '@services/socialShareService';

interface ShareOptionsScreenProps {
  navigation: any;
  route: any;
}

const SHARE_OPTIONS = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: '💬',
    color: '#25D366',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: '📘',
    color: '#1877F2',
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    icon: '𝕏',
    color: '#000000',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📷',
    color: '#E4405F',
  },
  {
    id: 'sms',
    name: 'SMS',
    icon: '💌',
    color: '#00A8E1',
  },
  {
    id: 'email',
    name: 'Email',
    icon: '📧',
    color: '#EA4335',
  },
];

const ShareOptionsScreen: React.FC<ShareOptionsScreenProps> = ({
  navigation,
  route,
}) => {
  const { campaignId } = route.params;

  const handleShare = async (platform: string) => {
    const message =
      'Check out this amazing campaign material created with Prachar! 🗳️';

    try {
      switch (platform) {
        case 'whatsapp':
          await socialShareService.shareToWhatsApp(message);
          break;
        case 'facebook':
          await socialShareService.shareToFacebook(message);
          break;
        case 'twitter':
          await socialShareService.shareToX(message);
          break;
        case 'instagram':
          // Instagram sharing requires file path
          Alert.alert('Share', 'Opening Instagram...');
          break;
        default:
          await socialShareService.shareToApp({ message });
      }
    } catch (error) {
      Alert.alert('Error', `Failed to share to ${platform}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Share Campaign</Text>
          <View style={styles.placeholder} />
        </View>

        <Text style={styles.subtitle}>
          Share your campaign material on social media
        </Text>

        <View style={styles.optionsContainer}>
          <FlatList
            data={SHARE_OPTIONS}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            numColumns={3}
            columnWrapperStyle={styles.columnWrapper}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.shareOption}
                onPress={() => handleShare(item.id)}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: item.color + '20' },
                  ]}
                >
                  <Text style={styles.icon}>{item.icon}</Text>
                </View>
                <Text style={styles.optionName}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>💡 Tips for Sharing</Text>
          <Text style={styles.infoText}>
            • Share during peak engagement hours
          </Text>
          <Text style={styles.infoText}>
            • Use relevant hashtags in your message
          </Text>
          <Text style={styles.infoText}>
            • Encourage supporters to share with their network
          </Text>
          <Text style={styles.infoText}>
            • Track engagement through social media analytics
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.continueButtonText}>Back to Home</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
  subtitle: {
    color: '#999',
    fontSize: 13,
    marginBottom: 24,
    textAlign: 'center',
  },
  optionsContainer: {
    marginBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  shareOption: {
    width: '30%',
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 32,
  },
  optionName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#2a2a3e',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#00d4ff',
  },
  infoTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    color: '#999',
    fontSize: 12,
    marginBottom: 4,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#3a3a4e',
  },
  continueButton: {
    backgroundColor: '#00d4ff',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#1a1a2e',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default ShareOptionsScreen;
