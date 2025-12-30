import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
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

// Helper: Produkt aus DB-Format in Frontend-Format konvertieren
function dbProductToFrontendProduct(dbProduct: any) {
    return {
        id: dbProduct.product_id,
        name: dbProduct.name,
        category: dbProduct.category,
        description: dbProduct.description || '',
        longDescription: dbProduct.long_description || '',
        image: dbProduct.image || '',
        images: dbProduct.images || [],
        features: dbProduct.features || [],
        specifications: dbProduct.specifications || {},
        technicalPropertiesHtml: dbProduct.technical_properties_html || '',
        applications: dbProduct.applications || [],
        downloads: dbProduct.downloads || [],
        seoHeadHtml: dbProduct.seo_head_html || '',
        tools: dbProduct.tools || [],
        faqs: dbProduct.faqs || []
    };
}

// Helper: Frontend-Produkt in DB-Format konvertieren
function frontendProductToDbProduct(product: any, language: 'de' | 'en') {
    return {
        product_id: product.id,
        language: language,
        name: product.name,
        category: product.category,
        description: product.description,
        long_description: product.longDescription,
        image: product.image,
        images: product.images || [],
        features: product.features || [],
        specifications: product.specifications || {},
        technical_properties_html: product.technicalPropertiesHtml || null,
        applications: product.applications || [],
        downloads: product.downloads || [],
        seo_head_html: product.seoHeadHtml || null,
        tools: product.tools || [],
        faqs: product.faqs || [],
        is_active: true
    };
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
            // Produkte aus Supabase abrufen
            const { data: products, error } = await supabase
                .from('products')
                .select('*')
                .eq('is_active', true)
                .order('product_id', { ascending: true })
                .order('language', { ascending: true });

            if (error) {
                console.error('Error fetching products:', error);
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: 'Failed to fetch products' }),
                };
            }

            // Produkte nach Sprache gruppieren
            const productsByLang: { de: any[]; en: any[] } = { de: [], en: [] };

            products?.forEach((dbProduct) => {
                const frontendProduct = dbProductToFrontendProduct(dbProduct);
                if (dbProduct.language === 'de') {
                    productsByLang.de.push(frontendProduct);
                } else if (dbProduct.language === 'en') {
                    productsByLang.en.push(frontendProduct);
                }
            });

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(productsByLang),
            };
        } else if (event.httpMethod === 'POST') {
            // Authentifizierung prüfen für POST (Speichern)
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
                // Admin und Mitarbeiter können Produkte speichern
                if (tokenData.role !== 'admin' && tokenData.role !== 'mitarbeiter') {
                    return {
                        statusCode: 403,
                        headers,
                        body: JSON.stringify({ error: 'Forbidden - Nur Admins und Mitarbeiter können Produkte speichern' }),
                    };
                }
            } catch (e) {
                console.warn('Token validation failed:', e);
            }

            // Produkte speichern
            const { de, en } = JSON.parse(event.body || '{}');

            if (!de || !en || !Array.isArray(de) || !Array.isArray(en)) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Invalid data format. Expected { de: Product[], en: Product[] }' }),
                };
            }

            // Alle Produkte in DB-Format konvertieren
            const dbProducts: any[] = [];

            de.forEach((product: any) => {
                dbProducts.push(frontendProductToDbProduct(product, 'de'));
            });

            en.forEach((product: any) => {
                dbProducts.push(frontendProductToDbProduct(product, 'en'));
            });

            // Upsert alle Produkte (aktualisiert wenn product_id + language existiert, sonst erstellt)
            const { error } = await supabase
                .from('products')
                .upsert(dbProducts, {
                    onConflict: 'product_id,language',
                    ignoreDuplicates: false
                });

            if (error) {
                console.error('Error saving products:', error);
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: 'Failed to save products', details: error.message }),
                };
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true }),
            };
        } else if (event.httpMethod === 'DELETE') {
            // Authentifizierung prüfen für DELETE
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
                // Admin und Mitarbeiter können Produkte löschen
                if (tokenData.role !== 'admin' && tokenData.role !== 'mitarbeiter') {
                    return {
                        statusCode: 403,
                        headers,
                        body: JSON.stringify({ error: 'Forbidden - Nur Admins und Mitarbeiter können Produkte löschen' }),
                    };
                }
            } catch (e) {
                console.warn('Token validation failed:', e);
            }

            // Produkt-ID aus Body extrahieren
            const { product_id } = JSON.parse(event.body || '{}');

            if (!product_id) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'product_id ist erforderlich' }),
                };
            }

            // Alle Einträge mit dieser product_id löschen (sowohl DE als auch EN)
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('product_id', product_id);

            if (error) {
                console.error('Error deleting product:', error);
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: 'Failed to delete product', details: error.message }),
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
        console.error('Products error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error', details: error.message }),
        };
    }
};
