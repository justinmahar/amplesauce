let envConfig = undefined;
if (process.env.GATSBY_FIREBASE_CONFIG) {
  try {
    envConfig = JSON.parse(process.env.GATSBY_FIREBASE_CONFIG ?? '');
  } catch (err) {
    console.error(err);
  }
}
export const firebaseConfig = envConfig;
