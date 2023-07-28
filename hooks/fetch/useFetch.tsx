import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useSession } from "../authentication/useSession";
import { Database } from "@/types/supabase";

const supabase = createClient<Database>(
  process.env.SUPABASE_URL || "https://utyrupymjvaxmlaovnrr.supabase.co",
  process.env.SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0eXJ1cHltanZheG1sYW92bnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk4NTAxMDMsImV4cCI6MjAwNTQyNjEwM30.A7yIOvujHwmUqD3OglGpx--69AkQWXVMEu6D1mkWjTg"
);

export function useFetch(from: string) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  // Get session
  const { session } = useSession();

  async function fetchData() {
    try {
      if (!session) {
        console.error("User not authenticated. Please sign in.");
        return;
      }
      const { data, error } = await supabase.from(from).select();

      if (data) {
        setData(data);
      }
      if (error) {
        setError(error);
      }
    } catch (error) {
      setError(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [session]);

  return { data, error };
}
