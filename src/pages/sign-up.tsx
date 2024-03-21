import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { api } from "../utils/api";

const SignUp = () => {
  const [error, setError] = useState("");
  const signUpMutation = api.user.createUser.useMutation({
    onSuccess: (result) => {
      // console.log(data);
      if (result.success) {
        void signIn();
      } else {
        console.log("💩", result);
        const errorAsString = String(result.error);
        setError(errorAsString);
      }
    },
  });
  async function signUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { name, email, password } =
      e.currentTarget as typeof e.currentTarget & {
        name: { value: string };
        email: { value: string };
        password: { value: string };
      };
    if (!name.value || !email.value || !password.value) {
      return;
    }

    await signUpMutation.mutateAsync({
      name: name.value,
      email: email.value,
      password: password.value,
    });
  }
  useEffect(() => {
    console.log(signUpMutation);
  }, [signUpMutation]);

  return (
    <div className="flex h-full flex-col items-center justify-center">
      {error ? (
        <div className="rounded-lg bg-red-500/20 p-4">{error}</div>
      ) : null}
      <form
        className="flex w-96 flex-col items-center justify-center rounded-lg bg-white/20 p-8"
        onSubmit={(evt) => void signUp(evt)}
      >
        <h1 className="mb-4 text-4xl font-bold">Opret Bruger</h1>
        <label className="flex w-full flex-col justify-center" htmlFor="email">
          Navn
          <input
            className="rounded-lg border border-gray-200 p-2 text-black placeholder:text-black/50"
            name="name"
            placeholder="John Doe"
            disabled={signUpMutation.isLoading}
            required
          />
        </label>
        <label className="flex w-full flex-col justify-center" htmlFor="email">
          Email
          <input
            className="rounded-lg border border-gray-200 p-2 text-black placeholder:text-black/50"
            type="email"
            name="email"
            placeholder="email@example.com"
            disabled={signUpMutation.isLoading}
            required
          />
        </label>
        <label className="mt-4 flex w-full flex-col justify-center">
          Kodeord
          <input
            className="rounded-lg border border-gray-200 p-2 text-black placeholder:text-black/50"
            type="password"
            name="password"
            placeholder="SeretPassword"
            disabled={signUpMutation.isLoading}
            required
          />
        </label>
        <button
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          type="submit"
          disabled={signUpMutation.isLoading}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
