import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
};

// Supabase Client initialisieren
const supabaseUrl = process.env.SUPABASE_URL || 'https://xtuwjizliuthdgytloju.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0dXdqaXpsaXV0aGRneXRsb2p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MTIwMjAsImV4cCI6MjA4MDE4ODAyMH0.U5iQhb_rDZedHFfAMl2tA85jn_kvAp2G6m35CyS0do4';

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
});

// Helper: Token verifizieren (base64-encoded JSON, nicht JWT)
function verifyAuthToken(authHeader: string | null): boolean {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return false;
    }
    
    try {
        const token = authHeader.replace('Bearer ', '');
        // Token ist base64-encoded JSON (nicht JWT)
        const tokenData = JSON.parse(Buffer.from(token, 'base64').toString());
        return tokenData.role === 'admin' || tokenData.role === 'mitarbeiter';
    } catch (e) {
        console.warn('Token validation failed:', e);
        return false;
    }
}

export const handler: Handler = async (event, context) => {
    // CORS Preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: '',
        };
    }

    try {
        // GET: Alle Settings abrufen
        if (event.httpMethod === 'GET') {
            const { data, error } = await supabase
                .from('settings')
                .select('*')
                .order('setting_key');

            if (error) {
                console.error('Error fetching settings:', error);
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: 'Failed to fetch settings', details: error.message }),
                };
            }

            // Konvertiere zu Key-Value Objekt
            const settings: Record<string, string> = {};
            if (data) {
                data.forEach((setting) => {
                    settings[setting.setting_key] = setting.setting_value || '';
                });
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(settings),
            };
        }

        // POST/PUT: Settings speichern
        if (event.httpMethod === 'POST' || event.httpMethod === 'PUT') {
            const authHeader = event.headers.authorization || event.headers.Authorization || null;
            if (!verifyAuthToken(authHeader)) {
                return {
                    statusCode: 401,
                    headers,
                    body: JSON.stringify({ error: 'Unauthorized' }),
                };
            }

            const body = JSON.parse(event.body || '{}');
            const { settings } = body;

            if (!settings || typeof settings !== 'object') {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Invalid request body. Expected { settings: { key: value } }' }),
                };
            }

            // Aktualisiere oder erstelle jede Einstellung
            const updates = Object.entries(settings).map(async ([key, value]) => {
                const { error } = await supabase
                    .from('settings')
                    .upsert({
                        setting_key: key,
                        setting_value: value || '',
                        updated_at: new Date().toISOString(),
                    }, {
                        onConflict: 'setting_key',
                    });

                if (error) {
                    console.error(`Error upserting setting ${key}:`, error);
                    throw error;
                }
            });

            await Promise.all(updates);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true }),
            };
        }

        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    } catch (error: any) {
        console.error('Error in settings handler:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error', details: error.message }),
        };
    }
};

