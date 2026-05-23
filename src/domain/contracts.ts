import type { ProfessionalProfile } from "./models";

export interface ProfileDataSource {
  getProfessionalProfile(): ProfessionalProfile;
}
