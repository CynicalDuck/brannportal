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
        .from("user_connection_callout")
        .select(`*, callout(*, department (*), station (*))`)
        .eq("user", session?.user.id);

      if (data) {
        var returnData = {};

        // Calculate the count of callouts with date_start within the current month
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // January is 0, so we add 1 to get the correct month number

        const countThisMonth = data.filter(
          (callout: any) =>
            new Date(callout.callout.date_start).getFullYear() ===
              currentYear &&
            new Date(callout.callout.date_start).getMonth() + 1 === currentMonth
        ).length;

        // Calculate the count of callouts with date_start within the current year
        const countThisYear = data.filter(
          (callout: any) =>
            new Date(callout.callout.date_start).getFullYear() === currentYear
        ).length;

        // Calculate the count of callouts with date_start within the current day
        const currentDay = currentDate.getDate(); // Get the day of the current date
        const countToday = data.filter(
          (callout: any) =>
            new Date(callout.callout.date_start).getFullYear() ===
              currentYear &&
            new Date(callout.callout.date_start).getMonth() + 1 ===
              currentMonth &&
            new Date(callout.callout.date_start).getDate() === currentDay
        ).length;

        // Get data on smoke exposure
        var exposedMinutes = 0;
        var countExposed = 0;
        data.forEach((item) => {
          if (item.callout.exposed_to_smoke) {
            exposedMinutes =
              exposedMinutes + item.callout.exposed_to_smoke_time;
            countExposed++;
          }
        });

        // Sort the data based on the 'date_start' field from the related 'callout' table
        const sortedData = data.sort((a: any, b: any) => {
          const dateA: any = new Date(a.callout?.date_start || "");
          const dateB: any = new Date(b.callout?.date_start || "");
          return dateB - dateA;
        });

        returnData = {
          data: sortedData,
          countThisMonth: countThisMonth,
          countThisYear: countThisYear,
          countToday: countToday,
          exposedToSmokeTime: exposedMinutes,
          exposedToSmokeCount: countExposed,
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
