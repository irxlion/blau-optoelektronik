import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
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
                body: JSON.stringify({
                    success: true,
                    token: 'fake-jwt-token'
                }),
            };
        } else {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: 'Invalid credentials' }),
            };
        }
    } catch (error) {
        console.error('Login error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' }),
        };
    }
};
