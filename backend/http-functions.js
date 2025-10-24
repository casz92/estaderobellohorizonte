/*******************
 http-functions.js
********************

'http-functions.js' is a reserved backend file that lets you expose APIs that respond to fetch 
requests from external services.

Use this file to create functions that expose the functionality of your site as a service. 
This functionality can be accessed by writing code that calls this site's APIs as defined by the 
functions you create here.

To learn more about using HTTP functions, including the endpoints for accessing the APIs, see:
https://wix.to/0lZ9qs8

*********
 Example
*********

The following HTTP function example returns the product of 2 operands.

To call this API, assuming this HTTP function is located in a premium site that is published 
and has the domain "mysite.com", you would use this URL:

https://mysite.com/_functions/multiply?leftOperand=3&rightOperand=4

Note: To access the APIs for your site, use one of the endpoint structures documented here:
https://wix.to/rZ5Dh89

***/
/*
import { ok, badRequest } from 'wix-http-functions';

export function get_multiply(request) {

    const response = {
        "headers": {
            "Content-Type": "application/json"
        }
    }

    try {
        const leftOperand = parseInt(request.query["leftOperand"], 10);
        const rightOperand = parseInt(request.query["rightOperand"], 10);

        response.body = {
            "product": leftOperand * rightOperand
        }
        return ok(response);

    } catch (err) {
        response.body = {
            "error": err
        }
        return badRequest(response);
    }
}*/

// backend/http-functions.js
//import { updateDateInExternalService } from 'backend/todayModule';
import { ok, badRequest } from 'wix-http-functions';
import { getPrompt, putPrompt } from 'backend/api';

const BASE_TIME = (5 * 60 * 60 * 1000); // UTC-5


function getColombiaDate(baseDate = new Date()) {
  const colombiaMs = baseDate.getTime() - BASE_TIME; // UTC-5
  return new Date(colombiaMs);
}

function getDayName(date) {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return days[date.getDay()];
}

function getMonthName(date) {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return months[date.getMonth()];
}

function formatTodayHeader() {
  // const now = new Date();
  const now = getColombiaDate();
  const dayName = getDayName(now);
  const day = String(now.getDate()).padStart(2, '0');
  const monthName = getMonthName(now);
  const year = now.getFullYear();
  return `Hoy es ${dayName} ${day} de ${monthName} del ${year}`;
}

export async function get_today(request) {
  const prompt = await getPrompt();
  const today = formatTodayHeader();
  const updatedPrompt = prompt.replace(/<today>(.*?)<\/today>/, `<today>${today}</today>`);
  await putPrompt(updatedPrompt);
  return ok({
    body: today
  })
}