import { doc, getDoc, serverTimestamp, setDoc } from "@firebase/firestore";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { Google } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase.config";
import { toast } from "react-toastify";

function OAuth() {
  const navigate = useNavigate();
  const onGoogleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Checking for user
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      // Create user if user doesnt exist
      if (!docSnap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate("/");
    } catch (error) {
      toast.error("Could not authorize with Google");
    }
  };
  return (
    <div className="my-2 w-100 d-flex justify-content-center">
      <button
        className="btn btn-link fw-bold small mx-auto"
        onClick={onGoogleClick}
      >
        <div className="d-flex justify-content-center align-items-center">
          <Google />
          <span className="ms-2">Continue with Google</span>
        </div>
      </button>
    </div>
  );
}

export default OAuth;
