import * as argon2 from 'argon2';

export const encryptPassword = async (password: string): Promise<string> => {
  try {
    const hashedPassword = await argon2.hash(password);

    return hashedPassword;
  } catch (error: any) {
    throw new Error('An unexpected error occured.');
  };
};

export const checkPassword = async (password: string, hash: string): Promise<boolean> => {
  try {
    const verified = await argon2.verify(hash, password);
    return verified;
  } catch (error) {
    console.log(error);
    throw new Error('an error occured when verifying login details.');
  };
};