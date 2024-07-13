import * as crypto from "crypto";
import * as Config from "../config/Enviornment";
import * as CryptoJS from "crypto-js";

let password = "";
let confirmPassword = ""
let conversionOutput: string;

/**
 * @author Balan K K  
 * @date  01-05-2024
 * @description This function return password encryption.
 * @param {String} text
 */
export let hashPassword = async (text) => {

  return await new Promise((resolve, reject) => {
    const hash = crypto.createHmac("sha256", Config.SERVER.SALT);
    hash.update(text.toString());
    resolve(hash.digest("hex"));
  });
};

/**
 * @author Balan K K
 * @date  01-05-2024
 * @description This function return decrypted item for given encryption using cryptojs
 * @param {String} encrypted
 */
export let encrypt = (textToConvert) => {

  return (conversionOutput = CryptoJS.AES.encrypt(textToConvert.trim(), password.trim()).toString());
};

/**
 * @author Balan K K
 * @date  01-05-2024
 * @description This function return encrypted item for given string using cryptojs
 * @param {String} text
 */
export let decrypt = (textToConvert) => {

  return (conversionOutput = CryptoJS.AES.decrypt(textToConvert.trim(), password.trim()).toString(CryptoJS.enc.Utf8));
};


// Function to generate a random password
// export let generateRandomPassword = (length)=>{
//   return crypto.randomBytes(length).toString('base64').slice(0, length);
// }


export let generateRandomPassword = (length) => {

  const specialCharacters = '!@#$%^&*'
  const digits = '0123456789';
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  const allCharacters = letters + specialCharacters + digits;

  let password = '';
  password += specialCharacters[Math.floor(Math.random() * specialCharacters.length)];
  password += digits[Math.floor(Math.random() * digits.length)];
  password += letters[Math.floor(Math.random() * letters.length)];

  for (let i = 3; i < length; i++) {
    password += allCharacters[Math.floor(Math.random() * allCharacters.length)];
  }

  // Shuffle the password to ensure randomness
  password = password.split('').sort(() => 0.5 - Math.random()).join('');
  return password;
}