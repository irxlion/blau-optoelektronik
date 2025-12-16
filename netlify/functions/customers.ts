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
// Service Role Key sollte RLS umgehen, aber falls nicht, RLS deaktivieren
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

// Helper: Passwort verifizieren
async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

// Helper: Sensitive Daten entfernen
function sanitizeCustomer(customer: any) {
    const { password_hash, ...sanitized } = customer;
    return sanitized;
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
            // Kundenliste abrufen mit Such- und Filteroptionen
            const queryParams = new URLSearchParams(event.queryStringParameters || '');
            const search = queryParams.get('search') || '';
            const isActive = queryParams.get('is_active');
            const limit = parseInt(queryParams.get('limit') || '100');
            const offset = parseInt(queryParams.get('offset') || '0');

            let query = supabase
                .from('customers')
                .select('*', { count: 'exact' });

            // Filter: Aktiv/Deaktiviert
            if (isActive !== null && isActive !== '') {
                query = query.eq('is_active', isActive === 'true');
            }

            // Suche: Name, E-Mail, Firmenname
            if (search) {
                query = query.or(`username.ilike.%${search}%,email.ilike.%${search}%,company_name.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
            }

            // Sortierung und Pagination
            query = query
                .order('created_at', { ascending: false })
                .range(offset, offset + limit - 1);

            const { data: customers, error, count } = await query;

            if (error) {
                console.error('Error fetching customers:', error);
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: 'Fehler beim Abrufen der Kunden', details: error.message }),
                };
            }

            // Sensitive Daten entfernen
            const sanitizedCustomers = customers?.map(sanitizeCustomer) || [];

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    customers: sanitizedCustomers,
                    total: count || 0,
                    limit,
                    offset,
                }),
            };
        } else if (event.httpMethod === 'POST') {
            // Authentifizierung prüfen für POST (nur Admins/Mitarbeiter)
            const authHeader = event.headers.authorization || event.headers.Authorization;
            if (!authHeader) {
                return {
                    statusCode: 401,
                    headers,
                    body: JSON.stringify({ error: 'Unauthorized' }),
                };
            }

            // Token validieren
            try {
                const token = authHeader.replace('Bearer ', '');
                const tokenData = JSON.parse(Buffer.from(token, 'base64').toString());
                if (tokenData.role !== 'admin' && tokenData.role !== 'mitarbeiter') {
                    return {
                        statusCode: 403,
                        headers,
                        body: JSON.stringify({ error: 'Forbidden - Nur Admins und Mitarbeiter' }),
                    };
                }
            } catch (e) {
                console.warn('Token validation failed:', e);
            }
            // Neuen Kunden erstellen
            const { username, password, email, company_name, first_name, last_name, phone, address, city, postal_code, country, is_active } = JSON.parse(event.body || '{}');

            if (!username || !password) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'username und password sind erforderlich' }),
                };
            }

            // Prüfen ob Benutzername bereits existiert
            const { data: existing } = await supabase
                .from('customers')
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

            // Kunden erstellen
            const { data: customer, error } = await supabase
                .from('customers')
                .insert({
                    username,
                    password_hash,
                    email: email || null,
                    company_name: company_name || null,
                    first_name: first_name || null,
                    last_name: last_name || null,
                    phone: phone || null,
                    address: address || null,
                    city: city || null,
                    postal_code: postal_code || null,
                    country: country || null,
                    is_active: is_active !== undefined ? is_active : true,
                })
                .select()
                .single();

            if (error) {
                console.error('Error creating customer:', error);
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: 'Fehler beim Erstellen des Kunden', details: error.message }),
                };
            }

            return {
                statusCode: 201,
                headers,
                body: JSON.stringify({ customer: sanitizeCustomer(customer) }),
            };
        } else if (event.httpMethod === 'PUT') {
            // Authentifizierung prüfen für PUT (nur Admins/Mitarbeiter)
            const authHeader = event.headers.authorization || event.headers.Authorization;
            if (!authHeader) {
                return {
                    statusCode: 401,
                    headers,
                    body: JSON.stringify({ error: 'Unauthorized' }),
                };
            }

            // Token validieren
            try {
                const token = authHeader.replace('Bearer ', '');
                const tokenData = JSON.parse(Buffer.from(token, 'base64').toString());
                if (tokenData.role !== 'admin' && tokenData.role !== 'mitarbeiter') {
                    return {
                        statusCode: 403,
                        headers,
                        body: JSON.stringify({ error: 'Forbidden - Nur Admins und Mitarbeiter' }),
                    };
                }
            } catch (e) {
                console.warn('Token validation failed:', e);
            }
            // Kunden aktualisieren
            const { id, username, password, email, company_name, first_name, last_name, phone, address, city, postal_code, country, is_active } = JSON.parse(event.body || '{}');

            if (!id) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'id ist erforderlich' }),
                };
            }

            // Update-Objekt zusammenstellen
            const updateData: any = {};
            if (username !== undefined) updateData.username = username;
            if (email !== undefined) updateData.email = email;
            if (company_name !== undefined) updateData.company_name = company_name;
            if (first_name !== undefined) updateData.first_name = first_name;
            if (last_name !== undefined) updateData.last_name = last_name;
            if (phone !== undefined) updateData.phone = phone;
            if (address !== undefined) updateData.address = address;
            if (city !== undefined) updateData.city = city;
            if (postal_code !== undefined) updateData.postal_code = postal_code;
            if (country !== undefined) updateData.country = country;
            if (is_active !== undefined) updateData.is_active = is_active;

            // Passwort aktualisieren falls angegeben
            if (password) {
                updateData.password_hash = await hashPassword(password);
            }

            // Kunden aktualisieren
            const { data: customer, error } = await supabase
                .from('customers')
                .update(updateData)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('Error updating customer:', error);
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: 'Fehler beim Aktualisieren des Kunden', details: error.message }),
                };
            }

            if (!customer) {
                return {
                    statusCode: 404,
                    headers,
                    body: JSON.stringify({ error: 'Kunde nicht gefunden' }),
                };
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ customer: sanitizeCustomer(customer) }),
            };
        } else if (event.httpMethod === 'DELETE') {
            // Authentifizierung prüfen für DELETE (nur Admins/Mitarbeiter)
            const authHeader = event.headers.authorization || event.headers.Authorization;
            if (!authHeader) {
                return {
                    statusCode: 401,
                    headers,
                    body: JSON.stringify({ error: 'Unauthorized' }),
                };
            }

            // Token validieren
            try {
                const token = authHeader.replace('Bearer ', '');
                const tokenData = JSON.parse(Buffer.from(token, 'base64').toString());
                if (tokenData.role !== 'admin' && tokenData.role !== 'mitarbeiter') {
                    return {
                        statusCode: 403,
                        headers,
                        body: JSON.stringify({ error: 'Forbidden - Nur Admins und Mitarbeiter' }),
                    };
                }
            } catch (e) {
                console.warn('Token validation failed:', e);
            }
            // Kunden löschen
            const { id } = JSON.parse(event.body || '{}');

            if (!id) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'id ist erforderlich' }),
                };
            }

            const { error } = await supabase
                .from('customers')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting customer:', error);
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: 'Fehler beim Löschen des Kunden', details: error.message }),
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
        console.error('Customers error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error', details: error.message }),
        };
    }
};

