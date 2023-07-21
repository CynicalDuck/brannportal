// useAuth.tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";

const supabase = createClientComponentClient<Database>();

export function useAuth() {
  const [session, setSession] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  async function getSession() {
    const { data } = await supabase.auth.getSession();
    setSession(data.session);

    if (!data.session && !pathname.includes("authentication")) {
      router.replace("/authentication/login");
    }
  }

  useEffect(() => {
    getSession();
  }, []);

  return { session };
}
