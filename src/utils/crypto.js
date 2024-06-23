// utils/crypto.js
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'my_secret_key'; // Asegúrate de mantener esta clave segura y fuera del código fuente en producción

export const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

export const decrypt = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
