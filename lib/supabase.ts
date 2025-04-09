import Constants from 'expo-constants';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = Constants.expoConfig!.extra!.expoPublicSupabaseUrl;
const supabaseAnonKey = Constants.expoConfig!.extra!.expoPublicSupabaseAnonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);