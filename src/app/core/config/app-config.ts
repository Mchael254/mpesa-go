export interface AppConfig {
  contextPath: ContextPath;
  organization: Organization;
  dmsDefaultUrl?: string;
  cubejsDefaultUrl?: string;
}
export interface ContextPath {
  accounts_services: string;
  users_services: string;
  auth_services: string;
  setup_services: string;
  chart_services: string;
  gis_services: string;
  ticket_services: string;
  api: string;
  lms: string;

}

export interface Organization {
  passport_regex: string;
  pin_regex: string;
  birth_cert_regex: string;
  national_ID_regex: string;
  alien_number_regex: string;
  huduma_number_regex: string;
  registration_number_regex: string;
  drivers_license_number_regex: string;
  cert_of_incorporation_number_regex: string;
}
