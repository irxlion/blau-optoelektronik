import { Handler } from '@netlify/functions';

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
};

export const handler: Handler = async (event) => {
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: '',
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    try {
        const { username, password } = JSON.parse(event.body || '{}');

        console.log('Login attempt:', { username });

        // Simple authentication (in production, use proper auth)
        if (username === 'admin' && password === 'password') {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    token: 'fake-jwt-token'
                }),
            };
        } else {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'Invalid credentials' }),
            };
        }
    } catch (error) {
        console.error('Login error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' }),
        };
    }
};
