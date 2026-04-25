import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  TextInput,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { addTemplate, setPartyLogos } from '@redux/slices/templateSlice';
import imageService from '@services/imageService';
import databaseService from '@services/databaseService';

interface OfficialPartyPanelScreenProps {
  navigation: any;
}

const OfficialPartyPanelScreen: React.FC<OfficialPartyPanelScreenProps> = ({
  navigation,
}) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { templates, partyLogos } = useAppSelector(
    (state) => state.template
  );
  const [activeTab, setActiveTab] = useState<'templates' | 'logos' | 'upload'>(
    'templates'
  );
  const [templateName, setTemplateName] = useState('');
  const [templateImage, setTemplateImage] = useState(null);
  const [sloganText, setSloganText] = useState('');
  const [sloganColor, setSloganColor] = useState('#FF9900');
  const [isLoading, setIsLoading] = useState(false);

  const handleUploadTemplate = async () => {
    if (!templateName.trim()) {
      Alert.alert('Error', 'Please enter template name');
      return;
    }
    if (!templateImage) {
      Alert.alert('Error', 'Please upload a template image');
      return;
    }

    setIsLoading(true);
    try {
      const newTemplate = {
        id: `template_${Date.now()}`,
        partyId: user?.party,
        templateName,
        category: 'party',
        thumbnail: templateImage,
        content: {},
        isOfficial: true,
        createdAt: new Date().toISOString(),
      };

      await databaseService.insertCampaign({
        id: newTemplate.id,
        userId: user?.id,
        title: newTemplate.templateName,
        description: 'Official party template',
        type: 'poster',
        templateId: newTemplate.id,
        content: newTemplate,
        status: 'completed',
        createdAt: newTemplate.createdAt,
        updatedAt: new Date().toISOString(),
      });

      dispatch(addTemplate(newTemplate as any));
      Alert.alert(
        'Success',
        'Template uploaded and will be visible to all party members'
      );
      setTemplateName('');
      setTemplateImage(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to upload template');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadLogo = async () => {
    if (!sloganText.trim()) {
      Alert.alert('Error', 'Please enter slogan');
      return;
    }

    setIsLoading(true);
    try {
      const newLogo = {
        id: `logo_${Date.now()}`,
        partyId: user?.party,
        logoUrl: templateImage || 'https://via.placeholder.com/100x100',
        slogan: sloganText,
        color: sloganColor,
        createdAt: new Date().toISOString(),
      };

      dispatch(setPartyLogos([...partyLogos, newLogo] as any));
      Alert.alert(
        'Success',
        'Logo and slogan uploaded and visible to all party members in ' +
          user?.state
      );
      setSloganText('');
      setSloganColor('#FF9900');
      setTemplateImage(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to upload logo');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePickImage = async () => {
    try {
      const image = await imageService.pickImage();
      setTemplateImage(image.path);
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Official Party Panel</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Badge */}
        <View style={styles.badgeContainer}>
          <View style={styles.officialBadge}>
            <Text style={styles.badgeText}>✓ Official {user?.party} Member</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {['templates', 'logos', 'upload'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && styles.activeTab,
              ]}
              onPress={() => setActiveTab(tab as any)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {activeTab === 'templates' && (
            <View>
              <Text style={styles.sectionTitle}>Available Templates</Text>
              {templates.filter((t) => t.partyId === user?.party).length > 0 ? (
                <FlatList
                  data={templates.filter((t) => t.partyId === user?.party)}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <View style={styles.templateCard}>
                      {item.thumbnail && (
                        <Image
                          source={{ uri: item.thumbnail }}
                          style={styles.templateThumbnail}
                        />
                      )}
                      <View style={styles.templateInfo}>
                        <Text style={styles.templateName}>
                          {item.templateName}
                        </Text>
                        <Text style={styles.templateDate}>
                          Uploaded by Official Member
                        </Text>
                      </View>
                    </View>
                  )}
                />
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No templates yet</Text>
                </View>
              )}
            </View>
          )}

          {activeTab === 'logos' && (
            <View>
              <Text style={styles.sectionTitle}>Party Logos & Slogans</Text>
              {partyLogos.filter((l) => l.partyId === user?.party).length >
              0 ? (
                <FlatList
                  data={partyLogos.filter((l) => l.partyId === user?.party)}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <View style={styles.logoCard}>
                      <View style={styles.logoContent}>
                        <Text style={styles.logoSlogan}>{item.slogan}</Text>
                        <View
                          style={[
                            styles.colorSwatch,
                            { backgroundColor: item.color },
                          ]}
                        />
                      </View>
                    </View>
                  )}
                />
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No logos uploaded yet</Text>
                </View>
              )}
            </View>
          )}

          {activeTab === 'upload' && (
            <View style={styles.uploadSection}>
              <View style={styles.uploadCard}>
                <Text style={styles.uploadCardTitle}>
                  Upload New Template
                </Text>

                <TouchableOpacity
                  style={styles.pickImageButton}
                  onPress={handlePickImage}
                >
                  {templateImage ? (
                    <Image
                      source={{ uri: templateImage }}
                      style={styles.uploadedImage}
                    />
                  ) : (
                    <>
                      <Text style={styles.pickImageIcon}>📸</Text>
                      <Text style={styles.pickImageText}>Pick Template Image</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TextInput
                  style={styles.input}
                  placeholder="Template Name"
                  placeholderTextColor="#999"
                  value={templateName}
                  onChangeText={setTemplateName}
                />

                <TouchableOpacity
                  style={[styles.uploadButton, isLoading && styles.disabled]}
                  onPress={handleUploadTemplate}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#1a1a2e" />
                  ) : (
                    <Text style={styles.uploadButtonText}>Upload Template</Text>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.uploadCard}>
                <Text style={styles.uploadCardTitle}>
                  Upload Party Logo & Slogan
                </Text>

                <TouchableOpacity
                  style={styles.pickImageButton}
                  onPress={handlePickImage}
                >
                  {templateImage ? (
                    <Image
                      source={{ uri: templateImage }}
                      style={styles.uploadedImage}
                    />
                  ) : (
                    <>
                      <Text style={styles.pickImageIcon}>🎨</Text>
                      <Text style={styles.pickImageText}>Pick Logo Image</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TextInput
                  style={styles.input}
                  placeholder="Enter Slogan"
                  placeholderTextColor="#999"
                  value={sloganText}
                  onChangeText={setSloganText}
                />

                <View style={styles.colorPicker}>
                  <Text style={styles.colorLabel}>Color:</Text>
                  <TouchableOpacity
                    style={[
                      styles.colorOption,
                      { backgroundColor: '#FF9900' },
                      sloganColor === '#FF9900' && styles.selectedColor,
                    ]}
                    onPress={() => setSloganColor('#FF9900')}
                  />
                  <TouchableOpacity
                    style={[
                      styles.colorOption,
                      { backgroundColor: '#3366CC' },
                      sloganColor === '#3366CC' && styles.selectedColor,
                    ]}
                    onPress={() => setSloganColor('#3366CC')}
                  />
                  <TouchableOpacity
                    style={[
                      styles.colorOption,
                      { backgroundColor: '#00C853' },
                      sloganColor === '#00C853' && styles.selectedColor,
                    ]}
                    onPress={() => setSloganColor('#00C853')}
                  />
                  <TouchableOpacity
                    style={[
                      styles.colorOption,
                      { backgroundColor: '#FF0000' },
                      sloganColor === '#FF0000' && styles.selectedColor,
                    ]}
                    onPress={() => setSloganColor('#FF0000')}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.uploadButton, isLoading && styles.disabled]}
                  onPress={handleUploadLogo}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#1a1a2e" />
                  ) : (
                    <Text style={styles.uploadButtonText}>
                      Upload Logo & Slogan
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
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
  badgeContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  officialBadge: {
    backgroundColor: '#00d4ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#1a1a2e',
    fontSize: 12,
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a4e',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#00d4ff',
  },
  tabText: {
    color: '#999',
    fontSize: 12,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#00d4ff',
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  templateCard: {
    backgroundColor: '#2a2a3e',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#3a3a4e',
  },
  templateThumbnail: {
    width: '100%',
    height: 150,
  },
  templateInfo: {
    padding: 12,
  },
  templateName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  templateDate: {
    color: '#999',
    fontSize: 11,
    marginTop: 4,
  },
  logoCard: {
    backgroundColor: '#2a2a3e',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3a3a4e',
  },
  logoContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoSlogan: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  colorSwatch: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
  },
  uploadSection: {
    gap: 20,
  },
  uploadCard: {
    backgroundColor: '#2a2a3e',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#3a3a4e',
  },
  uploadCardTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  pickImageButton: {
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#00d4ff',
    borderStyle: 'dashed',
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  pickImageIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  pickImageText: {
    color: '#00d4ff',
    fontSize: 12,
    fontWeight: '600',
  },
  uploadedImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  input: {
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3a3a4e',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 13,
    marginBottom: 12,
  },
  colorPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  colorLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#fff',
  },
  uploadButton: {
    backgroundColor: '#00d4ff',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#1a1a2e',
    fontWeight: '600',
    fontSize: 14,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default OfficialPartyPanelScreen;
