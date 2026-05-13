import { initializeApp }
  from "firebase/app";

import {
  getStorage,
} from "firebase/storage";

const firebaseConfig = {

  apiKey:
    "AIzaSyCpmgBm8tuFiVHNPddDa2YDB4-hlqc7mbw",

  authDomain:
    "flower-manage.firebaseapp.com",

  projectId:
    "flower-manage",

  storageBucket:
    "flower-manage.appspot.com",

  messagingSenderId:
    "708055887398",

  appId:
    "1:708055887398:web:2a847355ff11ebaa7ac0e7",
};

const app =
  initializeApp(firebaseConfig);

export const storage =
  getStorage(app);