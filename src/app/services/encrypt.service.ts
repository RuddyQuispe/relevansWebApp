import {Injectable} from '@angular/core';
import * as CryptoJS from 'crypto-js';
import {AesUtil} from '@app/model/util';
import {CONFIG} from '@config/config';

@Injectable({
    providedIn: 'root'
})
export class EncryptService {

    k = CONFIG.KEY_AES;

    constructor() {
    }

    enc(value) {
        const siv = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
        const salt = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
        const aesUtil = new AesUtil(128, 1000);

        const key = CryptoJS.enc.Utf8.parse(this.k);
        const iv = CryptoJS.enc.Utf8.parse(this.k);
        const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
            {
                keySize: 128 / 8,
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });

        return encrypted.toString();
    }

    des(value) {
        const key = CryptoJS.enc.Utf8.parse(this.k);
        const iv = CryptoJS.enc.Utf8.parse(this.k);
        const decrypted = CryptoJS.AES.decrypt(value, key, {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    enc2(value, tk) {
        const token = tk.toString().substring(tk.length - 16 , tk.length);
        const key = CryptoJS.enc.Utf8.parse(token);
        const iv = CryptoJS.enc.Utf8.parse(token);
        const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
            {
                keySize: 128 / 8,
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
        return encrypted.toString();
    }

    des2(value, tk) {
        try {
            const token = tk.toString().substring(tk.length - 16 , tk.length);
            const key = CryptoJS.enc.Utf8.parse(token);
            const iv = CryptoJS.enc.Utf8.parse(token);
            const decrypted = CryptoJS.AES.decrypt(value.toString().trim(), key, {
                keySize: 128 / 8,
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
            const plaintext = decrypted.toString(CryptoJS.enc.Utf8);
            return decrypted.toString(CryptoJS.enc.Utf8);
        } catch (e) {
            console.error(e);
        }
    }

    sha(value) {
        return CryptoJS.SHA1(value).toString();
    }
}
