import { HttpClient } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { AppConfig } from "./app-config";

@Injectable(
  {providedIn: 'root'}
)
export class ConfigurationLoader {
  constructor(private injector: Injector) {}

  fetchConfiguration(): Promise<AppConfig> | Observable<AppConfig> {
    const http = this.injector.get(HttpClient);

    if (environment.production) {
      return http.get<AppConfig>('./assets/config/config.prod.json');
    } else {
      return http.get<AppConfig>('./assets/config/config.dev.json');
    }
  }
}
