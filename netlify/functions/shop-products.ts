import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
};

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

function getAuthToken(event: any): string | null {
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7);
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
        // Authentifizierung für POST, PUT, DELETE
        if (['POST', 'PUT', 'DELETE'].includes(event.httpMethod)) {
            const token = getAuthToken(event);
            if (!token) {
                return {
                    statusCode: 401,
                    headers,
                    body: JSON.stringify({ error: 'Unauthorized' }),
                };
            }
        }

        if (event.httpMethod === 'GET') {
            // Alle Shop-Produkte laden (auch inaktive für Dashboard)
            const { data: products, error } = await supabase
                .from('shop_products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching products:', error);
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: 'Failed to fetch products', details: error.message }),
                };
            }

            // Wenn keine Produkte vorhanden, leeres Array zurückgeben
            if (!products || products.length === 0) {
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify([]),
                };
            }

            // Assets für jedes Produkt laden
            const productsWithAssets = await Promise.all(
                products.map(async (product) => {
                    const { data: assets } = await supabase
                        .from('product_assets')
                        .select('*')
                        .eq('product_id', product.id);

                    return {
                        ...product,
                        assets: assets || [],
                    };
                })
            );

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(productsWithAssets),
            };
        } else if (event.httpMethod === 'POST') {
            // Neues Produkt erstellen
            const body = JSON.parse(event.body || '{}');
            const { assets, ...productData } = body;

            // Produkt erstellen
            const { data: product, error: productError } = await supabase
                .from('shop_products')
                .insert(productData)
                .select()
                .single();

            if (productError) {
                console.error('Error creating product:', productError);
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: 'Failed to create product', details: productError.message }),
                };
            }

            // Assets hinzufügen falls vorhanden
            if (assets && assets.length > 0) {
                console.log('Creating assets for new product:', product.id, 'Assets:', assets);
                
                const assetsToInsert = assets.map((asset: any) => ({
                    product_id: product.id,
                    type: asset.type,
                    url: asset.url,
                }));

                console.log('Inserting assets:', assetsToInsert);

                const { data: insertedAssets, error: assetsError } = await supabase
                    .from('product_assets')
                    .insert(assetsToInsert)
                    .select();

                if (assetsError) {
                    console.error('Error creating assets:', assetsError);
                    // Produkt wurde erstellt, aber Assets konnten nicht hinzugefügt werden
                } else {
                    console.log('Assets successfully created:', insertedAssets);
                }
            }

            // Produkt mit Assets zurückgeben
            const { data: productAssets } = await supabase
                .from('product_assets')
                .select('*')
                .eq('product_id', product.id);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    ...product,
                    assets: productAssets || [],
                }),
            };
        } else if (event.httpMethod === 'PUT') {
            // Produkt aktualisieren
            const body = JSON.parse(event.body || '{}');
            const { id, assets, ...productData } = body;

            if (!id) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Product ID is required' }),
                };
            }

            // Produkt aktualisieren
            const { data: product, error: productError } = await supabase
                .from('shop_products')
                .update(productData)
                .eq('id', id)
                .select()
                .single();

            if (productError) {
                console.error('Error updating product:', productError);
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: 'Failed to update product', details: productError.message }),
                };
            }

            // Assets aktualisieren falls vorhanden
            if (assets !== undefined) {
                console.log('Updating assets for product:', id, 'Assets:', assets);
                
                // Alte Assets löschen
                const { error: deleteError } = await supabase
                    .from('product_assets')
                    .delete()
                    .eq('product_id', id);

                if (deleteError) {
                    console.error('Error deleting old assets:', deleteError);
                }

                // Neue Assets hinzufügen
                if (assets.length > 0) {
                    const assetsToInsert = assets.map((asset: any) => ({
                        product_id: id,
                        type: asset.type,
                        url: asset.url,
                    }));

                    console.log('Inserting assets:', assetsToInsert);
                    
                    const { data: insertedAssets, error: assetsError } = await supabase
                        .from('product_assets')
                        .insert(assetsToInsert)
                        .select();

                    if (assetsError) {
                        console.error('Error inserting assets:', assetsError);
                    } else {
                        console.log('Assets successfully inserted:', insertedAssets);
                    }
                }
            }

            // Produkt mit Assets zurückgeben
            const { data: productAssets } = await supabase
                .from('product_assets')
                .select('*')
                .eq('product_id', id);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    ...product,
                    assets: productAssets || [],
                }),
            };
        } else if (event.httpMethod === 'DELETE') {
            // Produkt löschen
            const { id } = JSON.parse(event.body || '{}');

            if (!id) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Product ID is required' }),
                };
            }

            // Assets werden automatisch gelöscht durch CASCADE
            const { error } = await supabase
                .from('shop_products')
                .delete()
                .eq('id', id);

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
        console.error('Shop products error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error', details: error.message }),
        };
    }
};
