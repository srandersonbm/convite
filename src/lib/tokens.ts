import { customAlphabet } from "nanoid";

// Alfabeto sem caracteres ambíguos (0/O, 1/l/I) — o token não costuma ser
// digitado manualmente, mas evita confusão em prints/mensagens.
const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
export const generateToken = customAlphabet(alphabet, 14);
