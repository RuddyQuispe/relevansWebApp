import * as CryptoJS from 'crypto-js';
export class AesUtil {
  keySize: number;
  iterationCount: number;
  constructor(keySize: number, iterationCount: number) {
    this.keySize = keySize;
    this.iterationCount = iterationCount;
  }
  generateKey(salt: string, passPhrase: string){
    const key = CryptoJS.PBKDF2(
      passPhrase,
      CryptoJS.enc.Hex.parse(salt),
      { keySize: this.keySize, iterations: this.iterationCount });
    return key;
  }
  encrypt(salt: string, iv: string, passPhrase: string, plainText: string){
    const key = this.generateKey(salt, passPhrase);
    const encrypted = CryptoJS.AES.encrypt(
      plainText,
      key,
      { iv: CryptoJS.enc.Hex.parse(iv) });
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  }
  decrypt(salt, iv, passPhrase, cipherText) {
    const key = this.generateKey(salt, passPhrase);
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(cipherText)
    });
    const decrypted = CryptoJS.AES.decrypt(
      cipherParams,
      key,
      { iv: CryptoJS.enc.Hex.parse(iv) });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
