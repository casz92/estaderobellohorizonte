// backend/prompt_generator.js
import { getAvailableRooms, getAllRooms } from 'backend/wix-api';
import { getPrompt } from 'backend/api';

function getDayName(date) {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return days[date.getDay()];
}

const BASE_TIME = (5 * 60 * 60 * 1000); // UTC-5
function getColombiaDate(baseDate = new Date()) {
  const colombiaMs = baseDate.getTime() - BASE_TIME; // UTC-5
  return new Date(colombiaMs);
}

function formatDateBlock(date) {
  const dayName = getDayName(date).toUpperCase();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${dayName} ${day}/${month}/${year}`;
}

function getTimestampMs(date) {
  return date.getTime().toString();
}

export async function generatePrompt() {
  const hoy = getColombiaDate();
  hoy.setHours(0, 0, 0, 0);

  const rooms = await getAllRooms();
  const bloques = [];

  for (let i = 0; i < 30; i++) {
    const checkIn = new Date(hoy);
    checkIn.setDate(hoy.getDate() + i);
    checkIn.setHours(0, 0, 0, 0);

    const checkOut = new Date(checkIn);
    checkOut.setDate(checkIn.getDate() + 1);
    checkOut.setHours(0, 0, 0, 0);

    const checkInMs = getTimestampMs(checkIn);
    const checkOutMs = getTimestampMs(checkOut);

    const disponibles = await getAvailableRooms(checkInMs, checkOutMs);

    bloques.push({
      date: new Date(checkIn),
      disponibles,
      rooms
    });
  }

  let disponibilidadTexto = '';

  for (const { date, disponibles, rooms } of bloques) {
    disponibilidadTexto += formatDateBlock(date) + '\n';

    for (const room of rooms) {
      const disponible = disponibles.some(item => item.roomId === room.roomId);
      const status = disponible ? 'Sí disponible' : 'No disponible';
      disponibilidadTexto += `- ${room.name}: ${status}\n`;
    }

    disponibilidadTexto += '\n';
  }

  const originalPrompt = await getPrompt();
  const updatedPrompt = originalPrompt.replace(/<disponibilidad>[\s\S]*?<\/disponibilidad>/, `<disponibilidad>\n${disponibilidadTexto}\n</disponibilidad>`);
  return updatedPrompt;
}