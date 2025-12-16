import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
};

// Supabase Client initialisieren
const supabaseUrl = process.env.SUPABASE_URL || 'https://xtuwjizliuthdgytloju.supabase.co';
// WICHTIG: Service Role Key verwenden, nicht Anon Key!
// Service Role Key umgeht RLS automatisch
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0dXdqaXpsaXV0aGRneXRsb2p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MTIwMjAsImV4cCI6MjA4MDE4ODAyMH0.U5iQhb_rDZedHFfAMl2tA85jn_kvAp2G6m35CyS0do4';

// Supabase Client mit Service Role Key erstellen
// Service Role Key sollte RLS umgehen
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
});

export const handler: Handler = async (event) => {
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: '',
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    try {
        const { username, password } = JSON.parse(event.body || '{}');

        if (!username || !password) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Username and password are required' }),
            };
        }

        console.log('Login attempt:', { username });

        // Admin aus Supabase abrufen - verwende maybeSingle() statt single() für besseres Error-Handling
        const { data: admin, error } = await supabase
            .from('admins')
            .select('*')
            .eq('username', username)
            .eq('is_active', true)
            .maybeSingle();

        console.log('Admin query result:', { admin: admin ? { username: admin.username, hasPasswordHash: !!admin.password_hash } : null, error });

        if (error) {
            console.error('Admin lookup error:', error);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Database error', details: error.message }),
            };
        }

        if (!admin) {
            console.error('Admin not found:', username);
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'Invalid credentials' }),
            };
        }

        // Passwort verifizieren
        console.log('Comparing password...');
        const isValidPassword = await bcrypt.compare(password, admin.password_hash);
        console.log('Password valid:', isValidPassword);

        if (!isValidPassword) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'Invalid credentials' }),
            };
        }

        // Last login aktualisieren
        await supabase
            .from('admins')
            .update({ last_login: new Date().toISOString() })
            .eq('id', admin.id);

        // JWT Token generieren (vereinfacht - in Produktion sollte ein echter JWT verwendet werden)
        // Rolle aus Datenbank verwenden (admin oder mitarbeiter)
        const adminRole = admin.role || 'mitarbeiter';
        const token = Buffer.from(JSON.stringify({ 
            id: admin.id, 
            username: admin.username,
            role: adminRole, // Rolle aus Datenbank
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 Stunden
        })).toString('base64');

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                token: token,
                user: {
                    id: admin.id,
                    username: admin.username,
                    email: admin.email
                }
            }),
        };
    } catch (error) {
        console.error('Login error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' }),
        };
    }
};
