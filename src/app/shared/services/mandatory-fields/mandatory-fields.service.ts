import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MandatoryFieldsDTO } from "../../data/common/mandatory-fields-dto";
import { ApiService } from "../api/api.service";
import { API_CONFIG } from "../../../../environments/api_service_config";
import { FormConfig } from '../../../features/entities/data/form-config';

/**
 * Service class to get form configurations and fields
 */
@Injectable({
  providedIn: 'root'
})
export class MandatoryFieldsService {
  constructor(private api: ApiService) {}

  /**
   * Get list of mandatory fields by group id
   * @param groupId Group id
   * @returns List of mandatory fields
   */
  getMandatoryFieldsByGroupId(groupId: string): Observable<MandatoryFieldsDTO[]> {
    return this.api.GET<MandatoryFieldsDTO[]>(
      `form-fields/group/${groupId}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  getMockFormFields(): Observable<any> {
    return this.api.GET<any>(
      'data/fields.json',
      API_CONFIG.NONE_BASE_URL);
  }
  /**
   * Get form configuration with fields and groups
   * @returns Observable with form configuration
   */
  /*getFormConfig(): Observable<FormConfig> {
    return this.api.GET<FormConfig>(
      'data/formFields.json',
      API_CONFIG.NONE_BASE_URL
    );
  }*/

  getFormConfig(): Observable<FormConfig> {
    return this.api.GET<FormConfig>(
      'data/client-registration.json',
      API_CONFIG.NONE_BASE_URL
    );
  }

  /*getFormConfig(): Observable<FormConfig> {
    return this.api.GET<FormConfig>(
      'assets/data/formFields.json',
      API_CONFIG.NONE_BASE_URL
    ).pipe(
      map(config => this.processFormConfig(config))
    );
  }*/

  /**
   * Process form configuration after loading
   */
  private processFormConfig(config: any): FormConfig {
    // Ensure all fields have default values
    const processedFields = (config.fields || []).map(field => ({
      ...field,
      visible: field.visible !== false, // Default to true if not specified
      disabled: !!field.disabled,
      validations: field.validations || [],
      conditions: field.conditions || []
    }));

    // Process form groups
    const processedGroups = (config.formGroups || []).map(group => ({
      ...group,
      collapsible: group.collapsible || false,
      collapsed: group.collapsed || false
    }));

    return {
      ...config,
      fields: processedFields,
      formGroups: processedGroups
    };
  }

  // Kept for backward compatibility
  getFormFields(): Observable<FormConfig> {
    return this.getFormConfig();
  }
}
