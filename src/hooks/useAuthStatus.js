import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase.config";

export const useAuthStatus = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState(null);
  const [dataUser, setDataUser] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoggedIn(true);
        setUserId(user.uid);

        // Dapatkan data pengguna dari Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setDataUser(userData);
          setIsAdmin(userData.isAdmin || false); // Set isAdmin berdasarkan data pengguna
        }
      }
      setCheckingStatus(false);
    });

    return () => {
      unsubscribe(); // Unsubscribe dari event listener saat komponen dibongkar
      isMounted.current = false;
    };
  }, []);

  return { loggedIn, checkingStatus, isAdmin, userId, dataUser };
};
