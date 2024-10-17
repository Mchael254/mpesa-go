export interface GroupQuotationsListDTO {
    quotation_number: string;
    quotation_status: string;
    sum_assured: number | null;
    total_premium: number | null;
    cover_from_date: string;
    cover_to_date: string;
    product: string;
    quotation_date: string;
    client_name: string;
    branch_name: string;
    agency_name: string;
}