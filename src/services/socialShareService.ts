// Social Media Sharing Service
import Share from 'react-native-share';
import { Platform } from 'react-native';

interface ShareOptions {
  title?: string;
  message?: string;
  url?: string;
  type?: 'image' | 'video';
  filePath?: string;
}

class SocialShareService {
  // Share to WhatsApp
  async shareToWhatsApp(message: string, filePath?: string): Promise<void> {
    try {
      const shareOptions: any = {
        message,
      };

      if (filePath) {
        shareOptions.url = `file://${filePath}`;
      }

      shareOptions.social = Share.Social.WHATSAPP;
      await Share.open(shareOptions);
    } catch (error) {
      console.error('Error sharing to WhatsApp:', error);
      throw error;
    }
  }

  // Share to Facebook
  async shareToFacebook(message: string, filePath?: string): Promise<void> {
    try {
      const shareOptions: any = {
        message,
      };

      if (filePath) {
        shareOptions.url = `file://${filePath}`;
      }

      shareOptions.social = Share.Social.FACEBOOK;
      await Share.open(shareOptions);
    } catch (error) {
      console.error('Error sharing to Facebook:', error);
      throw error;
    }
  }

  // Share to X (Twitter)
  async shareToX(message: string, filePath?: string): Promise<void> {
    try {
      const shareOptions: any = {
        message,
      };

      if (filePath) {
        shareOptions.url = `file://${filePath}`;
      }

      shareOptions.social = Share.Social.TWITTER;
      await Share.open(shareOptions);
    } catch (error) {
      console.error('Error sharing to X:', error);
      throw error;
    }
  }

  // Share to Instagram
  async shareToInstagram(filePath: string): Promise<void> {
    try {
      const shareOptions: any = {
        url: `file://${filePath}`,
        social: Share.Social.INSTAGRAM,
      };

      await Share.open(shareOptions);
    } catch (error) {
      console.error('Error sharing to Instagram:', error);
      throw error;
    }
  }

  // Generic share (uses native share sheet)
  async shareToApp(options: ShareOptions): Promise<void> {
    try {
      const shareOptions: any = {
        title: options.title || 'Share Campaign',
        message: options.message || '',
      };

      if (options.filePath) {
        shareOptions.url = `file://${options.filePath}`;
      }

      if (Platform.OS === 'ios') {
        shareOptions.options = ['mail', 'message', 'copy'];
      }

      await Share.open(shareOptions);
    } catch (error) {
      console.error('Error sharing:', error);
      throw error;
    }
  }

  // Share with custom app selection
  async shareMultiple(filePaths: string[], message: string): Promise<void> {
    try {
      const urls = filePaths.map(path => `file://${path}`);
      
      await Share.open({
        urls,
        message,
        title: 'Share Campaign Material',
      });
    } catch (error) {
      console.error('Error sharing multiple files:', error);
      throw error;
    }
  }
}

export default new SocialShareService();
