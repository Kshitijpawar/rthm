import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const clientObj = createClient(process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_API_KEY)
const supabase = () => clientObj;

export {supabase};
