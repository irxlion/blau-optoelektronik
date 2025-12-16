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
// WICHTIG: Service Role Key verwenden, nicht Anon Key!
// Service Role Key umgeht RLS automatisch
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0dXdqaXpsaXV0aGRneXRsb2p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MTIwMjAsImV4cCI6MjA4MDE4ODAyMH0.U5iQhb_rDZedHFfAMl2tA85jn_kvAp2G6m35CyS0do4';

// Supabase Client mit Service Role Key erstellen
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

    try {
        if (event.httpMethod === 'GET') {
            // GET-Anfragen erlauben ohne Authentifizierung (Service Role Key wird verwendet)
            // Bestellungen abrufen mit Filteroptionen
            const queryParams = new URLSearchParams(event.queryStringParameters || '');
            const status = queryParams.get('status');
            const customerId = queryParams.get('customer_id');
            const email = queryParams.get('email');
            const limit = parseInt(queryParams.get('limit') || '100');
            const offset = parseInt(queryParams.get('offset') || '0');
            const orderBy = queryParams.get('order_by') || 'created_at';
            const orderDirection = queryParams.get('order_direction') || 'desc';

            let query = supabase
                .from('orders')
                .select('*', { count: 'exact' });

            // Filter: Status
            if (status) {
                query = query.eq('status', status);
            }

            // Filter: Kunden-ID
            if (customerId) {
                query = query.eq('customer_id', customerId);
            }

            // Filter: E-Mail
            if (email) {
                query = query.eq('email', email);
            }

            // Sortierung
            query = query
                .order(orderBy, { ascending: orderDirection === 'asc' })
                .range(offset, offset + limit - 1);

            const { data: orders, error, count } = await query;

            if (error) {
                console.error('Error fetching orders:', error);
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: 'Fehler beim Abrufen der Bestellungen', details: error.message }),
                };
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    orders: orders || [],
                    total: count || 0,
                    limit,
                    offset,
                }),
            };
        } else if (event.httpMethod === 'POST') {
            // Neue Bestellung erstellen
            const orderData = JSON.parse(event.body || '{}');

            // Validierung
            if (!orderData.company_name || !orderData.contact_person || !orderData.email) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'company_name, contact_person und email sind erforderlich' }),
                };
            }

            if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'items (Array) ist erforderlich und darf nicht leer sein' }),
                };
            }

            // Bestellung erstellen (order_number wird automatisch generiert)
            const { data: order, error } = await supabase
                .from('orders')
                .insert({
                    customer_id: orderData.customer_id || null,
                    company_name: orderData.company_name,
                    contact_person: orderData.contact_person,
                    email: orderData.email,
                    phone: orderData.phone || null,
                    billing_street: orderData.billing_street,
                    billing_city: orderData.billing_city,
                    billing_postal_code: orderData.billing_postal_code,
                    billing_country: orderData.billing_country,
                    shipping_street: orderData.shipping_street,
                    shipping_city: orderData.shipping_city,
                    shipping_postal_code: orderData.shipping_postal_code,
                    shipping_country: orderData.shipping_country,
                    shipping_method: orderData.shipping_method || 'standard',
                    payment_method: orderData.payment_method || 'invoice',
                    subtotal_net: orderData.subtotal_net,
                    tax_amount: orderData.tax_amount,
                    total_amount: orderData.total_amount,
                    items: orderData.items,
                    status: orderData.status || 'pending',
                    notes: orderData.notes || null,
                    customer_notes: orderData.customer_notes || null,
                })
                .select()
                .single();

            if (error) {
                console.error('Error creating order:', error);
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: 'Fehler beim Erstellen der Bestellung', details: error.message }),
                };
            }

            return {
                statusCode: 201,
                headers,
                body: JSON.stringify({ order }),
            };
        } else if (event.httpMethod === 'PUT') {
            // Bestellung aktualisieren (z.B. Status ändern)
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
                        body: JSON.stringify({ error: 'Forbidden - Nur Admins und Mitarbeiter können Bestellungen aktualisieren' }),
                    };
                }
            } catch (e) {
                console.warn('Token validation failed:', e);
            }

            const { id, ...updateData } = JSON.parse(event.body || '{}');

            if (!id) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'id ist erforderlich' }),
                };
            }

            // Bestellung aktualisieren
            const { data: order, error } = await supabase
                .from('orders')
                .update(updateData)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('Error updating order:', error);
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: 'Fehler beim Aktualisieren der Bestellung', details: error.message }),
                };
            }

            if (!order) {
                return {
                    statusCode: 404,
                    headers,
                    body: JSON.stringify({ error: 'Bestellung nicht gefunden' }),
                };
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ order }),
            };
        } else if (event.httpMethod === 'DELETE') {
            // Bestellung löschen
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
                        body: JSON.stringify({ error: 'Forbidden - Nur Admins und Mitarbeiter können Bestellungen löschen' }),
                    };
                }
            } catch (e) {
                console.warn('Token validation failed:', e);
            }

            const { id } = JSON.parse(event.body || '{}');

            if (!id) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'id ist erforderlich' }),
                };
            }

            // Bestellung löschen
            const { error } = await supabase
                .from('orders')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting order:', error);
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: 'Fehler beim Löschen der Bestellung', details: error.message }),
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
        console.error('Orders error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error', details: error.message }),
        };
    }
};
