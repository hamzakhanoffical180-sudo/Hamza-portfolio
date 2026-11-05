import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCociXI0zGdJ1AdOr4h2LwkB40sznLIqNs",
  authDomain: "hamza-portfolio-a8235.firebaseapp.com",
  projectId: "hamza-portfolio-a8235",
  storageBucket: "hamza-portfolio-a8235.firebasestorage.app",
  messagingSenderId: "388827194918",
  appId: "1:388827194918:web:edcdf49d48d723772a28e7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
