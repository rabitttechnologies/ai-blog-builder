
import { createClient } from '@supabase/supabase-js';
import { corsHeaders } from '../_shared/cors.ts';

// Create a Supabase client with the service role key
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  {
    auth: {
      persistSession: false,
    },
  }
);

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Verify admin status
    const { data: roles } = await supabaseAdmin.rpc('get_user_roles', {
      user_id_param: user.id
    });

    if (!roles?.includes('admin')) {
      throw new Error('Forbidden - requires admin role');
    }

    // Parse request
    const { operation, data } = await req.json();
    let result;

    // Handle different operations
    switch (operation) {
      case 'listUsers':
        const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        if (listError) throw listError;
        result = { users };
        break;

      case 'makeAdmin':
        const { userId } = data;
        const { error: adminError } = await supabaseAdmin.rpc('add_user_admin_role', {
          user_id_param: userId
        });
        if (adminError) throw adminError;
        result = { success: true };
        break;

      default:
        throw new Error('Invalid operation');
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Admin operation error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: error.message.includes('Unauthorized') ? 401 : 
             error.message.includes('Forbidden') ? 403 : 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
