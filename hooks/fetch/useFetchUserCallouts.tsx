import { useEffect, useState } from "react";
import { useSession } from "../authentication/useSession";
import { supabase } from "../../app/supabase";

export function useFetchUserCallouts() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  // Get session
  const { session } = useSession();

  async function fetchData() {
    try {
      if (!session) {
        return;
      }

      // Fetch all callouts for the user
      const { data, error } = await supabase
        .from("callouts")
        .select()
        .contains("users", [session?.user?.id]); // Filter callouts by user id

      if (data) {
        var returnData = {};

        // Calculate the count of callouts with date_start within the current month
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // January is 0, so we add 1 to get the correct month number

        const countThisMonth = data.filter(
          (callout: any) =>
            new Date(callout.date_start).getFullYear() === currentYear &&
            new Date(callout.date_start).getMonth() + 1 === currentMonth
        ).length;

        // Calculate the count of callouts with date_start within the current year
        const countThisYear = data.filter(
          (callout: any) =>
            new Date(callout.date_start).getFullYear() === currentYear
        ).length;

        const currentDay = currentDate.getDate(); // Get the day of the current date
        const countToday = data.filter(
          (callout: any) =>
            new Date(callout.date_start).getFullYear() === currentYear &&
            new Date(callout.date_start).getMonth() + 1 === currentMonth &&
            new Date(callout.date_start).getDate() === currentDay
        ).length;

        returnData = {
          data: data,
          countThisMonth: countThisMonth,
          countThisYear: countThisYear,
          countToday: countToday,
        };

        setData(returnData);
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
