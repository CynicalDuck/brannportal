// useSession.tsx

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";

const supabase = createClientComponentClient<Database>();

export function useSession() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Set up an event listener for changes in authentication status
    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      // If the session exists, set it in the state
      if (session) {
        setSession(session);
      } else {
        // Otherwise, clear the session from the state
        setSession(null);
      }
    });

    // Call the onAuthStateChange event to get the initial session status
    const initialSession = supabase.auth.getSession();
    if (initialSession) {
      setSession(initialSession);
    }

    // Cleanup the event listener on unmount
    return () => {
      authListener.data.subscription.unsubscribe();
    };
  }, []);

  return { session };
}
