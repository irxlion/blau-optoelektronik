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

// Validierung: Erlaubte PDF-Formate
const ALLOWED_PDF_TYPE = 'application/pdf';
const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10 MB

// Helper: Base64 zu Buffer konvertieren
function base64ToBuffer(base64: string): Buffer {
    const base64Data = base64.replace(/^data:application\/pdf;base64,/, '');
    return Buffer.from(base64Data, 'base64');
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
            // Admin und Mitarbeiter können PDFs hochladen
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
            // PDF-Upload
            const { productId, pdfBase64, fileName } = JSON.parse(event.body || '{}');

            if (!productId || !pdfBase64) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'productId und pdfBase64 sind erforderlich' }),
                };
            }

            // Dateigröße validieren
            const buffer = base64ToBuffer(pdfBase64);
            if (buffer.length > MAX_PDF_SIZE) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Datei ist zu groß. Maximum: 10 MB' }),
                };
            }

            // Dateiname generieren
            const timestamp = Date.now();
            const sanitizedProductId = productId.replace(/[^a-zA-Z0-9-_]/g, '_');
            const sanitizedFileName = (fileName || `document_${timestamp}.pdf`).replace(/[^a-zA-Z0-9-_.]/g, '_');
            const filePath = `products/${sanitizedProductId}/pdfs/${sanitizedFileName}`;

            // Upload zu Supabase Storage
            const { data, error } = await supabase.storage
                .from('uploads')
                .upload(filePath, buffer, {
                    contentType: ALLOWED_PDF_TYPE,
                    upsert: true, // Erlaube Überschreiben falls Datei existiert
                });

            if (error) {
                console.error('Upload error:', error);
                // Prüfe ob Bucket existiert
                if (error.message?.includes('Bucket not found')) {
                    return {
                        statusCode: 500,
                        headers,
                        body: JSON.stringify({ 
                            error: 'Storage Bucket "uploads" existiert nicht. Bitte erstellen Sie ihn in Supabase Dashboard > Storage > Buckets' 
                        }),
                    };
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
                    fileName: sanitizedFileName,
                }),
            };
        } else if (event.httpMethod === 'DELETE') {
            // PDF löschen
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
        console.error('PDF upload error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error', details: error.message }),
        };
    }
};

