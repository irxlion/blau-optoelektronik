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

// Helper: FAQ aus DB-Format in Frontend-Format konvertieren
function dbFaqToFrontendFaq(dbFaq: any) {
    return {
        id: dbFaq.faq_id,
        category: dbFaq.category,
        question: dbFaq.question,
        answer: dbFaq.answer,
        orderIndex: dbFaq.order_index || 0,
    };
}

// Helper: Frontend-FAQ in DB-Format konvertieren
function frontendFaqToDbFaq(faq: any, language: 'de' | 'en') {
    return {
        faq_id: faq.id,
        language: language,
        category: faq.category || '',
        question: faq.question || '',
        answer: faq.answer || '',
        order_index: faq.orderIndex !== undefined ? faq.orderIndex : 0,
        is_active: true,
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
            // FAQs aus Supabase abrufen
            // Service Role Key umgeht RLS, daher können wir alle FAQs abrufen
            const { data: faqs, error } = await supabase
                .from('faqs')
                .select('*')
                .eq('is_active', true)
                .order('category', { ascending: true })
                .order('order_index', { ascending: true });

            if (error) {
                console.error('Error fetching FAQs:', error);
                // Wenn die Tabelle nicht existiert, gib leere Arrays zurück
                if (error.code === '42P01' || error.message?.includes('does not exist')) {
                    console.warn('FAQs table does not exist yet. Returning empty arrays.');
                    return {
                        statusCode: 200,
                        headers,
                        body: JSON.stringify({ de: [], en: [] }),
                    };
                }
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: 'Failed to fetch FAQs', details: error.message }),
                };
            }

            // FAQs nach Sprache und Kategorie gruppieren
            const faqsByLang: { de: any[]; en: any[] } = { de: [], en: [] };

            faqs?.forEach((dbFaq) => {
                const frontendFaq = dbFaqToFrontendFaq(dbFaq);
                if (dbFaq.language === 'de') {
                    faqsByLang.de.push(frontendFaq);
                } else if (dbFaq.language === 'en') {
                    faqsByLang.en.push(frontendFaq);
                }
            });

            // Nach Kategorien gruppieren
            const groupedByCategory: { de: any[]; en: any[] } = { de: [], en: [] };

            ['de', 'en'].forEach((lang) => {
                const faqsForLang = faqsByLang[lang as 'de' | 'en'];
                const categoryMap = new Map<string, any[]>();

                faqsForLang.forEach((faq) => {
                    if (!categoryMap.has(faq.category)) {
                        categoryMap.set(faq.category, []);
                    }
                    categoryMap.get(faq.category)!.push(faq);
                });

                // Konvertiere Map zu Array
                categoryMap.forEach((questions, category) => {
                    groupedByCategory[lang as 'de' | 'en'].push({
                        category,
                        questions: questions.sort((a, b) => a.orderIndex - b.orderIndex),
                    });
                });

                // Sortiere Kategorien alphabetisch
                groupedByCategory[lang as 'de' | 'en'].sort((a, b) => 
                    a.category.localeCompare(b.category)
                );
            });

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(groupedByCategory),
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
                if (tokenData.role !== 'admin' && tokenData.role !== 'mitarbeiter') {
                    return {
                        statusCode: 403,
                        headers,
                        body: JSON.stringify({ error: 'Forbidden - Nur Admins und Mitarbeiter können FAQs speichern' }),
                    };
                }
            } catch (e) {
                console.warn('Token validation failed:', e);
            }

            // FAQs speichern
            const { de, en } = JSON.parse(event.body || '{}');

            if (!de || !en || !Array.isArray(de) || !Array.isArray(en)) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Invalid data format. Expected { de: FAQCategory[], en: FAQCategory[] }' }),
                };
            }

            // Alle FAQs in DB-Format konvertieren
            const dbFaqs: any[] = [];

            de.forEach((category: any) => {
                if (category.questions && Array.isArray(category.questions)) {
                    category.questions.forEach((faq: any, index: number) => {
                        dbFaqs.push(frontendFaqToDbFaq({
                            ...faq,
                            orderIndex: faq.orderIndex !== undefined ? faq.orderIndex : index,
                        }, 'de'));
                    });
                }
            });

            en.forEach((category: any) => {
                if (category.questions && Array.isArray(category.questions)) {
                    category.questions.forEach((faq: any, index: number) => {
                        dbFaqs.push(frontendFaqToDbFaq({
                            ...faq,
                            orderIndex: faq.orderIndex !== undefined ? faq.orderIndex : index,
                        }, 'en'));
                    });
                }
            });

            // Lösche zuerst alle bestehenden FAQs, um sicherzustellen, dass gelöschte FAQs entfernt werden
            // Dann füge alle neuen/aktualisierten FAQs ein
            // Alternativ: Upsert mit korrektem Constraint
            
            // Prüfe ob FAQs existieren
            if (dbFaqs.length === 0) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'No FAQs to save' }),
                };
            }

            // Upsert alle FAQs - verwende das gleiche Muster wie careers/products
            // Supabase erkennt den UNIQUE Constraint automatisch anhand der Spalten
            const { error: upsertError } = await supabase
                .from('faqs')
                .upsert(dbFaqs, {
                    onConflict: 'faq_id,language',
                    ignoreDuplicates: false
                });

            if (upsertError) {
                console.error('Error saving FAQs:', upsertError);
                console.error('Error code:', upsertError.code);
                console.error('Error details:', upsertError.details);
                console.error('Error hint:', upsertError.hint);
                console.error('First FAQ data:', JSON.stringify(dbFaqs[0], null, 2));
                
                // Prüfe ob die Tabelle existiert
                if (upsertError.code === '42P01' || upsertError.message?.includes('does not exist')) {
                    return {
                        statusCode: 500,
                        headers,
                        body: JSON.stringify({ 
                            error: 'FAQ table does not exist', 
                            details: 'Please run the SQL schema to create the faqs table',
                            hint: 'Execute the SQL from supabase-schema.sql starting at line 197'
                        }),
                    };
                }
                
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ 
                        error: 'Failed to save FAQs', 
                        details: upsertError.message,
                        code: upsertError.code,
                        hint: upsertError.hint || 'Check if FAQ table exists and has correct schema'
                    }),
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
                if (tokenData.role !== 'admin' && tokenData.role !== 'mitarbeiter') {
                    return {
                        statusCode: 403,
                        headers,
                        body: JSON.stringify({ error: 'Forbidden - Nur Admins und Mitarbeiter können FAQs löschen' }),
                    };
                }
            } catch (e) {
                console.warn('Token validation failed:', e);
            }

            // FAQ ID aus Query-Parameter oder Body holen
            const faqId = event.queryStringParameters?.faq_id || (event.body ? JSON.parse(event.body).faq_id : null);
            
            if (!faqId) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'faq_id is required' }),
                };
            }

            // Alle Einträge mit dieser faq_id löschen (beide Sprachen)
            const { error } = await supabase
                .from('faqs')
                .delete()
                .eq('faq_id', faqId);

            if (error) {
                console.error('Error deleting FAQ:', error);
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: 'Failed to delete FAQ', details: error.message }),
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
        console.error('FAQs error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error', details: error.message }),
        };
    }
};

