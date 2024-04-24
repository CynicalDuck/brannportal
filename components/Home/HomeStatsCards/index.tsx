import { BarChart, Users, Navigation } from "lucide-react";
import React from "react";
import useFormatTime from "../../../hooks/helpers/useFormatTime";
import FeaturedCard from "../../Cards/FeaturedCard";

export default function HomeStatsCards({ appData }: any) {
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 xl:grid-rows-1 xl:gap-5 gap-2 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 mt-2 xl:mt-5">
        <FeaturedCard
          title="Callouts"
          icon={<BarChart />}
          className={"rounded-[20px] bg-primary w-full"}
        >
          <div className="flex flex-col px-6">
            <div className="flex flex-row">
              <div className="text-5xl">
                {appData.callouts ? appData.callouts.data.length : 0}
              </div>
              <div className="ml-5">All time</div>
            </div>
            <div className="flex justify-evenly py-4">
              <div className="text-center mx-4">
                <div className="text-xl font-bold">
                  {appData.callouts ? appData.callouts.countToday : 0}
                </div>
                <div className="text-sm">Today</div>
              </div>
              <div className="border-r border-dotted" />
              <div className="text-center mx-4">
                <div className="text-xl font-bold">
                  {appData.callouts ? appData.callouts.countThisMonth : 0}
                </div>
                <div className="text-sm">This month</div>
              </div>
              <div className="border-r border-dotted" />
              <div className="text-center mx-4">
                <div className="text-xl font-bold">
                  {appData.callouts ? appData.callouts.countThisYear : 0}
                </div>
                <div className="text-sm">This year</div>
              </div>
            </div>
          </div>
        </FeaturedCard>
        <FeaturedCard
          title="Smoke exposure"
          icon={<Users />}
          className={"rounded-[20px] bg-primary w-full"}
        >
          <div className="flex flex-col px-6">
            <div className="flex flex-row">
              <div className="text-4xl">
                {useFormatTime(appData.callouts?.exposedToSmokeTime)}
              </div>
            </div>
          </div>
        </FeaturedCard>
        <FeaturedCard
          title="Stations"
          icon={<Navigation />}
          className={"rounded-[20px] bg-primary w-full"}
        >
          <div className="flex flex-col px-6">
            <div className="flex flex-row">
              <div className="text-5xl">{appData.stations?.length}</div>
            </div>
          </div>
        </FeaturedCard>
      </div>
    </div>
  );
}
