// Image Processing Service - Crop and background removal
import ImageCropPicker from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs';

interface CropOptions {
  width?: number;
  height?: number;
  multiple?: boolean;
}

interface ImageData {
  path: string;
  width: number;
  height: number;
  mime: string;
  size: number;
}

class ImageService {
  // Pick image from gallery
  async pickImage(options: CropOptions = {}): Promise<ImageData> {
    try {
      const image = await ImageCropPicker.openPicker({
        cropping: true,
        width: options.width || 800,
        height: options.height || 600,
        freeStyleCropEnabled: true,
        mediaType: 'photo',
      });

      return {
        path: image.path,
        width: image.width,
        height: image.height,
        mime: image.mime,
        size: image.size,
      };
    } catch (error) {
      console.error('Error picking image:', error);
      throw error;
    }
  }

  // Crop image with custom dimensions
  async cropImage(imagePath: string, width: number, height: number): Promise<ImageData> {
    try {
      const image = await ImageCropPicker.openCropper({
        path: imagePath,
        width,
        height,
        freeStyleCropEnabled: true,
      });

      return {
        path: image.path,
        width: image.width,
        height: image.height,
        mime: image.mime,
        size: image.size,
      };
    } catch (error) {
      console.error('Error cropping image:', error);
      throw error;
    }
  }

  // Remove background from image (calls backend API)
  async removeBackground(imagePath: string): Promise<ImageData> {
    try {
      const base64 = await RNFS.readFile(imagePath, 'base64');
      
      // Call backend API to remove background
      const response = await fetch('https://api.prachar.app/image/remove-background', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64,
          format: 'base64',
        }),
      });

      const data = await response.json();
      
      // Save the processed image
      const fileName = `bg_removed_${Date.now()}.png`;
      const savePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      
      await RNFS.writeFile(savePath, data.image, 'base64');

      return {
        path: savePath,
        width: data.width,
        height: data.height,
        mime: 'image/png',
        size: 0,
      };
    } catch (error) {
      console.error('Error removing background:', error);
      throw error;
    }
  }

  // Resize image
  async resizeImage(imagePath: string, width: number, height: number): Promise<string> {
    try {
      const fileName = `resized_${Date.now()}.jpg`;
      const savePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      
      // In production, use react-native-image-resizer
      // For now, this is a placeholder
      return savePath;
    } catch (error) {
      console.error('Error resizing image:', error);
      throw error;
    }
  }

  // Save edited image
  async saveImage(base64Data: string, fileName: string): Promise<string> {
    try {
      const savePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      await RNFS.writeFile(savePath, base64Data, 'base64');
      return savePath;
    } catch (error) {
      console.error('Error saving image:', error);
      throw error;
    }
  }
}

export default new ImageService();
