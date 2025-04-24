import {
  signInWithPopup,
  GoogleAuthProvider,
  User,
  signOut,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { auth, db } from "@/firebase/firebase";
import { Diagnosis } from "@/models/Types";

const provider = new GoogleAuthProvider();

const useFirebase = () => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  const signinWithGoogle = async () => {
    try {
      setLoading(true);
      const { user } = await signInWithPopup(auth, provider);
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        // add user to db if they doesn't exist
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: new Date(),
          lastLogin: new Date(),
        });
      } else {
        // optionally update the user data
        await setDoc(
          userDocRef,
          {
            lastLogin: new Date(),
          },
          {
            merge: true,
          }
        );
      }

      setUser(user);
    } catch (error) {
      console.warn(error);
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  const saveDiagnosis = async (diagnosis: Diagnosis) => {
    if (!user?.uid) return;

    try {
      const diagnosisRef = collection(db, `users/${user.uid}/diagnosis`);
      const newDiagnosisDocRef = await addDoc(diagnosisRef, diagnosis);

      console.log("Diagnosis saved with ID: ", newDiagnosisDocRef.id);
    } catch (error) {
      console.error(error);
    }
  };

  const getDiagnosisHistory = useCallback(async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      const diagnosisRef = collection(db, `users/${user.uid}/diagnosis`);
      const snapshot = await getDocs(diagnosisRef);

      const diagnoses = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          symptom: data.symptom,
          diagnosis: data.diagnosis,
          clinics: data.clinics, // assuming already simplified when saved
          date:
            data.date instanceof Timestamp
              ? data.date.toDate()
              : new Date(data.date),
        } as Diagnosis;
      });

      return diagnoses;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  return {
    signinWithGoogle,
    signOutUser,
    user,
    loading,
    saveDiagnosis,
    getDiagnosisHistory,
  };
};

export default useFirebase;
