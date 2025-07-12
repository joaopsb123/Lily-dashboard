import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabaseUrl = 'https://tigdyyekathgkzkrsxrh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpZ2R5eWVrYXRoZ2t6a3JzeHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNDI4NzksImV4cCI6MjA2NzkxODg3OX0.XqLYDK8IIeQlldljwzxjA5Qu07kRKK_vHjDWFquv5Ho'
export const supabase = createClient(supabaseUrl, supabaseKey)
