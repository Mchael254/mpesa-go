export class CausationTypesDTO {
    cause_code: number;
    cause_short_desc: string;
    cause_desc: string;
    cause_type: string;
    main_cover?: string;
}

export class ActualCauseDTO {
    causation_cause_code: number;
    death_disability_cause_code: number;
    death_disability_short_desc: string;
    death_disability_description: string;
    gender?: string;
    min_claimable_prd?: string;
}
