import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { addCampaign, setCurrentCampaign } from '@redux/slices/campaignSlice';
import { setTemplates, setPartyLogos } from '@redux/slices/templateSlice';
import imageService from '@services/imageService';
import databaseService from '@services/databaseService';

interface PosterEditorScreenProps {
  navigation: any;
  route: any;
}

const PosterEditorScreen: React.FC<PosterEditorScreenProps> = ({
  navigation,
  route,
}) => {
  const campaignId = route.params?.campaignId;
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { templates, partyLogos } = useAppSelector(
    (state) => state.template
  );

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [posterImage, setPosterImage] = useState(null);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [slogan, setSlogan] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'template' | 'logo' | 'edit'>('upload');
  const [showBackgroundRemoval, setShowBackgroundRemoval] = useState(false);

  const handleUploadImage = async () => {
    try {
      const image = await imageService.pickImage({
        width: 1080,
        height: 1080,
      });
      setPosterImage(image.path);
      setActiveTab('template');
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleRemoveBackground = async () => {
    if (!posterImage) {
      Alert.alert('Error', 'Please upload an image first');
      return;
    }

    try {
      const processedImage = await imageService.removeBackground(posterImage);
      setPosterImage(processedImage.path);
      Alert.alert('Success', 'Background removed successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to remove background');
    }
  };

  const handleCropImage = async () => {
    if (!posterImage) {
      Alert.alert('Error', 'Please upload an image first');
      return;
    }

    try {
      const croppedImage = await imageService.cropImage(
        posterImage,
        800,
        600
      );
      setPosterImage(croppedImage.path);
    } catch (error) {
      Alert.alert('Error', 'Failed to crop image');
    }
  };

  const handleSelectTemplate = (template: any) => {
    setSelectedTemplate(template);
    setActiveTab('logo');
  };

  const handleSelectLogo = (logo: any) => {
    setSelectedLogo(logo);
    setActiveTab('edit');
  };

  const handleSaveAsDraft = async () => {
    if (!posterImage) {
      Alert.alert('Error', 'Please upload an image to save');
      return;
    }

    const campaignData = {
      id: campaignId || `campaign_${Date.now()}`,
      userId: user?.id,
      title: `Poster - ${new Date().toLocaleDateString()}`,
      description: slogan,
      type: 'poster',
      templateId: selectedTemplate?.id,
      content: {
        image: posterImage,
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
      Alert.alert('Success', 'Poster saved as draft');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save draft');
    }
  };

  const handlePublish = async () => {
    if (!posterImage) {
      Alert.alert('Error', 'Please upload an image to publish');
      return;
    }

    const campaignData = {
      id: campaignId || `campaign_${Date.now()}`,
      userId: user?.id,
      title: `Poster - ${new Date().toLocaleDateString()}`,
      description: slogan,
      type: 'poster',
      templateId: selectedTemplate?.id,
      content: {
        image: posterImage,
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
      Alert.alert('Success', 'Poster published successfully');
      navigation.navigate('ShareOptions', { campaignId: campaignData.id });
    } catch (error) {
      Alert.alert('Error', 'Failed to publish poster');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Create Poster</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Preview */}
      <View style={styles.previewContainer}>
        {posterImage ? (
          <Image source={{ uri: posterImage }} style={styles.previewImage} />
        ) : (
          <View style={styles.previewPlaceholder}>
            <Text style={styles.previewIcon}>🖼️</Text>
            <Text style={styles.previewText}>Upload or select an image</Text>
          </View>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {['upload', 'template', 'logo', 'edit'].map((tab) => (
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
              onPress={handleUploadImage}
            >
              <Text style={styles.uploadIcon}>📤</Text>
              <Text style={styles.uploadText}>Upload Image</Text>
            </TouchableOpacity>

            {posterImage && (
              <View style={styles.imageToolsContainer}>
                <TouchableOpacity
                  style={styles.toolButton}
                  onPress={handleCropImage}
                >
                  <Text style={styles.toolIcon}>✂️</Text>
                  <Text style={styles.toolText}>Crop Image</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.toolButton}
                  onPress={handleRemoveBackground}
                >
                  <Text style={styles.toolIcon}>🎨</Text>
                  <Text style={styles.toolText}>Remove BG</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {activeTab === 'template' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Party Templates</Text>
            <FlatList
              data={templates.filter((t) => t.partyId === user?.party)}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.templateCard,
                    selectedTemplate?.id === item.id &&
                      styles.selectedTemplate,
                  ]}
                  onPress={() => handleSelectTemplate(item)}
                >
                  {item.thumbnail && (
                    <Image
                      source={{ uri: item.thumbnail }}
                      style={styles.templateThumbnail}
                    />
                  )}
                  <Text style={styles.templateName}>{item.templateName}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {activeTab === 'logo' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Party Logo & Slogan</Text>
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
                  {item.logoUrl && (
                    <Image
                      source={{ uri: item.logoUrl }}
                      style={styles.logoImage}
                    />
                  )}
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
            <Text style={styles.sectionTitle}>Edit Slogan</Text>
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
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
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
  imageToolsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  toolButton: {
    flex: 1,
    backgroundColor: '#2a2a3e',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3a3a4e',
  },
  toolIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  toolText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  templateCard: {
    backgroundColor: '#2a2a3e',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3a3a4e',
    overflow: 'hidden',
  },
  selectedTemplate: {
    borderColor: '#00d4ff',
    borderWidth: 2,
  },
  templateThumbnail: {
    width: '100%',
    height: 150,
  },
  templateName: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
    padding: 8,
  },
  logoCard: {
    backgroundColor: '#2a2a3e',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3a3a4e',
  },
  selectedLogo: {
    borderColor: '#00d4ff',
    borderWidth: 2,
  },
  logoImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
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

export default PosterEditorScreen;
