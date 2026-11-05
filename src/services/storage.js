import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'devshelf:recursos';

// Obtiene todos los recursos almacenados
export function getAll() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Crea un nuevo recurso y lo guarda en localStorage
export function create(data) {
  const items = getAll();
  const newItem = {
    ...data,
    id: uuidv4(),
    fechaCreacion: new Date().toISOString()
  };
  items.push(newItem);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  return newItem;
}

// Calcula las estadísticas de los recursos guardados
export function getStats() {
  const items = getAll();
  const total = items.length;
  const favoritos = items.filter(item => item.favorito).length;
  const temas = new Set(items.map(item => item.tema)).size;

  return { total, favoritos, temas };
}
