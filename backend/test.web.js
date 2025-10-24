/************
.web.js file
************

Backend '.web.js' files contain functions that run on the server side and can be called from page code.

Learn more at https://dev.wix.com/docs/develop-websites/articles/coding-with-velo/backend-code/web-modules/calling-backend-code-from-the-frontend

****/

/**** Call the sample multiply function below by pasting the following into your page code:

import { multiply } from 'backend/new-module.web';

$w.onReady(async function () {
   console.log(await multiply(4,5));
});

****/

import { Permissions, webMethod } from "wix-web-module";
import { getToken, setToken} from 'backend/token'
import { getAvailableRooms, getAllRooms } from 'backend/wix-api';
import { getPrompt, putPrompt } from 'backend/api';
import { generatePrompt } from 'backend/prompt_generator';

export const multiply = webMethod(
  Permissions.Anyone, 
  (factor1, factor2) => { 
    return factor1 * factor2 
  }
);

export const gettoken = webMethod(
  Permissions.Anyone, 
  (key) => { 
    return getToken(key);
  }
);

export const settoken = webMethod(
  Permissions.Anyone, 
  (key, value) => { 
    return setToken(key, value);
  }
);

export const getallRooms = webMethod(
  Permissions.Anyone,
  () => {
    return getAllRooms();
  }
);

export const getavailableRooms = webMethod(
  Permissions.Anyone,
  (checkIn, checkOut) => {
     return getAvailableRooms(checkIn, checkOut);
  }
);

export const getprompt = webMethod(
  Permissions.Anyone,
  () => {
     return getPrompt();
  }
);

export const putprompt = webMethod(
  Permissions.Anyone,
  (data) => {
     return putPrompt(data);
  }
);

export const generateprompt = webMethod(
  Permissions.Anyone,
  () => {
     return generatePrompt();
  }
);