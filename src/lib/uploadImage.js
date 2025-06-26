import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

export async function uploadImageToSupabase(file) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw new Error(error.message);

  const { data: publicUrl } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName);

  return publicUrl?.publicUrl || null;
}
