export interface DepartmentDto {
    id: number,
    departmentName: string,
    shortDescription: string,
    effectiveFromDate: Date,
    effectiveToDate: Date,
    organizationId: number
}