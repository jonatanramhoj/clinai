"use client";
import useFirebase from "@/hooks/useFirebase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Typewriter } from "react-simple-typewriter";

const taglines = [
  "Understanding your symptoms in seconds.",
  "AI health insights at your fingertips.",
  "Find the right care — fast, anywhere.",
  "Clinics near you, tailored to your symptoms.",
  "From chat to checkup in record time.",
  "Global health support. Local recommendations.",
];

export default function Login() {
  const { signinWithGoogle, user } = useFirebase();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [router, user]);

  return (
    <div className="w-full py-4 px-8">
      <h1 className="font-bold text-2xl">
        ClinAI <span className="text-gray-600">BETA</span>
      </h1>
      <div className="max-w-[600px] w-full m-auto my-20 px-4">
        <div className="text-center mb-20 h-[200px] flex items-center justify-center">
          <span className="font-bold text-3xl dark:text-gray-400">
            <Typewriter
              words={taglines}
              loop={5}
              cursor
              cursorStyle="_"
              typeSpeed={70}
              // deleteSpeed={50}
              // delaySpeed={1000}
              // onLoopDone={handleDone}
              // onType={handleType}
            />
          </span>
        </div>
        <button
          onClick={signinWithGoogle}
          className="mb-4 text-md font-bold w-full rounded-xl p-4 border border-gray-300 hover:bg-gray-50 dark:bg-white cursor-pointer dark:hover:bg-white/80 ease-in-out duration-200 text-gray-700"
        >
          Continue with Google
        </button>
        <div className="w-full justify-center px-4">
          <p className="dark:text-gray-200 text-center text-sm">
            By continuing, you agree to our{" "}
            <Link className="text-gray-500 underline" href="/terms">
              Terms
            </Link>{" "}
            and{" "}
            <Link className="text-gray-500 underline" href="/privacy">
              Privacy Policy
            </Link>
            . No account? No problem. We’ll create one for you.
          </p>
        </div>
      </div>
    </div>
  );
}
