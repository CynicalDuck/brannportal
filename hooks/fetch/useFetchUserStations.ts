import { useEffect, useState } from "react";
import { useSession } from "../authentication/useSession";
import { supabase } from "../../app/supabase";
export default function useFetchUserStations() {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<any>(null);

      // Get session
     const { session } = useSession();

     async function fetchData() {
        const { data, error } = await supabase
        .from("user_connection_station")
        .select(
            `*,
            station (*)
        `
        )
        .eq("user", session?.user?.id);

        if (data) {
            setData(data);
        } else {
            setError(error);
        }
  }

    useEffect(() => {
    fetchData();
  }, [session]);

  return { data, error };
}