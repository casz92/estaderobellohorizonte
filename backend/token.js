// backend/token.js
import wixData from 'wix-data';

const COLLECTION_NAME = 'logichat';

export function getToken(token) {
  return wixData.query(COLLECTION_NAME)
    .eq('title', token)
    .limit(1)
    .find()
    .then((result) => {
      if (result.items.length > 0) {
        return result.items[0].value;
      } else {
        return null;
      }
    })
    .catch((error) => {
      console.error(`Error al obtener el token "${token}":`, error);
      throw new Error(`No se pudo obtener el token "${token}"`);
    });
}

export async function setToken(token, value) {
  return await wixData.query(COLLECTION_NAME)
    .eq('title', token)
    .limit(1)
    .find()
    .then(async (result) => {
      if (result.items.length > 0) {
        const item = result.items[0];
        item.value = value;
        return await wixData.update(COLLECTION_NAME, item);
      } else {
        const newItem = {
          title: token,
          value: value
        };
        return await wixData.insert(COLLECTION_NAME, newItem).catch((error) => {
          console.error(`Error al guardar el token "${token}":`, error);
        });
      }
    })
    .catch((error) => {
      console.error(`Error al guardar el token "${token}":`, error);
      throw new Error(`No se pudo guardar el token "${token}"`);
    });
}