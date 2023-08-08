"use client";

// Import required
import React, { useState, useEffect } from "react";
import { supabase } from "../../../app/supabase";

// Import icons
import { Home, Settings as SettingsIcon, Info } from "react-feather";

// Import components
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BasicButton from "@/components/Buttons/BasicButton";
import { Progress } from "@/components/ui/progress";

// Import hooks
import { useSession } from "@/hooks/authentication/useSession";
import { useFetchUserCallouts } from "@/hooks/fetch/useFetchUserCallouts";
import MapCallouts from "@/components/Maps/MapCallouts";

// Types

export default function Profile({ params }: { params: { id: string } }) {
  // States
  const [active, setActive] = useState<string>("Dashboard");
  const [haveAccess, setHaveAccess] = useState<boolean>(false);
  const [activeProfile, setActiveProfile] = useState<any>(null);
  const [showPendingRequests, setShowPendingRequests] = useState(false);
  const [profileCallouts, setProfileCallouts] = useState<any>(null);

  // Auth
  const { session } = useSession();

  // Fetching

  // get profile for the given user
  async function fetchUserProfile() {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user", params.id);

    if (error) {
      alert(
        "Something went wrong while fetching the userProfile data: " +
          error.message
      );
    } else {
      setActiveProfile(data[0]);

      // Get the callouts for the given user
      // Fetch all callouts for the user
      const { data: dataCallouts, error: errorCallouts } = await supabase
        .from("user_connection_callout")
        .select(`*, callout(*, department (*), station (*))`)
        .eq("user", params.id);

      if (dataCallouts) {
        var returnData = {};

        // Calculate the count of callouts with date_start within the current month
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // January is 0, so we add 1 to get the correct month number

        const countThisMonth = dataCallouts.filter(
          (callout: any) =>
            new Date(callout.callout.date_start).getFullYear() ===
              currentYear &&
            new Date(callout.callout.date_start).getMonth() + 1 === currentMonth
        ).length;

        // Calculate the count of callouts with date_start within the current year
        const countThisYear = dataCallouts.filter(
          (callout: any) =>
            new Date(callout.callout.date_start).getFullYear() === currentYear
        ).length;

        // Calculate the count of callouts with date_start within the current day
        const currentDay = currentDate.getDate(); // Get the day of the current date
        const countToday = dataCallouts.filter(
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
        dataCallouts.forEach((item) => {
          if (item.callout.exposed_to_smoke) {
            exposedMinutes =
              exposedMinutes + item.callout.exposed_to_smoke_time;
            countExposed++;
          }
        });

        // Sort the data based on the 'date_start' field from the related 'callout' table
        const sortedData = dataCallouts.sort((a: any, b: any) => {
          const dateA: any = new Date(a.callout?.date_start || "");
          const dateB: any = new Date(b.callout?.date_start || "");
          return dateB - dateA;
        });

        returnData = {
          callouts: sortedData,
          countAllTime: sortedData.length,
          countThisMonth: countThisMonth,
          countThisYear: countThisYear,
          countToday: countToday,
          exposedToSmokeTime: exposedMinutes,
          exposedToSmokeCount: countExposed,
        };

        setProfileCallouts(returnData);
      }
    }
  }

  // Functions
  // Check access rights to see if the user have access to view this profile
  async function checkAccess() {
    if (session && activeProfile) {
      // All users can view their own profile
      if (session?.user.id === activeProfile?.user) {
        setHaveAccess(true);
      }

      //If the current user id is in the list of followers for the profile it wants to see
      if (
        activeProfile?.followers?.some(
          (follower: any) => follower.id === session?.user?.id
        )
      ) {
        setHaveAccess(true);
      }
    } else {
      // If the user is trying to see their own profile, but it does not exist we will create it for them
      if (session?.user.id === params.id) {
        // First double check if there is a profile connected this user
        const { data, error } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user", params.id);

        if (data?.length === 0) {
          const { data: dataCreate, error: errorCreate } = await supabase
            .from("user_profiles")
            .insert({
              name: session?.user?.user_metadata?.name,
              user: session?.user?.id,
            });

          if (!errorCreate) {
            window.location.reload();
          }
        }
      }
    }
  }

  // Create a follow request
  async function createFollowRequest() {
    // Get the current list of all pending follow request from the userProfile
    var current: any = [];

    if (activeProfile?.followers_pending?.length > 0) {
      current = [...activeProfile?.followers_pending];
    }

    const newData = {
      email: session?.user?.email,
      id: session?.user?.id,
    };

    current.push(newData);

    const { data, error } = await supabase
      .from("user_profiles")
      .update({
        followers_pending: current,
      })
      .eq("user", activeProfile?.user);

    if (error) {
      alert(
        "Something went wrong while creating a follow request: " + error.message
      );
    } else {
      window.location.reload();
    }
  }

  // Cancel follow request
  async function cancelFollowRequest() {
    // Check if there are any pending follow requests
    if (!activeProfile?.followers_pending?.length) {
      return; // No pending requests to cancel
    }

    // Filter out the user's data from the followers_pending array
    const updatedFollowersPending = activeProfile.followers_pending.filter(
      (follower: any) => follower.id !== session?.user?.id
    );

    // Update the user_profiles table with the modified array
    const { error } = await supabase
      .from("user_profiles")
      .update({
        followers_pending: updatedFollowersPending,
      })
      .eq("user", activeProfile?.user);

    if (error) {
      alert(
        "Something went wrong while canceling the follow request: " +
          error.message
      );
    } else {
      window.location.reload();
    }
  }

  // Accept follow request
  async function acceptFollowRequest(follower: any) {
    // Check if there are any pending follow requests
    if (!activeProfile?.followers_pending?.length) {
      return; // No pending requests to accept
    }

    // Filter out the user's data from the followers_pending array
    const updatedFollowersPending = activeProfile.followers_pending.filter(
      (followers: any) => followers.id !== follower.id
    );

    // Update the user_profiles table with the modified array
    const { error } = await supabase
      .from("user_profiles")
      .update({
        followers_pending: updatedFollowersPending,
      })
      .eq("user", activeProfile?.user);

    if (error) {
      alert(
        "Something went wrong while canceling the follow request: " +
          error.message
      );
    } else {
      // Get the current list of all pending follow request from the userProfile
      var current: any = [];

      if (activeProfile?.followers?.length > 0) {
        current = [...activeProfile?.followers];
      }

      const newData = {
        id: follower.id,
      };

      current.push(newData);

      const { data, error } = await supabase
        .from("user_profiles")
        .update({
          followers: current,
        })
        .eq("user", activeProfile?.user);

      if (error) {
        alert(
          "Something went wrong while creating a follow request: " +
            error.message
        );
      } else {
        window.location.reload();
      }
    }
  }

  // Refuse follow request
  async function refuseFollowRequest(follower: any) {
    // Check if there are any pending follow requests
    if (!activeProfile?.followers_pending?.length) {
      return; // No pending requests to refuse
    }

    // Filter out the user's data from the followers_pending array
    const updatedFollowersPending = activeProfile.followers_pending.filter(
      (followers: any) => followers.id !== follower.id
    );

    // Update the user_profiles table with the modified array
    const { error } = await supabase
      .from("user_profiles")
      .update({
        followers_pending: updatedFollowersPending,
      })
      .eq("user", activeProfile?.user);

    if (error) {
      alert(
        "Something went wrong while canceling the follow request: " +
          error.message
      );
    } else {
      window.location.reload();
    }
  }

  // Un-Follow
  async function unFollow() {
    // Check if there are any pending follow requests
    if (!activeProfile?.followers?.length) {
      return; // No followers
    }

    // Filter out the user's data from the followers_pending array
    const updatedFollowers = activeProfile.followers.filter(
      (follower: any) => follower.id !== session?.user?.id
    );

    // Update the user_profiles table with the modified array
    const { error } = await supabase
      .from("user_profiles")
      .update({
        followers: updatedFollowers,
      })
      .eq("user", activeProfile?.user);

    if (error) {
      alert(
        "Something went wrong while canceling the follow request: " +
          error.message
      );
    } else {
      window.location.reload();
    }
  }

  // Function that handles the game_time and game_levels
  async function calculationGame() {
    if (activeProfile) {
      // Get the callouts
      const { data, error: errorCallouts } = await supabase
        .from("user_connection_callout")
        .select(`*, callout(*)`)
        .eq("user", activeProfile?.user);

      if (!errorCallouts) {
        // Initialize the variable outside the loop
        let timeDifferenceMinutes = 0;

        // For each callout
        data?.forEach((data: any) => {
          const timeStartMillis = new Date(
            data.callout.date_start + " " + data.callout.time_start
          ).getTime();
          const timeEndMillis = new Date(
            data.callout.date_end + " " + data.callout.time_end
          ).getTime();

          // Calculate the time difference in milliseconds
          const timeDifferenceMillis = timeEndMillis - timeStartMillis;

          // Convert milliseconds to minutes and accumulate
          timeDifferenceMinutes += timeDifferenceMillis / (1000 * 60);
        });

        // Define level-up time threshold (30 hours = 1800 minutes)
        const levelUpThresholdMinutes = 1800;

        // Calculate game_level
        const game_level = Math.floor(
          timeDifferenceMinutes / levelUpThresholdMinutes
        );

        // Calculate remaining time until next level in minutes
        const remainingTimeUntilNextLevel =
          levelUpThresholdMinutes -
          (timeDifferenceMinutes % levelUpThresholdMinutes);

        // Calculate game_time_next_level
        const game_time_next_level =
          timeDifferenceMinutes + remainingTimeUntilNextLevel;

        // Calculate the threshold of the previous level
        const game_time_prev_level =
          game_time_next_level - levelUpThresholdMinutes;

        const progressPercentage =
          ((timeDifferenceMinutes - game_time_prev_level) /
            (game_time_next_level - game_time_prev_level)) *
          100;

        // Update the user_profiles table with the modified array
        const { error } = await supabase
          .from("user_profiles")
          .update({
            game_time: timeDifferenceMinutes,
            game_level: game_level,
            game_time_next_level: game_time_next_level,
            game_time_prev_level: game_time_prev_level,
            game_time_progress_percentage: progressPercentage,
          })
          .eq("user", activeProfile?.user);
      }
    }
  }

  // useEffects
  useEffect(() => {
    const fetchUserProfileData = async () => {
      await fetchUserProfile(); // Wait for fetchUserProfile to complete
      checkAccess();
    };

    fetchUserProfileData();
  }, [session]);

  useEffect(() => {
    const checkUserProfileAccess = async () => {
      checkAccess();
    };

    calculationGame();
    checkUserProfileAccess();
  }, [activeProfile]);

  // Return
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="text-primary text-4xl hidden lg:block">
        {haveAccess
          ? activeProfile?.name
            ? activeProfile?.name
            : "No username added"
          : "You do not have access to this user profile"}
      </div>
      <div className="lg:flex lg:justify-end lg:grow lg:gap-2">
        <div className="md:hidden">
          <Select onValueChange={(e) => window.location.assign(e)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Menu" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Pages</SelectLabel>
                <SelectItem value="/">Home</SelectItem>
                <SelectItem value="/callouts">Callouts</SelectItem>
                <SelectItem value="/department">Department</SelectItem>
                <SelectItem value="/station">Station</SelectItem>
                <SelectItem value="profile" disabled>
                  Profile
                </SelectItem>
                <SelectItem value="/settings">Settings</SelectItem>
                <SelectItem value="/authentication/logout">Sign out</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-row gap-2 mt-5 text-xs">
        {session?.user?.id === activeProfile?.user ? (
          <BasicButton
            disabled
            state="default"
            className="bg-primary"
            onClick={() => setActive("Create")}
          >
            <div className="">
              <div className="flex flex-row gap-2">
                <div className="block">Your profile</div>
              </div>
            </div>
          </BasicButton>
        ) : activeProfile?.followers?.some(
            (follower: any) => follower.id === session?.user?.id
          ) ? (
          <BasicButton
            state="default"
            className="bg-primary"
            onClick={() => unFollow()}
          >
            <div className="">
              <div className="flex flex-row gap-2">
                <div className="hidden md:block">Un-Follow</div>
              </div>
            </div>
          </BasicButton>
        ) : activeProfile?.followers_pending?.some(
            (follower: any) => follower.id === session?.user?.id
          ) ? (
          <BasicButton
            state="default"
            className="bg-danger"
            onClick={() => cancelFollowRequest()}
          >
            <div className="">
              <div className="flex flex-row gap-2">
                <div className="hidden md:block">
                  Cancel pending follow request
                </div>
              </div>
            </div>
          </BasicButton>
        ) : (
          <BasicButton
            state="default"
            className="bg-primary"
            onClick={() => createFollowRequest()}
          >
            <div className="">
              <div className="flex flex-row gap-2">
                <div className="hidden md:block">
                  {activeProfile?.name
                    ? "Follow " + activeProfile?.name
                    : "Follow unknown user"}
                </div>
              </div>
            </div>
          </BasicButton>
        )}
        <div className="flex flex-col">
          {session?.user?.id === activeProfile?.user &&
          activeProfile?.followers_pending?.length > 0 ? (
            <BasicButton
              state="default"
              className="bg-primary"
              onClick={() => setShowPendingRequests(!showPendingRequests)}
            >
              <div className="">
                <div className="flex flex-row gap-2">
                  <Info size={14} />
                  <div className="hidden md:block">Pending follow request</div>
                </div>
              </div>
            </BasicButton>
          ) : null}
          {showPendingRequests &&
            activeProfile?.followers_pending?.length > 0 && (
              <div className="absolute mt-10 z-10 flex flex-col gap-2 items-center justify-between bg-white rounded-[20px] px-4 py-4">
                {activeProfile.followers_pending.map((follower: any) => (
                  <div key={follower.id} className="flex flex-row gap-2">
                    <div className="pt-1">{follower.email}</div>
                    <button
                      onClick={() => acceptFollowRequest(follower)}
                      className="bg-success text-white px-2 py-1 rounded-md "
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => refuseFollowRequest(follower)}
                      className="bg-danger text-white px-2 py-1 rounded-md"
                    >
                      Refuse
                    </button>
                  </div>
                ))}
              </div>
            )}
        </div>
        {haveAccess && (
          <BasicButton
            state="default"
            className={
              active === "Dashboard" ? "bg-dark brightness-150" : "bg-dark"
            }
            onClick={() => setActive("Dashboard")}
          >
            <div className="">
              <div className="flex flex-row gap-2">
                <Home size={14} />
                <div className="hidden md:block">Dashboard</div>
              </div>
            </div>
          </BasicButton>
        )}
        {session?.user?.id === activeProfile?.user && (
          <BasicButton
            state="default"
            className={
              active === "Settings" ? "bg-dark brightness-150" : "bg-dark"
            }
            onClick={() => setActive("Settings")}
          >
            <div className="">
              <div className="flex flex-row gap-2">
                <SettingsIcon size={14} />
                <div className="hidden md:block">Settings</div>
              </div>
            </div>
          </BasicButton>
        )}
      </div>
      {haveAccess && activeProfile && (
        <UserProfile
          currentUser={session?.user}
          haveAccess={haveAccess}
          activeProfile={activeProfile}
          callouts={profileCallouts}
        />
      )}
    </div>
  );
}

