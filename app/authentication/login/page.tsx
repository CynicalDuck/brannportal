"use client";

// Import required
import React, { useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

// Import icons
import { PenTool } from "react-feather";

// Import components
import FeaturedCard from "@/components/Cards/FeaturedCard";
import BasicButton from "../../../components/Buttons/BasicButton";

// Import hooks

// Types

export default function Login() {
  // States
  const [signUp, setSignUp] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordConfirmError, setPassordConfirmError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  // Router & Pathname
  const router = useRouter();
  const pathname = usePathname();

  // Supabase
  const supabase = createClientComponentClient<Database>();

  // Fetching

  // Functions
  async function signInWithEmail() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (data.session) {
      router.replace("/");
    }
  }

  async function signUpWithEmail() {
    // Check email field
    let re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (re.test(email)) {
      setEmailError(false);
    } else {
      setEmailError(true);
    }

    // Check name field
    if (name.length < 3) {
      setNameError(true);
    } else {
      setNameError(false);
    }

    // Check password field
    if (password.length < 8) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }

    // Check if passwords are matching
    if (password === confirmPassword) {
      setPassordConfirmError(false);
    } else {
      setPassordConfirmError(true);
    }

    if (!emailError || !passwordError || !passwordConfirmError || !nameError) {
      const { data, error: errorCreate } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (data.user) {
        setSignUp(false);
        setSignUpSuccess(true);

        setTimeout(() => {
          setSignUpSuccess(false);
        }, 3000);
      }
      if (errorCreate) {
        setError(true);
        setErrorText(errorCreate.message);
      }
      console.log(errorCreate?.message);
    }
  }

  // Return
  if (signUp) {
    return (
      <div className="flex justify-center w-full">
        <div className="w-1/4">
          <FeaturedCard
            title="SIGN UP"
            className="shadow shadow-black bg-dark"
            icon={<PenTool />}
          >
            <div className="flex flex-col gap-2">
              <div className="flex flex-col">
                <div className="text-white text-sm">E-mail</div>
                <input
                  type="text"
                  className="rounded-[10px] border border-accent3 text-dark px-2"
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailError ? (
                  <div className="text-xs text-danger">
                    Please enter a valid email
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col">
                <div className="text-white text-sm">Name</div>
                <input
                  type="text"
                  className="rounded-[10px] border border-accent3 text-dark px-2"
                  onChange={(e) => setName(e.target.value)}
                />
                {nameError ? (
                  <div className="text-xs text-danger">Please your name</div>
                ) : null}
              </div>
              <div className="flex flex-col">
                <div className="text-white text-sm">Password</div>
                <input
                  type="password"
                  className="rounded-[10px] border border-accent3 text-dark px-2"
                  onChange={(e) => setPassword(e.target.value)}
                />
                {passwordError ? (
                  <div className="text-xs text-danger">
                    Please enter a valid password, at least 8 chars long
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col">
                <div className="text-white text-sm">Confirm password</div>
                <input
                  type="password"
                  className="rounded-[10px] border border-accent3 text-dark px-2"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {passwordConfirmError ? (
                  <div className="text-xs text-danger">
                    The passwords do not match, please try again!
                  </div>
                ) : null}
              </div>
              {error ? (
                <div className="text-danger mt-2 mb-2 text-xs">
                  {"Something went wrong: " + errorText}
                </div>
              ) : null}
              <BasicButton
                state={"success"}
                className="rounded-full shadow-xs shadow-black mt-4"
                onClick={() => signUpWithEmail()}
              >
                Sign up
              </BasicButton>
              <div className="flex flex-row justify-end px-5">
                <div
                  className="text-xs hover:cursor-pointer hover:text-accent2"
                  onClick={() => setSignUp(false)}
                >
                  Cancel
                </div>
              </div>
            </div>
          </FeaturedCard>
        </div>
      </div>
    );
  }

  if (forgotPassword) {
    return (
      <div className="w-1/4">
        <FeaturedCard
          title="FORGOT PASSWORD"
          className="shadow shadow-black bg-dark"
        >
          <div className="flex flex-col gap-1">
            <div className="text-white text-xs">
              Enter your e-mail below, if the e-mail exists in our database you
              will get a reset password link sent to you
            </div>
            <input
              type="text"
              className="rounded-[10px] border border-accent3 text-dark px-2"
            />
            <BasicButton state={"success"} className="mt-2">
              Reset password
            </BasicButton>
            <div className="flex flex-row justify-end px-1">
              <div
                className="text-xs hover:cursor-pointer hover:text-accent2"
                onClick={() => setForgotPassword(false)}
              >
                Cancel
              </div>
            </div>
          </div>
        </FeaturedCard>
      </div>
    );
  }

  return (
    <div className="flex row justify-center grow w-full">
      <div className="w-1/4">
        <FeaturedCard
          title="LOGIN"
          className="shadow shadow-black bg-dark py-2 px-2"
        >
          <div className="flex flex-col gap-1">
            <div className="text-white text-sm">E-mail</div>
            <input
              type="text"
              className="rounded-[10px] border border-accent3 text-dark px-2"
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="text-white text-sm">Password</div>
            <input
              type="password"
              className="rounded-[10px] border border-accent3 px-2 text-dark"
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex flex-row justify-between mb-4 px-1">
              <div
                className="text-xs hover:cursor-pointer hover:text-accent2"
                onClick={() => setSignUp(true)}
              >
                Sign up
              </div>
              <div
                className="text-xs hover:cursor-pointer hover:text-accent2"
                onClick={() => setForgotPassword(true)}
              >
                Forgot password?
              </div>
            </div>
            {signUpSuccess ? (
              <div className="text-success mt-2 mb-2">
                Your user have been created, please check your email for
                confirmation link
              </div>
            ) : null}
            <BasicButton
              state={"success"}
              className="rounded-full shadow-xs shadow-black"
              onClick={() => signInWithEmail()}
            >
              Log in
            </BasicButton>
          </div>
        </FeaturedCard>
      </div>
    </div>
  );
}
