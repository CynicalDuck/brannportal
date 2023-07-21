// useAuth.tsx

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";

const supabase = createClientComponentClient<Database>();

export function useSession() {
  const [session, setSession] = useState<any>(null);

  async function getSession() {
    const { data } = await supabase.auth.getSession();
    setSession(data.session);
  }

  useEffect(() => {
    getSession();
  }, []);

  return { session };
}
