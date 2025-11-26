import { Handler } from '@netlify/functions';
import fs from 'fs/promises';
import path from 'path';

// In Netlify Functions, we need to use environment variables or a database
// For simplicity, we'll use a JSON file in the repo (read-only in production)
// For a real app, use a database like MongoDB, Supabase, or Netlify Blobs

const PRODUCTS_FILE = path.join(process.cwd(), 'server', 'products.json');

export const handler: Handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    };

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
            // Read products
            const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
            return {
                statusCode: 200,
                headers,
                body: data,
            };
        } else if (event.httpMethod === 'POST') {
            // Save products
            const { de, en } = JSON.parse(event.body || '{}');

            if (!de || !en) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Invalid data format' }),
                };
            }

            // Note: In Netlify, the filesystem is read-only in production
            // This will work locally but not in production
            // For production, you need to use Netlify Blobs, a database, or external storage
            await fs.writeFile(PRODUCTS_FILE, JSON.stringify({ de, en }, null, 2));

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
    } catch (error) {
        console.error('Products error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' }),
        };
    }
};
