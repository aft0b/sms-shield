const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import cors middleware

const app = express();
const PORT = process.env.PORT || 3000; // Use environment variable for port or default to 3000

// Middleware to enable CORS for all origins.
// In a production environment, you might want to restrict this to specific origins.
app.use(cors());

// Health check endpoint (good practice for deployment)
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Website Status Checker Backend is running!' });
});

app.get('/check', async (req, res) => {
    let { url } = req.query;

    console.log(`[${new Date().toISOString()}] Received check request for URL: ${url}`);

    // --- Input Validation ---
    if (!url) {
        console.warn(`[${new Date().toISOString()}] Bad Request: No URL provided.`);
        return res.status(400).json({
            status: 'error',
            message: 'No URL provided. Please include a "url" query parameter.'
        });
    }

    let targetUrl;
    try {
        // Ensure the URL has a protocol, default to https for robustness
        const prefixedUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
        targetUrl = new URL(prefixedUrl);
    } catch (parseError) {
        console.warn(`[${new Date().toISOString()}] Invalid URL format for "${url}": ${parseError.message}`);
        return res.status(400).json({
            status: 'error',
            message: `Invalid URL format: ${url}. Please provide a valid web address.`,
            originalError: parseError.message
        });
    }

    // Use the origin (protocol + hostname) for the check to avoid path-specific issues
    // and to be more aligned with "website status" rather than "page status"
    const fullUrlToCheck = targetUrl.origin;

    try {
        const response = await axios.get(fullUrlToCheck, {
            timeout: 8000, // Timeout in milliseconds (8 seconds)
            headers: {
                'User-Agent': 'WebsiteStatusChecker/1.0 (Node.js/Axios)', // Custom User-Agent
                'Accept': 'text/html,application/xhtml+xml,application/json', // Broader accept
            },
            // Validate all status codes. We'll handle them in the then/catch block.
            // This prevents axios from throwing an error for 4xx or 5xx responses.
            validateStatus: () => true,
        });

        console.log(`[${new Date().toISOString()}] URL: ${fullUrlToCheck}, HTTP Status: ${response.status}`);

        let statusResult;
        let messageDetail;

        if (response.status >= 200 && response.status < 400) {
            // 2xx (Success) or 3xx (Redirection) are generally considered 'up'
            statusResult = 'up';
            messageDetail = `Responded with status ${response.status}.`;
        } else if (response.status >= 400 && response.status < 500) {
            // 4xx Client Errors (e.g., 404 Not Found, 403 Forbidden) often mean the site is 'up' but content is not accessible
            statusResult = 'up_with_client_error'; // More specific status
            messageDetail = `Responded with client error status ${response.status}. Site is reachable but resource might be unavailable/forbidden.`;
        } else if (response.status >= 500) {
            // 5xx Server Errors (e.g., 500 Internal Server Error, 503 Service Unavailable) mean the site is 'down' or experiencing issues
            statusResult = 'down';
            messageDetail = `Responded with server error status ${response.status}. Server issues detected.`;
        } else {
            // Catch any other unexpected status codes
            statusResult = 'unknown';
            messageDetail = `Responded with unknown status ${response.status}.`;
        }

        res.status(200).json({ // Always respond with 200 if the check itself was successful
            status: statusResult,
            httpCode: response.status,
            message: `${targetUrl.hostname} is ${statusResult.toUpperCase().replace('_', ' ')}. ${messageDetail}`,
            checkedUrl: fullUrlToCheck
        });

    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error checking URL ${fullUrlToCheck}:`, error.message);

        let statusResult = 'down';
        let errorMessage = `Could not reach ${targetUrl.hostname}.`;

        if (axios.isAxiosError(error)) {
            if (error.code === 'ECONNABORTED') {
                errorMessage = `Timeout: ${targetUrl.hostname} took too long to respond (${error.config.timeout}ms).`;
            } else if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
                errorMessage = `DNS Resolution Error: ${targetUrl.hostname} could not be found. (Domain might not exist or network issue)`;
            } else if (error.code === 'ECONNREFUSED' || error.code === 'ECONNRESET') {
                errorMessage = `Connection Refused: ${targetUrl.hostname} refused the connection. (Server might be down or firewall blocking)`;
            } else {
                errorMessage = `Network Error: ${error.message}.`;
            }
        } else {
            errorMessage = `An unexpected error occurred: ${error.message}`;
        }

        res.status(500).json({ // Respond with 500 for internal server errors/unreachable targets
            status: 'down',
            error: error.code || 'UNKNOWN_ERROR',
            message: errorMessage,
            checkedUrl: fullUrlToCheck
        });
    }
});

// Start the server
const server = app.listen(PORT, () => {
    console.log(`✅ Backend server running on http://localhost:${PORT}`);
    console.log(`Backend API endpoint: http://localhost:${PORT}/check?url=example.com`);
});

// Graceful shutdown (optional, but good for production)
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});