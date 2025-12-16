import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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

// Helper: Passwort hashen
async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

// Helper: Sensitive Daten entfernen
function sanitizeAdmin(admin: any) {
    const { password_hash, ...sanitized } = admin;
    return sanitized;
}

// Helper: Token validieren und Rolle prüfen
function validateAdminToken(authHeader: string | undefined): { valid: boolean; role?: string } {
    if (!authHeader) {
        return { valid: false };
    }

    try {
        const token = authHeader.replace('Bearer ', '');
        const tokenData = JSON.parse(Buffer.from(token, 'base64').toString());
        
        // Nur Admins können andere Admins verwalten
        if (tokenData.role !== 'admin') {
            return { valid: false };
        }

        return { valid: true, role: tokenData.role };
    } catch (e) {
        return { valid: false };
    }
}

export const handler: Handler = async (event) => {
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: '',
        };
    }

    try {
        if (event.httpMethod === 'GET') {
            // GET-Anfragen erlauben ohne Authentifizierung (Service Role Key wird verwendet)
            // Admin-Liste abrufen
            const queryParams = new URLSearchParams(event.queryStringParameters || '');
            const search = queryParams.get('search') || '';

            let query = supabase
                .from('admins')
                .select('*', { count: 'exact' });

            // Suche: Username, E-Mail
            if (search) {
                query = query.or(`username.ilike.%${search}%,email.ilike.%${search}%`);
            }

            // Sortierung
            query = query.order('created_at', { ascending: false });

            const { data: admins, error, count } = await query;

            if (error) {
                console.error('Error fetching admins:', error);
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: 'Fehler beim Abrufen der Admins', details: error.message }),
                };
            }

            // Sensitive Daten entfernen
            const sanitizedAdmins = admins?.map(sanitizeAdmin) || [];

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    admins: sanitizedAdmins,
                    total: count || 0,
                }),
            };
        } else if (event.httpMethod === 'POST') {
            // Authentifizierung prüfen für POST (nur Admins)
            const authHeader = event.headers.authorization || event.headers.Authorization;
            const validation = validateAdminToken(authHeader);

            if (!validation.valid) {
                return {
                    statusCode: 403,
                    headers,
                    body: JSON.stringify({ error: 'Forbidden - Nur Admins können andere Admins verwalten' }),
                };
            }
            // Neuen Admin erstellen
            const { username, password, email, role, is_active } = JSON.parse(event.body || '{}');

            if (!username || !password) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'username und password sind erforderlich' }),
                };
            }

            // Rolle validieren
            if (role && !['admin', 'mitarbeiter'].includes(role)) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Rolle muss "admin" oder "mitarbeiter" sein' }),
                };
            }

            // Prüfen ob Benutzername bereits existiert
            const { data: existing } = await supabase
                .from('admins')
                .select('id')
                .eq('username', username)
                .single();

            if (existing) {
                return {
                    statusCode: 409,
                    headers,
                    body: JSON.stringify({ error: 'Benutzername bereits vergeben' }),
                };
            }

            // Passwort hashen
            const password_hash = await hashPassword(password);

            // Admin erstellen
            const { data: admin, error } = await supabase
                .from('admins')
                .insert({
                    username,
                    password_hash,
                    email: email || null,
                    role: role || 'mitarbeiter',
                    is_active: is_active !== undefined ? is_active : true,
                })
                .select()
                .single();

            if (error) {
                console.error('Error creating admin:', error);
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: 'Fehler beim Erstellen des Admins', details: error.message }),
                };
            }

            return {
                statusCode: 201,
                headers,
                body: JSON.stringify({ admin: sanitizeAdmin(admin) }),
            };
        } else if (event.httpMethod === 'PUT') {
            // Admin aktualisieren
            const { id, username, password, email, role, is_active } = JSON.parse(event.body || '{}');

            if (!id) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'id ist erforderlich' }),
                };
            }

            // Rolle validieren
            if (role && !['admin', 'mitarbeiter'].includes(role)) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Rolle muss "admin" oder "mitarbeiter" sein' }),
                };
            }

            // Update-Objekt zusammenstellen
            const updateData: any = {};
            if (username !== undefined) updateData.username = username;
            if (email !== undefined) updateData.email = email;
            if (role !== undefined) updateData.role = role;
            if (is_active !== undefined) updateData.is_active = is_active;

            // Passwort aktualisieren falls angegeben
            if (password) {
                updateData.password_hash = await hashPassword(password);
            }

            // Admin aktualisieren
            const { data: admin, error } = await supabase
                .from('admins')
                .update(updateData)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('Error updating admin:', error);
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: 'Fehler beim Aktualisieren des Admins', details: error.message }),
                };
            }

            if (!admin) {
                return {
                    statusCode: 404,
                    headers,
                    body: JSON.stringify({ error: 'Admin nicht gefunden' }),
                };
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ admin: sanitizeAdmin(admin) }),
            };
        } else if (event.httpMethod === 'DELETE') {
            // Authentifizierung prüfen für DELETE (nur Admins)
            const authHeader = event.headers.authorization || event.headers.Authorization;
            const validation = validateAdminToken(authHeader);

            if (!validation.valid) {
                return {
                    statusCode: 403,
                    headers,
                    body: JSON.stringify({ error: 'Forbidden - Nur Admins können andere Admins verwalten' }),
                };
            }
            // Admin löschen
            const { id } = JSON.parse(event.body || '{}');

            if (!id) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'id ist erforderlich' }),
                };
            }

            const { error } = await supabase
                .from('admins')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting admin:', error);
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: 'Fehler beim Löschen des Admins', details: error.message }),
                };
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true }),
            };
        } else {
            return {
                statusCode: 405,
                headers,
                body: JSON.stringify({ error: 'Method not allowed' }),
            };
        }
    } catch (error: any) {
        console.error('Admins error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error', details: error.message }),
        };
    }
};

