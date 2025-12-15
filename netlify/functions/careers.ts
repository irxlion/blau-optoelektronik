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
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0dXdqaXpsaXV0aGRneXRsb2p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MTIwMjAsImV4cCI6MjA4MDE4ODAyMH0.U5iQhb_rDZedHFfAMl2tA85jn_kvAp2G6m35CyS0do4';

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper: Karriere-Stelle aus DB-Format in Frontend-Format konvertieren
function dbCareerToFrontendCareer(dbCareer: any) {
    return {
        id: dbCareer.job_id,
        title: dbCareer.title,
        department: dbCareer.department || '',
        location: dbCareer.location || '',
        employmentType: dbCareer.employment_type || '',
        shortDescription: dbCareer.short_description || '',
        description: dbCareer.description || '',
        requirements: dbCareer.requirements || '',
        benefits: dbCareer.benefits || '',
        salaryRange: dbCareer.salary_range || '',
        applicationEmail: dbCareer.application_email || '',
        applicationUrl: dbCareer.application_url || '',
        publishedAt: dbCareer.published_at || null,
        isPublished: dbCareer.is_published || false,
    };
}

// Helper: Frontend-Karriere-Stelle in DB-Format konvertieren
function frontendCareerToDbCareer(career: any, language: 'de' | 'en') {
    return {
        job_id: career.id,
        language: language,
        title: career.title,
        department: career.department || null,
        location: career.location || null,
        employment_type: career.employmentType || null,
        short_description: career.shortDescription || null,
        description: career.description,
        requirements: career.requirements || null,
        benefits: career.benefits || null,
        salary_range: career.salaryRange || null,
        application_email: career.applicationEmail || null,
        application_url: career.applicationUrl || null,
        is_active: true,
        is_published: career.isPublished || false,
        published_at: career.publishedAt ? new Date(career.publishedAt).toISOString() : null,
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
            // Prüfe ob alle Stellen angezeigt werden sollen (für Dashboard)
            const showAll = event.queryStringParameters?.all === 'true';
            
            // Karriere-Stellen aus Supabase abrufen
            // Service Role Key hat Zugriff, daher keine RLS-Probleme
            let query = supabase
                .from('careers')
                .select('*')
                .eq('is_active', true);
            
            // Nur veröffentlichte Stellen anzeigen, es sei denn es ist eine Dashboard-Anfrage
            if (!showAll) {
                query = query.eq('is_published', true);
            }
            
            const { data: careers, error } = await query
                .order('published_at', { ascending: false, nullsFirst: false })
                .order('job_id', { ascending: true })
                .order('language', { ascending: true });

            if (error) {
                console.error('Error fetching careers:', error);
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: 'Failed to fetch careers' }),
                };
            }

            // Karriere-Stellen nach Sprache gruppieren
            const careersByLang: { de: any[]; en: any[] } = { de: [], en: [] };

            careers?.forEach((dbCareer) => {
                const frontendCareer = dbCareerToFrontendCareer(dbCareer);
                if (dbCareer.language === 'de') {
                    careersByLang.de.push(frontendCareer);
                } else if (dbCareer.language === 'en') {
                    careersByLang.en.push(frontendCareer);
                }
            });

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(careersByLang),
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
                        body: JSON.stringify({ error: 'Forbidden - Nur Admins und Mitarbeiter können Karriere-Stellen speichern' }),
                    };
                }
            } catch (e) {
                console.warn('Token validation failed:', e);
            }

            // Karriere-Stellen speichern
            const { de, en } = JSON.parse(event.body || '{}');

            if (!de || !en || !Array.isArray(de) || !Array.isArray(en)) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Invalid data format. Expected { de: Career[], en: Career[] }' }),
                };
            }

            // Alle Karriere-Stellen in DB-Format konvertieren
            const dbCareers: any[] = [];

            de.forEach((career: any) => {
                dbCareers.push(frontendCareerToDbCareer(career, 'de'));
            });

            en.forEach((career: any) => {
                dbCareers.push(frontendCareerToDbCareer(career, 'en'));
            });

            // Upsert alle Karriere-Stellen
            const { error } = await supabase
                .from('careers')
                .upsert(dbCareers, {
                    onConflict: 'job_id,language',
                    ignoreDuplicates: false
                });

            if (error) {
                console.error('Error saving careers:', error);
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: 'Failed to save careers', details: error.message }),
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
                        body: JSON.stringify({ error: 'Forbidden - Nur Admins und Mitarbeiter können Karriere-Stellen löschen' }),
                    };
                }
            } catch (e) {
                console.warn('Token validation failed:', e);
            }

            // Job ID aus Query-Parameter oder Body holen
            const jobId = event.queryStringParameters?.job_id || (event.body ? JSON.parse(event.body).job_id : null);
            
            if (!jobId) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'job_id is required' }),
                };
            }

            // Alle Einträge mit dieser job_id löschen (beide Sprachen)
            const { error } = await supabase
                .from('careers')
                .delete()
                .eq('job_id', jobId);

            if (error) {
                console.error('Error deleting career:', error);
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: 'Failed to delete career', details: error.message }),
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
        console.error('Careers error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error', details: error.message }),
        };
    }
};

