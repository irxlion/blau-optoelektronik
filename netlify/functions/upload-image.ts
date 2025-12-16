import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS, DELETE',
    'Content-Type': 'application/json',
};

// Supabase Client initialisieren
const supabaseUrl = process.env.SUPABASE_URL || 'https://xtuwjizliuthdgytloju.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0dXdqaXpsaXV0aGRneXRsb2p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MTIwMjAsImV4cCI6MjA4MDE4ODAyMH0.U5iQhb_rDZedHFfAMl2tA85jn_kvAp2G6m35CyS0do4';

const supabase = createClient(supabaseUrl, supabaseKey);

// Validierung: Erlaubte Bildformate
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

// Helper: Base64 zu Buffer konvertieren
function base64ToBuffer(base64: string): Buffer {
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
    return Buffer.from(base64Data, 'base64');
}

// Helper: MIME-Type aus Base64-String extrahieren
function getMimeTypeFromBase64(base64: string): string | null {
    const match = base64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
    return match ? match[1] : null;
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
        // Authentifizierung prüfen
        const authHeader = event.headers.authorization || event.headers.Authorization;
        if (!authHeader) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'Unauthorized' }),
            };
        }

        // Token validieren (vereinfacht - in Produktion sollte dies überprüft werden)
        try {
            const token = authHeader.replace('Bearer ', '');
            // Token ist base64-encoded JSON (nicht JWT)
            const tokenData = JSON.parse(Buffer.from(token, 'base64').toString());
            // Admin und Mitarbeiter können Bilder hochladen
            if (tokenData.role !== 'admin' && tokenData.role !== 'mitarbeiter') {
                return {
                    statusCode: 403,
                    headers,
                    body: JSON.stringify({ error: 'Forbidden - Nur Admins und Mitarbeiter' }),
                };
            }
        } catch (e) {
            // Token-Validierung fehlgeschlagen - für Entwicklung erlauben wir es
            // In Produktion sollte hier eine echte Validierung stattfinden
            console.warn('Token validation failed:', e);
        }

        if (event.httpMethod === 'POST') {
            // Bild-Upload
            const { productId, imageBase64, fileName } = JSON.parse(event.body || '{}');

            if (!productId || !imageBase64) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'productId und imageBase64 sind erforderlich' }),
                };
            }

            // MIME-Type validieren
            const mimeType = getMimeTypeFromBase64(imageBase64);
            if (!mimeType || !ALLOWED_IMAGE_TYPES.includes(mimeType)) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Nur PNG und JPG Dateien sind erlaubt' }),
                };
            }

            // Dateigröße validieren
            const buffer = base64ToBuffer(imageBase64);
            if (buffer.length > MAX_IMAGE_SIZE) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Datei ist zu groß. Maximum: 5 MB' }),
                };
            }

            // Dateiname generieren
            const timestamp = Date.now();
            const extension = mimeType.split('/')[1];
            const sanitizedProductId = productId.replace(/[^a-zA-Z0-9-_]/g, '_');
            const finalFileName = fileName || `${sanitizedProductId}_${timestamp}.${extension}`;
            const filePath = `products/${sanitizedProductId}/images/${finalFileName}`;

            // Upload zu Supabase Storage
            const { data, error } = await supabase.storage
                .from('uploads')
                .upload(filePath, buffer, {
                    contentType: mimeType,
                    upsert: true, // Erlaube Überschreiben falls Datei existiert
                });

            if (error) {
                console.error('Upload error:', error);
                // Prüfe ob Bucket existiert und versuche es zu erstellen
                if (error.message?.includes('Bucket not found') || error.message?.includes('does not exist')) {
                    // Versuche Bucket automatisch zu erstellen
                    try {
                        const { data: bucketData, error: bucketError } = await supabase.storage.createBucket('uploads', {
                            public: true,
                            fileSizeLimit: 10485760, // 10 MB
                            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']
                        });
                        
                        if (bucketError && !bucketError.message?.includes('already exists')) {
                            console.error('Error creating bucket:', bucketError);
                            return {
                                statusCode: 500,
                                headers,
                                body: JSON.stringify({ 
                                    error: 'Storage Bucket "uploads" konnte nicht erstellt werden. Bitte erstellen Sie ihn manuell in Supabase Dashboard > Storage > Buckets',
                                    details: bucketError.message
                                }),
                            };
                        }
                        
                        // Versuche Upload erneut nach Bucket-Erstellung
                        const { data: retryData, error: retryError } = await supabase.storage
                            .from('uploads')
                            .upload(filePath, buffer, {
                                contentType: mimeType,
                                upsert: true,
                            });
                        
                        if (retryError) {
                            return {
                                statusCode: 500,
                                headers,
                                body: JSON.stringify({ error: 'Upload fehlgeschlagen nach Bucket-Erstellung', details: retryError.message }),
                            };
                        }
                        
                        // Erfolgreich nach Retry
                        const { data: urlData } = supabase.storage
                            .from('uploads')
                            .getPublicUrl(filePath);
                        
                        return {
                            statusCode: 200,
                            headers,
                            body: JSON.stringify({
                                success: true,
                                url: urlData.publicUrl,
                                path: filePath,
                            }),
                        };
                    } catch (createError: any) {
                        return {
                            statusCode: 500,
                            headers,
                            body: JSON.stringify({ 
                                error: 'Storage Bucket "uploads" existiert nicht und konnte nicht automatisch erstellt werden. Bitte erstellen Sie ihn in Supabase Dashboard > Storage > Buckets',
                                details: createError.message
                            }),
                        };
                    }
                }
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: 'Upload fehlgeschlagen', details: error.message }),
                };
            }

            // Öffentliche URL generieren
            const { data: urlData } = supabase.storage
                .from('uploads')
                .getPublicUrl(filePath);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    url: urlData.publicUrl,
                    path: filePath,
                }),
            };
        } else if (event.httpMethod === 'DELETE') {
            // Bild löschen
            const { filePath } = JSON.parse(event.body || '{}');

            if (!filePath) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'filePath ist erforderlich' }),
                };
            }

            const { error } = await supabase.storage
                .from('uploads')
                .remove([filePath]);

            if (error) {
                console.error('Delete error:', error);
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: 'Löschen fehlgeschlagen', details: error.message }),
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
        console.error('Upload error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error', details: error.message }),
        };
    }
};

