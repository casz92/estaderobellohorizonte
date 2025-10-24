// backend/api.js
import { getToken, setToken } from 'backend/token';
import { fetch } from 'wix-fetch';

const BASE_URL = 'https://back.logichatplus.com';
const LOGIN_ENDPOINT = `${BASE_URL}/auth/login`;
const PROMPT_ENDPOINT = `${BASE_URL}/prompt/29`;
const EMAIL = 'casg92@gmail.com';
const PASSWORD = '12345678'

export async function getPrompt(attempt = 1) {
  if(attempt > 2) return "";
  // const token = await getToken("token");
  const tokens = await login(EMAIL, PASSWORD);
  
  if (!tokens.token && !tokens.cookie) {
    return "";
  }

  return await fetch(PROMPT_ENDPOINT, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${tokens.token}`,
      'Connection': 'keep-alive',
      'Cookie': tokens.cookie
    },
    credentials: "include"
  })
  .then(async (response) => {
   const status = response.status;
    if (status === 200) {
      const body = await response.json();
      return body.prompt;   
    } else {
      await login(EMAIL, PASSWORD);
      return getPrompt(attempt + 1);
    }
  }).catch((error) => {
    console.error('Error en getPrompt:', error);
    return "";
  });
}

export async function putPrompt(data, attempt = 1) {
  if(attempt > 2) {
    console.warn(`Max attempt is over ${attempt}`);
    return false;
  }
  // const token = await getToken("token");
  const tokens = await login(EMAIL, PASSWORD);
  if(!tokens.token && !tokens.cookie) {
    return false;
  }
  // const p = await getPrompt();
  const payload = {prompt: data};

  return await fetch(PROMPT_ENDPOINT, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${tokens.token}`,
      'Content-Type': 'application/json',
      'Cookie': tokens.cookie
    },
    body: JSON.stringify(payload),
    credentials: 'include'
  })
  .then((response) => response.json())
  .then(async (body) => {
    console.log(body);
    if (!body.error) {
      return true;
    } else if (attempt <= 1) {
      console.warn('Error en body, reintentando...');
      await login(EMAIL, PASSWORD);
      return putPrompt(data, attempt + 1);
    } else {
      return false;
    }
  })
  .catch((error) => {
    console.error('Error en putPrompt:', error);
    return false;
  });
}

export async function login(email, password) {
  const payload = {
    email: email,
    password: password,
    remember: false
  };

  return await fetch(LOGIN_ENDPOINT, {
    method: 'POST',
    headers: {
      'sec-ch-ua-platform': '"Windows"',
      'Authorization': 'undefined',
      'Referer': 'https://acceso.logichatplus.com/',
      'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
      'sec-ch-ua-mobile': '?0',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  .then(async (response) => {
    const body = await response.json();
    const cookie = response.headers.get('Set-Cookie');
    console.log("login: Cookie: " + cookie + " Token: " + body.token);
    if (body.token && cookie) {
      console.log('Login success');
      setToken('cookie', cookie);
      setToken('token', body.token);
      return {token: body.token, cookie: cookie};
    } else {
      console.warn('Login fallido: no se recibieron ambos tokens');
      return {token: null, cookie: null};
    }
  })
  .catch((error) => {
    console.error('Error en login:', error);
    return {token: null, cookie: null};
  });
}
