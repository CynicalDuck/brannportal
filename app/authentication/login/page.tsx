"use client";

// Import required
import React, { useState } from "react";

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

  // Fetching

  // Functions

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
            <div className="flex flex-col gap-1">
              <div className="text-white text-sm">E-mail</div>
              <input
                type="text"
                className="rounded-[10px] border border-accent3 text-dark px-2"
              />
              <div className="text-white text-sm">Name</div>
              <input
                type="text"
                className="rounded-[10px] border border-accent3 text-dark px-2"
              />
              <div className="text-white text-sm">Password</div>
              <input
                type="password"
                className="rounded-[10px] border border-accent3 text-dark px-2"
              />
              <div className="text-white text-sm">Confirm password</div>
              <input
                type="password"
                className="rounded-[10px] border border-accent3 mb-4 text-dark px-2"
              />
              <BasicButton
                state={"success"}
                className="rounded-full shadow-xs shadow-black"
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
        <FeaturedCard title="LOGIN" className="shadow shadow-black bg-dark">
          <div className="flex flex-col gap-1">
            <div className="text-white text-sm">E-mail</div>
            <input
              type="text"
              className="rounded-[10px] border border-accent3 text-dark px-2"
            />
            <div className="text-white text-sm">Password</div>
            <input
              type="password"
              className="rounded-[10px] border border-accent3 px-2 text-dark"
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
            <BasicButton
              state={"success"}
              className="rounded-full shadow-xs shadow-black"
            >
              Log in
            </BasicButton>
          </div>
        </FeaturedCard>
      </div>
    </div>
  );
}
