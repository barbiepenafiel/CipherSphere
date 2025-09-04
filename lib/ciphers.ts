// Cipher algorithms for CipherSphere

export type CipherType = 'ATBASH' | 'CAESAR' | 'VIGENERE';

export interface CipherResult {
  result: string;
  success: boolean;
  error?: string;
}

/**
 * ATBASH Cipher - Substitution cipher where A=Z, B=Y, C=X, etc.
 */
export function atbashCipher(text: string): CipherResult {
  try {
    const result = text
      .split('')
      .map(char => {
        if (char >= 'A' && char <= 'Z') {
          return String.fromCharCode('Z'.charCodeAt(0) - (char.charCodeAt(0) - 'A'.charCodeAt(0)));
        } else if (char >= 'a' && char <= 'z') {
          return String.fromCharCode('z'.charCodeAt(0) - (char.charCodeAt(0) - 'a'.charCodeAt(0)));
        }
        return char; // Non-alphabetic characters remain unchanged
      })
      .join('');

    return { result, success: true };
  } catch (error) {
    return { 
      result: '', 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

/**
 * Caesar Cipher - Shift cipher with specified shift value
 */
export function caesarCipher(text: string, shift: number, decrypt: boolean = false): CipherResult {
  try {
    if (shift < 0 || shift > 25) {
      return { 
        result: '', 
        success: false, 
        error: 'Shift value must be between 0 and 25' 
      };
    }

    const actualShift = decrypt ? -shift : shift;
    
    const result = text
      .split('')
      .map(char => {
        if (char >= 'A' && char <= 'Z') {
          const shifted = ((char.charCodeAt(0) - 'A'.charCodeAt(0) + actualShift + 26) % 26);
          return String.fromCharCode(shifted + 'A'.charCodeAt(0));
        } else if (char >= 'a' && char <= 'z') {
          const shifted = ((char.charCodeAt(0) - 'a'.charCodeAt(0) + actualShift + 26) % 26);
          return String.fromCharCode(shifted + 'a'.charCodeAt(0));
        }
        return char; // Non-alphabetic characters remain unchanged
      })
      .join('');

    return { result, success: true };
  } catch (error) {
    return { 
      result: '', 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

/**
 * Vigenère Cipher - Polyalphabetic substitution cipher
 */
export function vigenereCipher(text: string, key: string, decrypt: boolean = false): CipherResult {
  try {
    if (!key || key.length === 0) {
      return { 
        result: '', 
        success: false, 
        error: 'Key cannot be empty' 
      };
    }

    // Remove non-alphabetic characters from key and convert to uppercase
    const cleanKey = key.replace(/[^a-zA-Z]/g, '').toUpperCase();
    
    if (cleanKey.length === 0) {
      return { 
        result: '', 
        success: false, 
        error: 'Key must contain at least one alphabetic character' 
      };
    }

    let keyIndex = 0;
    const result = text
      .split('')
      .map(char => {
        if (char >= 'A' && char <= 'Z') {
          const keyChar = cleanKey[keyIndex % cleanKey.length];
          const keyShift = keyChar.charCodeAt(0) - 'A'.charCodeAt(0);
          const shift = decrypt ? -keyShift : keyShift;
          const shifted = ((char.charCodeAt(0) - 'A'.charCodeAt(0) + shift + 26) % 26);
          keyIndex++;
          return String.fromCharCode(shifted + 'A'.charCodeAt(0));
        } else if (char >= 'a' && char <= 'z') {
          const keyChar = cleanKey[keyIndex % cleanKey.length];
          const keyShift = keyChar.charCodeAt(0) - 'A'.charCodeAt(0);
          const shift = decrypt ? -keyShift : keyShift;
          const shifted = ((char.charCodeAt(0) - 'a'.charCodeAt(0) + shift + 26) % 26);
          keyIndex++;
          return String.fromCharCode(shifted + 'a'.charCodeAt(0));
        }
        return char; // Non-alphabetic characters remain unchanged, don't advance key
      })
      .join('');

    return { result, success: true };
  } catch (error) {
    return { 
      result: '', 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

/**
 * Main cipher function that routes to the appropriate algorithm
 */
export function applyCipher(
  text: string, 
  type: CipherType, 
  key?: string | number, 
  decrypt: boolean = false
): CipherResult {
  switch (type) {
    case 'ATBASH':
      return atbashCipher(text);
    
    case 'CAESAR':
      if (typeof key !== 'number') {
        return { 
          result: '', 
          success: false, 
          error: 'Caesar cipher requires a numeric shift value' 
        };
      }
      return caesarCipher(text, key, decrypt);
    
    case 'VIGENERE':
      if (typeof key !== 'string') {
        return { 
          result: '', 
          success: false, 
          error: 'Vigenère cipher requires a string key' 
        };
      }
      return vigenereCipher(text, key, decrypt);
    
    default:
      return { 
        result: '', 
        success: false, 
        error: 'Invalid cipher type' 
      };
  }
}