function UserProfile(data: any) {
  // States
  console.log(data);

  // Functions
  const formatDateAndTime = (dateTimeString: any) => {
    const dateTime = new Date(dateTimeString);
    const day = String(dateTime.getMonth() + 1).padStart(2, "0");
    const month = String(dateTime.getDate()).padStart(2, "0");
    const year = String(dateTime.getFullYear()).slice(2);
    const hours = String(dateTime.getHours()).padStart(2, "0");
    const minutes = String(dateTime.getMinutes()).padStart(2, "0");

    return `${month}.${day}.${year} - ${hours}:${minutes}`;
  };

  return (
    <div className="w-full mt-4">
      <div className="flex items-center flex-row gap-2 w-full">
        <div className=" w-20 h-20 rounded-full bg-success text-white flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="text-xs">level</div>
            <div className="text-2xl">{data.activeProfile?.game_level}</div>
          </div>
        </div>
        <div className="flex flex-col gap-0 w-full">
          <Progress
            value={parseFloat(
              data.activeProfile?.game_time_progress_percentage
            )}
            className="mt-0 lg:mt-5"
          />
          <div className="flex flex-row w-full pl-5 pr-5 text-xs hidden lg:block">
            {/* Statistics */}
            <div className="flex gap-2 justify-between mt-1">
              <div className="">
                Callouts all time: {data?.callouts?.countAllTime}
              </div>
              <div className="">
                Callouts today: {data?.callouts?.countToday}
              </div>
              <div className="">
                Callouts this month: {data?.callouts?.countThisMonth}
              </div>
              <div className="">
                Callouts this year: {data?.callouts?.countThisYear}
              </div>
              <div className="">
                Smoke dives: {data?.callouts?.exposedToSmokeCount}
              </div>
              <div className="">
                Time in smoke: {data?.callouts?.exposedToSmokeTime} minutes
              </div>
            </div>
          </div>
        </div>
        <div className="text-xs">
          {parseInt(data.activeProfile?.game_time_progress_percentage) + "%"}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className=" col-span-1 lg:col-span-2">
          <div className="h-[300px] md:h-[600px] xl:h-[600px] mt-4">
            <MapCallouts
              center={
                data.callouts?.callouts[0]
                  ? data.callouts?.callouts[0].callout
                  : null
              }
              heatmap={true}
              heatmapLocations={data?.callouts?.callouts}
            />
          </div>
        </div>
        <div className="bg-white rounded-[20px] mt-4 mb-9 py-2 px-2">
          <div className="flex flex-col gap-2">
            <div className="font-semibold">Latest activity</div>
            {data.callouts?.callouts
              .slice(0, 22) // Limit the array to the first 22 items
              .map((callout: any) => {
                console.log(callout);
                return (
                  <div className="text-xs flex flex-row gap-1">
                    {
                      formatDateAndTime(
                        callout.callout.date_start +
                          " " +
                          callout.callout.time_start
                      ).split("-")[0]
                    }
                    {" - "}
                    {callout.callout.type}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
