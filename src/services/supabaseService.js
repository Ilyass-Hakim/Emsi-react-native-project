import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';

// Supabase client initialized with provided project info
const SUPABASE_URL = 'https://ziqzekhophbzbnuzwdhk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Js3Wl-Oh-timY131QpBj8Q_yXnK5UQ_';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false, // basic config for now, adjust if using auth heavily
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

const BUCKET = 'Emsi-project';

export const SupabaseService = {
  async uploadImageAsync(uri, fileName) {
    try {
      console.log('Starting upload for:', fileName);

      const path = `${Date.now()}_${fileName}`;
      const contentType = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg';
      const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`;

      console.log('Uploading to path:', path);

      // Use FileSystem.uploadAsync for more reliable native file transfer
      const response = await FileSystem.uploadAsync(uploadUrl, uri, {
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': contentType,
        },
      });

      if (response.status >= 200 && response.status < 300) {
        console.log('Upload successful status:', response.status);

        // Get public URL
        const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
        console.log('Public URL:', urlData.publicUrl);
        return urlData.publicUrl;
      } else {
        console.error('Supabase Upload Failed:', response.status, response.body);
        throw new Error(`Upload failed with status ${response.status}`);
      }
    } catch (err) {
      console.error('Supabase upload error (detailed):', err);
      throw err;
    }
  },

  getPublicUrl(path) {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }
};
