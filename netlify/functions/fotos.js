const crypto = require('crypto');

// Función para obtener imágenes de una carpeta en Cloudinary
exports.handler = async (event, context) => {
    const { carpeta } = event.queryStringParameters || {};
    
    if (!carpeta) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Carpeta no especificada' })
        };
    }

    const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'dyf5jzuhl';
    const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
    const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

    if (!CLOUDINARY_API_SECRET) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'API Secret no configurado' })
        };
    }

    try {
        // Parámetros para la API de Cloudinary
        const params = {
            prefix: `${carpeta}/`,
            max_results: 500
        };

        // Crear firma para la solicitud autenticada
        const timestamp = Math.floor(Date.now() / 1000);
        const signature = createSignature(params, timestamp, CLOUDINARY_API_SECRET);

        // URL de la API de Cloudinary
        const queryString = new URLSearchParams({
            ...params,
            timestamp: timestamp,
            signature: signature,
            api_key: CLOUDINARY_API_KEY
        }).toString();

        const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/resources/image?${queryString}`;

        const response = await fetch(url);
        const data = await response.json();

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data.resources || [])
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error al cargar imágenes' })
        };
    }
};

// Crear firma SHA1 para autenticación en Cloudinary
function createSignature(params, timestamp, apiSecret) {
    const paramStr = Object.keys(params)
        .sort()
        .map(key => `${key}=${params[key]}`)
        .join('&') + `timestamp=${timestamp}`;
    
    return crypto
        .createHash('sha1')
        .update(paramStr + apiSecret)
        .digest('hex');
}
