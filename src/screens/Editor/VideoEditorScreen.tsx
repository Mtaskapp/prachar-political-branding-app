import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  FlatList,
  TextInput,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { addCampaign } from '@redux/slices/campaignSlice';
import databaseService from '@services/databaseService';

interface VideoEditorScreenProps {
  navigation: any;
  route: any;
}

const VideoEditorScreen: React.FC<VideoEditorScreenProps> = ({
  navigation,
  route,
}) => {
  const campaignId = route.params?.campaignId;
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { partyLogos } = useAppSelector((state) => state.template);

  const [videoFile, setVideoFile] = useState(null);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [slogan, setSlogan] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'logo' | 'edit'>(
    'upload'
  );

  const handleUploadVideo = async () => {
    try {
      Alert.alert('Upload Video', 'Video upload functionality coming soon!');
      setActiveTab('logo');
    } catch (error) {
      Alert.alert('Error', 'Failed to upload video');
    }
  };

  const handleSelectLogo = (logo: any) => {
    setSelectedLogo(logo);
    setActiveTab('edit');
  };

  const handleSaveAsDraft = async () => {
    if (!videoFile) {
      Alert.alert('Error', 'Please upload a video to save');
      return;
    }

    const campaignData = {
      id: campaignId || `campaign_${Date.now()}`,
      userId: user?.id,
      title: `Video - ${new Date().toLocaleDateString()}`,
      description: slogan,
      type: 'video',
      templateId: '',
      content: {
        video: videoFile,
        logo: selectedLogo,
        slogan,
      },
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await databaseService.insertCampaign(campaignData);
      dispatch(addCampaign(campaignData as any));
      Alert.alert('Success', 'Video saved as draft');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save draft');
    }
  };

  const handlePublish = async () => {
    if (!videoFile) {
      Alert.alert('Error', 'Please upload a video to publish');
      return;
    }

    const campaignData = {
      id: campaignId || `campaign_${Date.now()}`,
      userId: user?.id,
      title: `Video - ${new Date().toLocaleDateString()}`,
      description: slogan,
      type: 'video',
      templateId: '',
      content: {
        video: videoFile,
        logo: selectedLogo,
        slogan,
      },
      status: 'completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await databaseService.insertCampaign(campaignData);
      dispatch(addCampaign(campaignData as any));
      Alert.alert('Success', 'Video published successfully');
      navigation.navigate('ShareOptions', { campaignId: campaignData.id });
    } catch (error) {
      Alert.alert('Error', 'Failed to publish video');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Create Video</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Preview */}
      <View style={styles.previewContainer}>
        {videoFile ? (
          <View style={styles.videoPreview}>
            <Text style={styles.videoIcon}>🎬</Text>
            <Text style={styles.videoFileName}>Video Uploaded</Text>
          </View>
        ) : (
          <View style={styles.previewPlaceholder}>
            <Text style={styles.previewIcon}>🎥</Text>
            <Text style={styles.previewText}>Upload or record a video</Text>
          </View>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {['upload', 'logo', 'edit'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              activeTab === tab && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab(tab as any)}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === tab && styles.activeTabButtonText,
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'upload' && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleUploadVideo}
            >
              <Text style={styles.uploadIcon}>🎬</Text>
              <Text style={styles.uploadText}>Upload Video</Text>
            </TouchableOpacity>
            <Text style={styles.uploadHint}>
              Supported formats: MP4, WebM, MOV (Max 100MB)
            </Text>
          </View>
        )}

        {activeTab === 'logo' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Party Logo & Watermark</Text>
            <FlatList
              data={partyLogos.filter((l) => l.partyId === user?.party)}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.logoCard,
                    selectedLogo?.id === item.id && styles.selectedLogo,
                  ]}
                  onPress={() => handleSelectLogo(item)}
                >
                  <View>
                    <Text style={styles.logoSlogan}>{item.slogan}</Text>
                    <View
                      style={[
                        styles.colorDot,
                        { backgroundColor: item.color },
                      ]}
                    />
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {activeTab === 'edit' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Edit Video Title & Slogan</Text>
            <TextInput
              style={styles.sloganInput}
              placeholder="Enter your campaign slogan"
              placeholderTextColor="#999"
              value={slogan}
              onChangeText={setSlogan}
              multiline
              maxLength={200}
            />
            <Text style={styles.charCount}>
              {slogan.length}/200 characters
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.draftButton}
          onPress={handleSaveAsDraft}
        >
          <Text style={styles.draftButtonText}>Save Draft</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.publishButton} onPress={handlePublish}>
          <Text style={styles.publishButtonText}>Publish</Text>
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
    fontSize: 16,
    fontWeight: '600',
  },
  placeholder: {
    width: 30,
  },
  previewContainer: {
    height: 300,
    backgroundColor: '#2a2a3e',
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a4e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPreview: {
    alignItems: 'center',
  },
  videoIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  videoFileName: {
    color: '#00d4ff',
    fontSize: 14,
  },
  previewPlaceholder: {
    alignItems: 'center',
  },
  previewIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  previewText: {
    color: '#999',
    fontSize: 14,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#2a2a3e',
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a4e',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: '#00d4ff',
  },
  tabButtonText: {
    color: '#999',
    fontSize: 12,
    fontWeight: '500',
  },
  activeTabButtonText: {
    color: '#00d4ff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  uploadButton: {
    backgroundColor: '#2a2a3e',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00d4ff',
    borderStyle: 'dashed',
  },
  uploadIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  uploadText: {
    color: '#00d4ff',
    fontSize: 14,
    fontWeight: '600',
  },
  uploadHint: {
    color: '#999',
    fontSize: 12,
    marginTop: 8,
  },
  logoCard: {
    backgroundColor: '#2a2a3e',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3a3a4e',
  },
  selectedLogo: {
    borderColor: '#00d4ff',
    borderWidth: 2,
  },
  logoSlogan: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  sloganInput: {
    backgroundColor: '#2a2a3e',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3a3a4e',
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 14,
    minHeight: 100,
  },
  charCount: {
    color: '#999',
    fontSize: 11,
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#3a3a4e',
  },
  draftButton: {
    flex: 1,
    backgroundColor: '#3a3a4e',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  draftButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  publishButton: {
    flex: 1,
    backgroundColor: '#00d4ff',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  publishButtonText: {
    color: '#1a1a2e',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default VideoEditorScreen;
