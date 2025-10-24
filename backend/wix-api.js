// backend/wix-api.js
import { fetch } from 'wix-fetch';
import { getToken, setToken } from 'backend/token';

const OAUTH_ENDPOINT = 'https://www.wixapis.com/oauth2/token';
const ROOMS_ENDPOINT = 'https://hotels.wixapps.net/api/rooms/search';
const ALL_ROOMS_ENDPOINT = 'https://hotels.wixapps.net/api/rooms';
const CLIENT_ID = '2f668e2f-37e6-4723-b5b2-22cc5ad60527';
const MAX_ATTEMPTS = 2;

export function getAnonymousToken() {
  const payload = {
    clientId: CLIENT_ID,
    grantType: 'anonymous'
  };

  return fetch(OAUTH_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  .then((response) => response.json())
  .then((body) => {
    if (body.access_token) {
      setToken("wix-token", body.access_token);
      return body.access_token;
    } else {
      console.warn('No se recibió access_token');
      return null;
    }
  })
  .catch((error) => {
    console.error('Error al obtener token anónimo:', error);
    return null;
  });
}

export async function getAvailableRooms(checkIn, checkOut, attempt = 1) {
  const payload = {
    checkIn,
    checkOut,
    adults: "1",
    children: "0"
  };

  try {
    // const token = await getToken("wix-token");
    const token = await getAnonymousToken();

    const response = await fetch(ROOMS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(payload)
    });

    if (response.status === 200) {
      const raw = await response.json();
      const rooms = raw.map(item => item.room);
      return rooms;
    }

    console.warn(`getAvailableRooms intento ${attempt} fallido con status ${response.status}`);

    if (attempt < MAX_ATTEMPTS) {
      const newToken = await getAnonymousToken();
      if (!newToken) return [];
      return getAvailableRooms(checkIn, checkOut, attempt + 1);
    }

    console.error(`getAvailableRooms falló definitivamente en intento ${attempt}`);
    return [];

  } catch (error) {
    console.error(`Error en getAvailableRooms intento ${attempt}:`, error);
    return [];
  }
}

export async function getAllRooms(newToken = null, attempt = 1) {
  try {
    // const token = await getToken("wix-token");
    const token = await getAnonymousToken();
    console.log(token);

    const response = await fetch(ALL_ROOMS_ENDPOINT, {
      method: 'GET',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    });

    console.log(response.status);

    if (response.status === 200) {
      return await response.json();
    }

    console.warn(`getAllRooms intento ${attempt} fallido con status ${response.status}`);

    if (attempt < MAX_ATTEMPTS) {
      const newToken = await getAnonymousToken();
      if (!newToken) return [];
      return getAllRooms(newToken, attempt + 1);
    }

    console.error(`getAllRooms falló definitivamente en intento ${attempt}`);
    return [];

  } catch (error) {
    console.error(`Error en getAllRooms intento ${attempt}:`, error);
    return [];
  }
}