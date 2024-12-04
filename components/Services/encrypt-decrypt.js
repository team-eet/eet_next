const crypto = require('crypto')
const encryptionType = 'aes-256-cbc'
const encryptionEncoding = 'base64'
const bufferEncryption = 'utf-8'
const AesKey = 'EET@english_secret2021newProject'
const AesIV = 'eng@peafowl1_eet'

const EncryptData = (str) => {
    const val = JSON.stringify(str)
    const key = Buffer.from(AesKey, bufferEncryption)
    const iv = Buffer.from(AesIV, bufferEncryption)
    const cipher = crypto.createCipheriv(encryptionType, key, iv)
    // console.log(cipher)
    // let a = cipher.update(val, bufferEncryption, encryptionEncoding)
    let encrypted = cipher.update(val, bufferEncryption, encryptionEncoding)
    encrypted += cipher.final(encryptionEncoding)
    // encrypted = encrypted.replace(/[/]/g, '_')
    // // encrypted = encrypted.replace(/[+]/g, '-')
    encrypted = encrypted.replace(/\//g, '_').replace(/\+/g, '-');

    return encrypted
}

const DecryptData = (str) => {
    const buff = Buffer.from(str, encryptionEncoding)
    const key = Buffer.from(AesKey, bufferEncryption)
    const iv = Buffer.from(AesIV, bufferEncryption)
    const decipher = crypto.createDecipheriv(encryptionType, key, iv)
    const deciphered = decipher.update(buff) + decipher.final()
    return JSON.parse(deciphered)
}

const SHAEncryptData = (str) => {
    //creating hash object
    const hash = crypto.createHash('sha256')
    //passing the data to be hashed
    const data = hash.update(AesIV, 'utf-8')
    //Creating the hash in the required format
    const gen_hash = data.digest('hex')

    return gen_hash
}

export { EncryptData, DecryptData, SHAEncryptData }