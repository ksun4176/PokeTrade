import crypto from "crypto";

export function encrypt(token: string) {
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    Buffer.from(process.env.API_ENCRYPT_KEY!, 'base64'), 
    Buffer.from(process.env.API_ENCRYPT_IV!, 'base64')
  );
  let encryptedToken = cipher.update(token, 'utf8', 'base64');
  encryptedToken += cipher.final('base64');
  
  return encryptedToken
}

export function decrypt(encryptedToken: string) {
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm", 
    Buffer.from(process.env.API_ENCRYPT_KEY!, 'base64'), 
    Buffer.from(process.env.API_ENCRYPT_IV!, 'base64')
  );
  
  let token = decipher.update(encryptedToken, 'base64', 'utf8');
  token += decipher.final('utf8');

  return token;
}