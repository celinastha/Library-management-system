import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCdviCDTXimLkjHhBIfJ9_g3W-jBMQkcvs",
  authDomain: "library-management-11f5a.firebaseapp.com",
  projectId: "library-management-11f5a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
