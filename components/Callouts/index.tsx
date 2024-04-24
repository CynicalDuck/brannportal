import React, { useState } from "react";

// Import components
import TableCallout from "../Tables/TableCallout";
import NavHamburger from "../Nav/NavHamburger";
import { Separator } from "../ui/separator";
import CalloutCreateNew from "./CalloutCreateNew";
import BasicButton from "../Buttons/BasicButton";

export default function CalloutsIndex(appData: any) {
  const [createNew, setCreateNew] = useState(false);

  if (createNew) {
    return <CalloutCreateNew setCreateNew={setCreateNew} />;
  }

  return (
    <div className="flex flex-col gap-2 h-screen md:h-full lg:h-full w-full">
      <div className="flex flex-col lg:flex-row lg:gap-10 gap-2">
        <div className="text-primary text-4xl hidden md:block">Dashboard</div>
        <NavHamburger appData={appData} />
      </div>
      <Separator className="my-4" />
      <BasicButton onClick={() => setCreateNew(true)} state="default">
        Create new
      </BasicButton>
      <div className="flex-grow w-full">
        <TableCallout
          data={appData.callouts?.data ? appData.callouts?.data : null}
          address
        />
      </div>
    </div>
  );
}
