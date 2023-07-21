"use client";

// Import required
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";

// Import hooks

// Types

export default function Login() {
  // States
  const [signUp, setSignUp] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);

  // Router
  const router = useRouter();

  // Supabase
  const supabase = createClientComponentClient<Database>();
  async function getSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      await supabase.auth.signOut();
    }

    setTimeout(() => {
      router.replace("/authentication/login");
    }, 1000);
  }

  useEffect(() => {
    getSession();
  });

  // Fetching

  // Functions

  // Return
  return <div className="text-white">Loggin out...</div>;
}
