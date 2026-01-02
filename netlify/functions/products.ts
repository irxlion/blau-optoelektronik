import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, PATCH, OPTIONS',
    'Content-Type': 'application/json',
};

const supabaseUrl = process.env.SUPABASE_URL || 'https://xtuwjizliuthdgytloju.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0dXdqaXpsaXV0aGRneXRsb2p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MTIwMjAsImV4cCI6MjA4MDE4ODAyMH0.U5iQhb_rDZedHFfAMl2tA85jn_kvAp2G6m35CyS0do4';

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
});

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
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: '',
        };
    }

        try {
        if (event.httpMethod === 'GET') {
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
            const authHeader = event.headers.authorization || event.headers.Authorization;
            if (!authHeader) {
                return {
                    statusCode: 401,
                    headers,
                    body: JSON.stringify({ error: 'Unauthorized' }),
                };
            }

            try {
                const token = authHeader.replace('Bearer ', '');
                const tokenData = JSON.parse(Buffer.from(token, 'base64').toString());
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

            const { de, en } = JSON.parse(event.body || '{}');

            if (!de || !en || !Array.isArray(de) || !Array.isArray(en)) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Invalid data format. Expected { de: Product[], en: Product[] }' }),
                };
            }

            const dbProducts: any[] = [];

            de.forEach((product: any) => {
                dbProducts.push(frontendProductToDbProduct(product, 'de'));
            });

            en.forEach((product: any) => {
                dbProducts.push(frontendProductToDbProduct(product, 'en'));
            });

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
            const authHeader = event.headers.authorization || event.headers.Authorization;
            if (!authHeader) {
                return {
                    statusCode: 401,
                    headers,
                    body: JSON.stringify({ error: 'Unauthorized' }),
                };
            }

            try {
                const token = authHeader.replace('Bearer ', '');
                const tokenData = JSON.parse(Buffer.from(token, 'base64').toString());
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
        } else if (event.httpMethod === 'PATCH') {
            const authHeader = event.headers.authorization || event.headers.Authorization;
            if (!authHeader) {
                return {
                    statusCode: 401,
                    headers,
                    body: JSON.stringify({ error: 'Unauthorized' }),
                };
            }

            try {
                const token = authHeader.replace('Bearer ', '');
                const tokenData = JSON.parse(Buffer.from(token, 'base64').toString());
                if (tokenData.role !== 'admin' && tokenData.role !== 'mitarbeiter') {
                    return {
                        statusCode: 403,
                        headers,
                        body: JSON.stringify({ error: 'Forbidden - Nur Admins und Mitarbeiter können Produkte verknüpfen' }),
                    };
                }
            } catch (e) {
                console.warn('Token validation failed:', e);
                return {
                    statusCode: 401,
                    headers,
                    body: JSON.stringify({ error: 'Invalid token' }),
                };
            }

            const { sourceProductId, targetProductId, targetLanguage } = JSON.parse(event.body || '{}');

            if (!sourceProductId || !targetProductId || !targetLanguage) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'sourceProductId, targetProductId und targetLanguage sind erforderlich' }),
                };
            }

            if (targetLanguage !== 'de' && targetLanguage !== 'en') {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'targetLanguage muss "de" oder "en" sein' }),
                };
            }

            // Prüfe, ob das Quellprodukt existiert
            const { data: sourceProduct, error: sourceError } = await supabase
                .from('products')
                .select('*')
                .eq('product_id', sourceProductId)
                .eq('is_active', true)
                .single();

            if (sourceError || !sourceProduct) {
                return {
                    statusCode: 404,
                    headers,
                    body: JSON.stringify({ error: `Quellprodukt mit ID "${sourceProductId}" nicht gefunden` }),
                };
            }

            // Prüfe, ob das Zielprodukt existiert
            const { data: targetProduct, error: targetError } = await supabase
                .from('products')
                .select('*')
                .eq('product_id', targetProductId)
                .eq('language', targetLanguage)
                .eq('is_active', true)
                .single();

            if (targetError || !targetProduct) {
                return {
                    statusCode: 404,
                    headers,
                    body: JSON.stringify({ error: `Zielprodukt mit ID "${targetProductId}" und Sprache "${targetLanguage}" nicht gefunden` }),
                };
            }

            // Prüfe, ob die Ziel-product_id bereits für die Zielsprache existiert (außer es ist das Zielprodukt selbst)
            const { data: existingProduct, error: existingError } = await supabase
                .from('products')
                .select('*')
                .eq('product_id', sourceProductId)
                .eq('language', targetLanguage)
                .eq('is_active', true)
                .single();

            if (existingProduct && existingProduct.id !== targetProduct.id) {
                return {
                    statusCode: 409,
                    headers,
                    body: JSON.stringify({ error: `Ein Produkt mit product_id "${sourceProductId}" und Sprache "${targetLanguage}" existiert bereits` }),
                };
            }

            // Aktualisiere die product_id des Zielprodukts
            const { error: updateError } = await supabase
                .from('products')
                .update({ product_id: sourceProductId, updated_at: new Date().toISOString() })
                .eq('product_id', targetProductId)
                .eq('language', targetLanguage);

            if (updateError) {
                console.error('Error linking products:', updateError);
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: 'Fehler beim Verknüpfen der Produkte', details: updateError.message }),
                };
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    success: true,
                    message: `Produkt "${targetProduct.name}" wurde erfolgreich mit "${sourceProduct.name}" verknüpft`
                }),
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
