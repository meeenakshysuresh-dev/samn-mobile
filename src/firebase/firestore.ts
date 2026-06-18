import { doc, getFirestore, serverTimestamp } from '@react-native-firebase/firestore';

import { FIRESTORE_COLLECTIONS } from './config';

export { serverTimestamp };

const db = () => getFirestore();

export const userDocument = (uid: string) => doc(db(), FIRESTORE_COLLECTIONS.users, uid);
