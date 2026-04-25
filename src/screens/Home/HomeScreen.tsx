import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { setCampaigns } from '@redux/slices/campaignSlice';
import databaseService from '@services/databaseService';

interface HomeScreenProps {
  navigation: any;
}

interface Campaign {
  id: string;
  title: string;
  description: string;
  type: 'poster' | 'video';
  status: 'draft' | 'completed';
  thumbnail?: string;
  updatedAt: string;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { campaigns, draftCount, completedCount } = useAppSelector(
    (state) => state.campaign
  );
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<'all' | 'drafts' | 'completed'>(
    'all'
  );
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadCampaigns();
    }, [])
  );

  const loadCampaigns = async () => {
    try {
      setIsLoading(true);
      await databaseService.initDatabase();
      // Load campaigns from database
      // const userCampaigns = await databaseService.getCampaignsByUser(user?.id);
      // dispatch(setCampaigns(userCampaigns));
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredCampaigns = () => {
    switch (activeTab) {
      case 'drafts':
        return campaigns.filter((c) => c.status === 'draft');
      case 'completed':
        return campaigns.filter((c) => c.status === 'completed');
      default:
        return campaigns;
    }
  };

  const handleCreateNew = () => {
    Alert.alert('Create Campaign', 'What would you like to create?', [
      {
        text: 'Poster',
        onPress: () => navigation.navigate('PosterEditor'),
      },
      {
        text: 'Video',
        onPress: () => navigation.navigate('VideoEditor'),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleCampaignPress = (campaign: Campaign) => {
    if (campaign.type === 'poster') {
      navigation.navigate('PosterEditor', { campaignId: campaign.id });
    } else {
      navigation.navigate('VideoEditor', { campaignId: campaign.id });
    }
  };

  const filteredCampaigns = getFilteredCampaigns();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name || 'User'}!</Text>
            <Text style={styles.subGreeting}>
              {user?.party} • {user?.state}
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <View style={styles.settingsIcon}>
              <Text style={styles.settingsText}>⚙️</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{draftCount}</Text>
            <Text style={styles.statLabel}>Drafts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{completedCount}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{campaigns.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        {/* Create Button */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateNew}
        >
          <Text style={styles.createButtonIcon}>+</Text>
          <View style={styles.createButtonText}>
            <Text style={styles.createButtonTitle}>Create New</Text>
            <Text style={styles.createButtonSubtitle}>
              Poster or Video
            </Text>
          </View>
        </TouchableOpacity>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {['all', 'drafts', 'completed'].map((tab) => (
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

        {/* Campaigns List */}
        {filteredCampaigns.length > 0 ? (
          <View style={styles.campaignsContainer}>
            {filteredCampaigns.map((campaign) => (
              <TouchableOpacity
                key={campaign.id}
                style={styles.campaignItem}
                onPress={() => handleCampaignPress(campaign)}
              >
                {campaign.thumbnail ? (
                  <Image
                    source={{ uri: campaign.thumbnail }}
                    style={styles.campaignThumbnail}
                  />
                ) : (
                  <View style={styles.campaignPlaceholder}>
                    <Text style={styles.campaignIcon}>
                      {campaign.type === 'poster' ? '🖼️' : '🎥'}
                    </Text>
                  </View>
                )}
                <View style={styles.campaignInfo}>
                  <Text style={styles.campaignTitle} numberOfLines={1}>
                    {campaign.title}
                  </Text>
                  <Text style={styles.campaignDate}>
                    {new Date(campaign.updatedAt).toLocaleDateString()}
                  </Text>
                  <View style={styles.campaignStatus}>
                    <Text
                      style={[
                        styles.statusBadge,
                        campaign.status === 'draft'
                          ? styles.statusDraft
                          : styles.statusCompleted,
                      ]}
                    >
                      {campaign.status.charAt(0).toUpperCase() +
                        campaign.status.slice(1)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>No campaigns yet</Text>
            <Text style={styles.emptySubtext}>
              Create your first {activeTab === 'all' ? 'campaign' : activeTab.slice(0, -1)} to get started
            </Text>
          </View>
        )}
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
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 12,
    color: '#999',
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2a2a3e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsText: {
    fontSize: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#2a2a3e',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: '#3a3a4e',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00d4ff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
  },
  createButton: {
    backgroundColor: '#00d4ff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  createButtonIcon: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginRight: 12,
  },
  createButtonText: {
    flex: 1,
  },
  createButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  createButtonSubtitle: {
    fontSize: 12,
    color: '#0088aa',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a4e',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#00d4ff',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#999',
  },
  activeTabText: {
    color: '#00d4ff',
    fontWeight: '600',
  },
  campaignsContainer: {
    marginBottom: 24,
  },
  campaignItem: {
    backgroundColor: '#2a2a3e',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#3a3a4e',
  },
  campaignThumbnail: {
    width: 100,
    height: 100,
  },
  campaignPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#3a3a4e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  campaignIcon: {
    fontSize: 40,
  },
  campaignInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  campaignTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  campaignDate: {
    fontSize: 12,
    color: '#999',
    marginVertical: 4,
  },
  campaignStatus: {
    flexDirection: 'row',
  },
  statusBadge: {
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusDraft: {
    backgroundColor: '#ff6b6b',
    color: '#fff',
  },
  statusCompleted: {
    backgroundColor: '#51cf66',
    color: '#fff',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 12,
    color: '#999',
  },
});

export default HomeScreen;
