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

// Types

export default function Profile({ params }: { params: { id: string } }) {
  // States
  const [active, setActive] = useState<string>("Dashboard");
  const [haveAccess, setHaveAccess] = useState<boolean>(false);
  const [activeProfile, setActiveProfile] = useState<any>(null);
  const [showPendingRequests, setShowPendingRequests] = useState(false);

  // Auth
  const { session } = useSession();

  // Fetching
  // All callouts
  const { data: dataCallouts, error: errorCallouts } = useFetchUserCallouts();
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

        // Define level-up time threshold (15 hours = 900 minutes)
        const levelUpThresholdMinutes = 900;

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
                <SelectItem value="home">Home</SelectItem>
                <SelectItem value="callouts" disabled>
                  Callouts
                </SelectItem>
                <SelectItem value="department">Department</SelectItem>
                <SelectItem value="station">Station</SelectItem>
                <SelectItem value="settings">Settings</SelectItem>
                <SelectItem value="authentication/logout">Sign out</SelectItem>
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
        />
      )}
    </div>
  );
}

function UserProfile(data: any) {
  // States

  return (
    <div className="w-full mt-4">
      <div className="flex items-center flex-row gap-2 w-full">
        <div className=" w-20 h-20 rounded-full bg-success text-white flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="text-xs">level</div>
            <div className="text-2xl">{data.activeProfile?.game_level}</div>
          </div>
        </div>
        <Progress
          value={parseFloat(data.activeProfile?.game_time_progress_percentage)}
        />
        <div className="text-xs">
          {parseInt(data.activeProfile?.game_time_progress_percentage) + "%"}
        </div>
      </div>
    </div>
  );
}
