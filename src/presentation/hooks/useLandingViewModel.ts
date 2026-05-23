import { useMemo } from "react";

import { LandingPageBuilder } from "../../application/LandingPageBuilder";
import { StaticProfileDataSource } from "../../infrastructure/StaticProfileDataSource";
import type { LandingViewModel } from "../types";

export function useLandingViewModel(): LandingViewModel {
  return useMemo(() => {
    const dataSource = new StaticProfileDataSource();
    const builder = new LandingPageBuilder(dataSource);
    return builder.build();
  }, []);
}
