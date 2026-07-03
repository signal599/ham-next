import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <div className="not-prose min-h-[calc(100vh-4rem)] flex items-center justify-center bg-base-200">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
