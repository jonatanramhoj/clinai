import { signInWithPopup, GoogleAuthProvider, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "@/firebase/firebase";

const provider = new GoogleAuthProvider();

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  const signinWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.warn(error);
    }
  };

  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  return {
    signinWithGoogle,
    user,
  };
};

export default useAuth;
