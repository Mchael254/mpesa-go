<!-- SECTION DETAILS CARD -->
<div class="card mb-3">
    <div class="card-body">
        <div>
            <div class="row">
                <div class="col-4 section-title">
                    <strong> {{ "gis.quotation.section_details" | translate }}</strong>
                </div>
                <div class="col-8 d-flex justify-content-end">
                    <div class="row">
                        <!-- <div class="col-4" *ngIf="isSectionDetailsOpen">
            <button id="openModalButtonAdd"  data-bs-toggle="modal"
                data-bs-target="#addSection">Add section</button>
             <button type="button" id="icon" class="btn btn-primary" data-bs-toggle="modal"
                data-bs-target="#addSection" title="Edit">
                <i class="fa-solid fa-plus"></i>
            </button> -->
                        <!-- </div>  -->
                        <!-- <div class="col-3" *ngIf="isSectionDetailsOpen">
  <button type="button" id="icon" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editSection" title="Edit">
    <i class="fa-solid fa-pencil"></i>
  </button>
</div> -->
                        <!-- <div class="col-4" *ngIf="isSectionDetailsOpen">
            <button type="button" id="icon" class="btn btn-primary" data-bs-toggle="modal"
                data-bs-target="#deleteSection" title="Delete">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        </div> -->
                        <div class="col-4">
                            <button type="button" id="icon" class="btn btn-primary"
                                data-bs-toggle="collapse" data-bs-target="#sectionDetails"
                                aria-expanded="false" [attr.aria-expanded]="isSectionDetailsOpen"
                                (click)="toggleSectionDetails()">
                                <i class="fa-solid" [ngClass]="
    isSectionDetailsOpen ? 'fa-chevron-up' : 'fa-chevron-down'
  "></i>
                            </button>
                        </div>
                    </div>
                </div>
                <!-- ADD SECTION BUTTON ROW -->
                <div class="row mt-3" *ngIf="isSectionDetailsOpen">
                    <div class="col-12 d-flex justify-content-end">
                        <button id="openModalButtonAdd" class="btn btn-primary btn-sm"
                            data-bs-toggle="modal" data-bs-target="#addSection">
                            Add Section
                        </button>

                        <i class="pi border border-black p-1 rounded-1 text-black" [ngClass]="{
'pi-caret-up': showSections,
'pi-caret-down': !showSections
}" style="
font-size: 15px;
cursor: pointer;
margin-left: 8px;
padding: 4px 6px;
" (click)="toggleSections()"></i>
                    </div>
                </div>
            </div>
        </div>
        <div [@slideInOut]="isSectionDetailsOpen ? 'open' : 'closed'" class="mt-2">
            <!-- Add Risk Section Modal -->

            <div class="modal fade" id="addSection" tabindex="-1" role="dialog"
                aria-labelledby="addSectionLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" style="min-width: 708px"
                    role="document">
                    <div class="modal-content" id="addSectionModal">
                        <div class="modal-body">
                            <h5 class="modal-title mt-2" id="editOtherDetailsLabel">
                                Add risk section
                                <button type="button" class="btn-close red-close float-end"
                                    data-bs-dismiss="modal" aria-label="Close"></button>
                            </h5>

                            <!-- <div class="search-container mb-3">
  <span class="search-icon"><i class="fa fa-search"></i></span>
  <input type="text" placeholder="Search" id="search-input-Rsection" [(ngModel)]="searchText" />
</div> -->
                            <!-- <div class="scrollable-list">
  <div *ngFor="let section of sectionPremium">
    <div class="form-check" *ngIf="matchesSearch(section.sectionShortDescription)">
      <input class="form-check-input" type="checkbox" [id]="'checkbox-' + section.code"
        (change)="onCheckboxChange(section)" />
      <label class="form-check-label" [for]="'checkbox-' + section.code">
        {{ section.sectionShortDescription }}
      </label>
    </div>
  </div>
</div> -->
                            <!-- <input pInputText type="text" (input)="sectionTable.filterGlobal($event.target.value, 'contains')" placeholder="Search..." #sectionTable> -->
                            <!-- <input class="form-control-sm mb-2" id="search-input-Rsection" pInputText type="text"
                (input)="applyGlobalFilter($event)" placeholder="Search..."> -->

                            <p-table #sectionTable [value]="sectionPremiums" id="clientTable"
                                dataKey="code" [tableStyle]="{
  'max-width': '50rem',
  'border-spacing': '10 10px'
}" [(selection)]="selectedSections" [resizableColumns]="true" responsiveLayout="scroll"
                                class="ui-datatable" [autoLayout]="true" [paginator]="true" [rows]="2"
                                [rowsPerPageOptions]="[2, 4, 6]" [scrollable]="true"
                                scrollDirection="horizontal" [showCurrentPageReport]="true"
                                currentPageReportTemplate="{first} - {last} of {totalRecords}"
                                [globalFilterFields]="[
  'benefit',
  'freeLimit',
  'limitAmount',
  'rate'
]">
                                <ng-template pTemplate="header">
                                    <tr>
                                        <th style="width: 2%">
                                            <input type="checkbox" [(ngModel)]="selectAll"
                                                (change)="toggleSelectAll($event)" />
                                        </th>

                                        <th class="equal-width" pSortableColumn="benefit">
                                            {{ "gis.quotation.benefit" | translate
                                            }}<p-sortIcon field="benefit" />
                                        </th>
                                        <th class="equal-width" pSortableColumn="free_limit">
                                            {{ "gis.quotation.free_limit" | translate
                                            }}<p-sortIcon field="free_limit" />
                                        </th>
                                        <th class="equal-width" pSortableColumn="limit of amount">
                                            {{ "gis.quotation.limit_amount" | translate
                                            }}<p-sortIcon field="limit of amount" />
                                        </th>
                                        <th class="equal-width" pSortableColumn="rate">
                                            {{ "gis.quotation.rate" | translate }}
                                            <p-sortIcon field="rate" />
                                        </th>
                                    </tr>
                                    <tr>
                                        <td colspan="5" style="padding-left: 50px">
                                            <input #globalFilterInput
                                                class="form-control form-control-sm my-2"
                                                id="search-input-Rsection" pInputText type="text"
                                                (input)="
          sectionTable.filterGlobal(
            globalFilterInput.value,
            'contains'
          )
        " placeholder="" style="
          width: 100px;
          margin-top: 6px;
          margin-bottom: 6px;
        " />
                                        </td>
                                    </tr>
                                </ng-template>
                                <ng-template pTemplate="emptymessage">
                                    <tr>
                                        <td colspan="5" class="text-center text-muted py-3">
                                            No sections found matching your search.
                                        </td>
                                    </tr>
                                </ng-template>

                                <ng-template pTemplate="body" let-section let-editing="editing"
                                    let-i="rowIndex">
                                    <tr style="height: 40px; padding: 10px; margin-bottom: 10px">
                                        <td>
                                            <input type="checkbox"
                                                id="check_section_{{ section.sectionCode }}"
                                                [(ngModel)]="section.isChecked" />
                                        </td>
                                        <td class="equal-width">
                                            {{ section.benefit | sentenceCase }}
                                        </td>
                                        <td class="equal-width">
                                            {{ section.freeLimit | number }}
                                        </td>
                                        <td class="equal-width" [pEditableColumn]="section.limitAmount"
                                            pEditableColumnField="limitAmount">
                                            <input
                                                class="form-control form-control-sm narrow-input error-border"
                                                id="section_{{ section.sectionCode }}"
                                                [(ngModel)]="section.limitAmount"
                                                [options]="currencyObj" currencyMask type="text"
                                                (keydown)="onKeyUp($event, section)" [ngClass]="{
          'error-border':
            section.isChecked && !section.limitAmount
        }" />
                                        </td>
                                        <td class="equal-width" [pEditableColumn]="section.rate"
                                            pEditableColumnField="rate">
                                            <input
                                                class="form-control form-control-sm narrow-input error-border"
                                                id="section_{{ section.sectionCode }}"
                                                [(ngModel)]="section.rate" type="number"
                                                (keydown)="onKeyUp($event, section)" [ngClass]="{
          'error-border': section.isChecked && !section.rate
        }" />
                                        </td>
                                    </tr>
                                </ng-template>
                            </p-table>
                            <div class="mt-4 d-flex justify-content-end">
                                <button type="button" class="btn btn-outline-primary me-2"
                                    data-bs-dismiss="modal">
                                    Cancel
                                </button>
                                <button type="button" class="btn btn-primary" id="saveDetails"
                                    data-bs-dismiss="modal" (click)="createRiskSection()">
                                    {{ "gis.quotation.save_details" | translate }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Edit Risk Section Modal -->
            <div class="modal fade" id="editSection" #editSectionModal tabindex="-1" role="dialog"
                aria-labelledby="editSectionLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-body">
                            <h5 class="modal-title mt-2" id="editScheduleLabel">Edit</h5>
                            <form [formGroup]="sectionDetailsForm">
                                <!-- **ROW 1** -->
                                <div class="row" id="scheduleRows">
                                    <div class="col-xl-6">
                                        <div class="mb-3 row">
                                            <label for="minmax-buttons" class="col-5 col-form-label"
                                                id="scheduleLabel">{{ "gis.quotation.id" | translate }}
                                                :</label>
                                            <div class="col-7">
                                                <input type="text" id="scheduleInput"
                                                    class="form-control form-control-sm mb-1"
                                                    formControlName="code" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6">
                                        <div class="mb-3 row">
                                            <label for="minmax-buttons" class="col-5 col-form-label"
                                                id="scheduleLabel">{{ "gis.quotation.description" |
                                                translate }}:</label>
                                            <div class="col-7">
                                                <input type="number" id="scheduleInput"
                                                    class="form-control form-control-sm mb-1"
                                                    formControlName="sectionShortDescription" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- **ROW 2** -->
                                <div class="row" id="scheduleRows">
                                    <div class="col-xl-6">
                                        <div class="mb-3 row">
                                            <label for="minmax-buttons" class="col-5 col-form-label"
                                                id="scheduleLabel">
                                                {{ "gis.quotation.rate_type" | translate }} :</label>
                                            <div class="col-7">
                                                <select class="form-select form-control-sm mb-1"
                                                    id="scheduleInput" formControlName="rateType">
                                                    <option value="FXD">
                                                        {{ "gis.quotation.fixed" | translate }}
                                                    </option>
                                                    <option value="RCU">
                                                        {{ "gis.quotation.recursive" | translate }}
                                                    </option>
                                                    <option value="RT">
                                                        {{ "gis.quotation.rate_table" | translate }}
                                                    </option>
                                                    <option value="ARG">
                                                        {{ "gis.quotation.absolute_range" | translate }}
                                                    </option>
                                                    <option value="SRG">
                                                        {{ "gis.quotation.step_ranges" | translate }}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6">
                                        <div class="mb-3 row">
                                            <label for="minmax-buttons" class="col-5 col-form-label"
                                                id="scheduleLabel">{{ "gis.quotation.premium_type" |
                                                translate }}:</label>
                                            <div class="col-7">
                                                <select class="form-select form-control-sm mb-1"
                                                    id="scheduleInput"
                                                    formControlName="description"></select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- **ROW 3** -->
                                <div class="row" id="scheduleRows">
                                    <div class="col-xl-6">
                                        <div class="mb-3 row">
                                            <label for="minmax-buttons" class="col-5 col-form-label"
                                                id="scheduleLabel">{{ "gis.quotation.free_limit" |
                                                translate }} :</label>
                                            <div class="col-7">
                                                <input type="number" id="scheduleInput"
                                                    class="form-control form-control-sm mb-1"
                                                    formControlName="freeLimit" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6">
                                        <div class="mb-3 row">
                                            <label for="minmax-buttons" class="col-5 col-form-label"
                                                id="scheduleLabel">{{ "gis.quotation.limit_amount" |
                                                translate }}:</label>
                                            <div class="col-7">
                                                <input type="number" id="scheduleInput"
                                                    class="form-control form-control-sm mb-1"
                                                    formControlName="limitAmount" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- **ROW 4** -->
                                <div class="row" id="scheduleRows">
                                    <div class="col-xl-6">
                                        <div class="mb-3 row">
                                            <label for="minmax-buttons" class="col-5 col-form-label"
                                                id="scheduleLabel">{{ "gis.quotation.group" | translate
                                                }}:</label>
                                            <div class="col-7">
                                                <input type="number" id="scheduleInput"
                                                    class="form-control form-control-sm mb-1"
                                                    formControlName="calcGroup" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6">
                                        <div class="mb-3 row">
                                            <label for="minmax-buttons" class="col-5 col-form-label"
                                                id="scheduleLabel">{{ "gis.quotation.premium_rate" |
                                                translate }}:</label>
                                            <div class="col-7">
                                                <input type="number" id="scheduleInput"
                                                    class="form-control form-control-sm mb-1"
                                                    formControlName="premiumRate" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- **ROW 5** -->
                                <div class="row" id="scheduleRows">
                                    <div class="col-xl-6">
                                        <div class="mb-3 row">
                                            <label for="minmax-buttons" class="col-5 col-form-label"
                                                id="scheduleLabel">{{ "gis.quotation.div_by" | translate
                                                }}:</label>
                                            <div class="col-7">
                                                <input type="number" id="scheduleInput"
                                                    class="form-control form-control-sm mb-1"
                                                    formControlName="rateDivisionFactor" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6">
                                        <div class="mb-3 row">
                                            <label for="minmax-buttons" class="col-5 col-form-label"
                                                id="scheduleLabel">{{ "gis.quotation.multi_rate" |
                                                translate }} :</label>
                                            <div class="col-7">
                                                <input type="number" id="scheduleInput"
                                                    class="form-control form-control-sm mb-1"
                                                    formControlName="multiplierRate" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- **ROW 6** -->
                                <div class="row" id="scheduleRows">
                                    <div class="col-xl-6">
                                        <div class="mb-3 row">
                                            <label for="minmax-buttons" class="col-5 col-form-label"
                                                id="scheduleLabel">{{ "gis.quotation.div_multi_by" |
                                                translate }}:</label>
                                            <div class="col-7">
                                                <input type="number" id="scheduleInput"
                                                    class="form-control form-control-sm mb-1"
                                                    formControlName="multiplierDivisionFactor" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6">
                                        <div class="mb-3 row">
                                            <label for="minmax-buttons" class="col-5 col-form-label"
                                                id="scheduleLabel">{{ "gis.quotation.premium" |
                                                translate }}:</label>
                                            <div class="col-7">
                                                <input type="number" id="scheduleInput"
                                                    class="form-control form-control-sm mb-1"
                                                    formControlName="premiumAmount" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- **ROW 7** -->
                                <div class="row" id="scheduleRows">
                                    <div class="col-xl-6">
                                        <div class="mb-3 row">
                                            <label for="minmax-buttons" class="col-5 col-form-label"
                                                id="scheduleLabel">{{
                                                "gis.quotation.minimum_premium" | translate
                                                }}:</label>
                                            <div class="col-7">
                                                <input type="number" id="scheduleInput"
                                                    class="form-control form-control-sm mb-1"
                                                    formControlName="description" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6">
                                        <div class="mb-3 row">
                                            <label for="minmax-buttons" class="col-5 col-form-label"
                                                id="scheduleLabel">{{ "gis.quotation.accumulation" |
                                                translate }}:</label>
                                            <div class="col-7">
                                                <input type="number" id="scheduleInput"
                                                    class="form-control form-control-sm mb-1"
                                                    formControlName="description" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- **ROW 8** -->
                                <div class="row" id="scheduleRows">
                                    <div class="col-xl-6">
                                        <div class="mb-3 row">
                                            <label for="minmax-buttons" class="col-5 col-form-label"
                                                id="scheduleLabel">{{ "gis.quotation.remarks" |
                                                translate }}:</label>
                                            <div class="col-7">
                                                <input type="text" id="scheduleInput"
                                                    class="form-control form-control-sm mb-1"
                                                    formControlName="description" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6">
                                        <div class="mb-3 row">
                                            <label for="minmax-buttons" class="col-5 col-form-label"
                                                id="scheduleLabel">{{ "gis.quotation.declaration" |
                                                translate }}:</label>
                                            <div class="col-7">
                                                <select class="form-select form-control-sm mb-1"
                                                    id="scheduleInput" formControlName="description">
                                                    <option></option>
                                                    <option>Yes{{ "gis.policy.yes" | translate }}
                                                    </option>
                                                    <option>No{{ "gis.policy.no" | translate }}</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- **ROW 9** -->
                                <div class="row" id="scheduleRows">
                                    <div class="col-xl-6">
                                        <div class="mb-3 row">
                                            <label for="minmax-buttons" class="col-5 col-form-label"
                                                id="scheduleLabel">{{ "gis.quotation.compute" |
                                                translate }}:</label>
                                            <div class="col-7">
                                                <input class="form-check-input" type="checkbox" value=""
                                                    id="flexCheckDefault" formControlName="compute" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6"></div>
                                </div>
                            </form>
                            <div class="row mt-3 mb-2">
                                <div class="col-6"></div>
                                <div class="col-6 d-flex justify-content-end">
                                    <!-- <button type="button" class="btn btn-primary"  data-bs-dismiss="modal" (click)="updateRiskSection()" >Save Details</button> -->
                                    <button type="button" class="btn btn-primary"
                                        (click)="onSaveDetailsClick()">
                                        {{ "gis.quotation.save_details" | translate }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Delete Section Modal -->
            <div class="modal fade" id="deleteSection" tabindex="-1"
                aria-labelledby="deleteSectionLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <!-- <div class="modal-header">
<h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
</div> -->
                        <div class="modal-body">
                            <p class="d-flex justify-content-center" id="deleteLabel">
                                {{
                                "gis.quotation.are_you_sure_you_want_to_delete_section"
                                | translate
                                }}?
                            </p>
                            <div class="row d-flex justify-content-center">
                                <button type="button" class="btn btn-primary" id="delete"
                                    data-bs-dismiss="modal">
                                    {{ "gis.quotation.yes_delete" | translate }}
                                </button>
                            </div>
                            <br />
                            <div class="row d-flex justify-content-center">
                                <button type="button" class="btn btn-outline-primary" id="delete"
                                    data-bs-dismiss="modal">
                                    {{ "gis.quotation.no_im_not" | translate }}
                                </button>
                            </div>
                            <br />
                        </div>
                    </div>
                </div>
            </div>

            <p-table [value]="sectionDetails" [tableStyle]="{ 'min-width': '300px' }"
                selectionMode="single" [(selection)]="selectedSection" dataKey="code" editMode="row"
                [paginator]="true" [rows]="2" [rowsPerPageOptions]="[2, 4, 6]"
                [showCurrentPageReport]="true"
                currentPageReportTemplate="{first} to {last} of {totalRecords}">
                <ng-template pTemplate="header">
                    <tr>
                        <th class="flexible-header" pSortableColumn="rowNum">
                            {{ "gis.quotation.row_num" | translate }}
                            <p-sortIcon field="rowNum" />
                        </th>
                        <th class="flexible-header" pSortableColumn="group">
                            {{ "gis.quotation.group" | translate }}
                            <p-sortIcon field="group" />
                        </th>

                        <th class="flexible-header" pSortableColumn="shortDescription">
                            {{ "gis.quotation.code" | translate }}
                            <p-sortIcon field="code" />
                        </th>

                        <th class="flexible-header" pSortableColumn="description">
                            {{ "gis.quotation.benefit" | translate }}
                            <p-sortIcon field="benefit" />
                        </th>

                        <th class="flexible-header" pSortableColumn="limitAmount">
                            {{ "gis.quotation.limit_amount" | translate }}
                            <p-sortIcon field="limitAmount" />
                        </th>

                        <th class="flexible-header" pSortableColumn="premiumRate">
                            {{ "gis.quotation.premium_rate" | translate }}
                            <p-sortIcon field="premiumRate" />
                        </th>

                        <th class="flexible-header" pSortableColumn="rateType">
                            {{ "gis.quotation.rate_type" | translate }}
                            <p-sortIcon field="rateType" />
                        </th>
                        <th class="flexible-header" pSortableColumn="actions">
                            {{ "gis.quotation.actions" | translate }}
                            <p-sortIcon field="actions" />
                        </th>
                    </tr>
                </ng-template>

                <ng-template pTemplate="body" let-sectionArray let-editing="editing" let-ri="rowIndex">
                    <tr (click)="onSelectSection(sectionArray)" [pEditableRow]="sectionArray">
                        <td class="flexible-header">{{ sectionArray.rowNumber }}</td>
                        <td class="flexible-header">{{ sectionArray.calculationGroup }}</td>
                        <td class="flexible-header">{{ sectionArray.sectioncode }}</td>
                        <td class="flexible-header">{{ sectionArray.sectionbenefit }}</td>
                        <td class="flexible-header" appCommaFormat>
                            {{ sectionArray.limitAmount }}
                        </td>
                        <td class="flexible-header">{{ sectionArray.premiumRate }}</td>
                        <td class="flexible-header">{{ sectionArray.rateType }}</td>
                        <td class="flexible-header">{{ sectionArray.actions }}</td>
                        <td class="flexible-header">
                            <!-- Edit Button -->
                            <button pButton pRipple type="button" pInitEditableRow
                                class="p-button-rounded p-button-text custom-button"
                                (click)="onEditButtonClick(sectionArray)">
                                Edit
                            </button>

                            <!-- Delete Button -->
                            <button pButton pRipple type="button"
                                class="p-button-rounded p-button-text custom-button">
                                Delete
                            </button>
                        </td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr>
                        <td colspan="8" style="padding: 30px; text-align: center">
                            <div
                                class="d-flex align-items-center justify-content-center gap-3 flex-wrap">
                                <!-- Icon + Message -->
                                <div class="d-flex align-items-center text-muted gap-2">
                                    <span>No items added yet</span>
                                </div>

                                <!-- Action buttons -->
                                <button pButton type="button"
                                    class="p-button-rounded p-button-text custom-button p-button-sm"
                                    data-bs-toggle="modal" data-bs-target="#addSection">
                                    <i class="pi pi-plus me-1"></i> Add
                                </button>

                                <button pButton type="button"
                                    class="p-button-rounded p-button-text custom-button p-button-sm"
                                    data-bs-toggle="modal" data-bs-target="#editSection">
                                    <i class="pi pi-pencil me-1"></i> Edit
                                </button>
                            </div>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    </div>
</div>
<!-- RISK CLAUSES DETAILS CARD -->
<div class="card mb-4 w-100">
    <div class="card-body w-100">
        <div>
            <div class="row">
                <div class="col-4 clause-title">
                    <strong>{{ "gis.quotation.risk_clauses" | translate }}</strong>
                </div>
                <div class="col-8 d-flex justify-content-end">
                    <button type="button" id="icon" class="btn btn-primary" data-bs-toggle="collapse"
                        data-bs-target="#riskClauses" aria-expanded="false" aria-controls="riskClauses"
                        (click)="toggleClausesopen()">
                        <i class="fa-solid fa-chevron-down"></i>
                    </button>
                </div>
            </div>
        </div>
        <div [@slideInOut]="isClausesOpen ? 'open' : 'closed'" class="mt-2 w-100">
            <p-table #riskClauseTable [value]="SubclauseLists" dataKey="code" editMode="row"
                [(selection)]="selectedClause" selectionMode="multiple" [autoLayout]="true"
                [paginator]="true" [rows]="2" [rowsPerPageOptions]="[2, 4, 6]" [scrollable]="true"
                [showCurrentPageReport]="true"
                currentPageReportTemplate="{first} to {last} of {totalRecords} entries"
                responsiveLayout="scroll" [tableStyle]="{ 'min-width': '100%', width: '100%' }"
                class="p-datatable-sm">
                <ng-template pTemplate="header">
                    <tr>
                        <th pSortableColumn="id">ID <p-sortIcon field="id" /></th>
                        <th pSortableColumn="heading">
                            Heading <p-sortIcon field="heading" />
                        </th>
                        <th pSortableColumn="wording">
                            Wording <p-sortIcon field="wording" />
                        </th>
                        <th></th>
                        <th></th>
                    </tr>

                    <!-- Filter Row -->
                    <tr>
                        <th>
                            <input pInputText type="text" placeholder="Search by ID"
                                class="form-control form-control-sm" (input)="filterId($event)" />
                        </th>
                        <th>
                            <input pInputText type="text" placeholder="Search by heading"
                                class="form-control form-control-sm" (input)="filterHeading($event)" />

                        </th>
                        <th>
                            <input pInputText type="text" placeholder="Search by Wording"
                                class="form-control form-control-sm" (input)="filterWording($event)" />
                        </th>
                        <th colspan="2"></th>
                    </tr>
                </ng-template>

                <ng-template pTemplate="body" let-selectedClauseList let-editing="editing"
                    let-ri="rowIndex">
                    <tr [pEditableRow]="selectedClauseList">
                        <td>
                            <!-- <p-tableCheckbox [value]="selectedClauseList"
(onChange)="selectedProductClauses($event)"
[(ngModel)]="selectedClauseList.checked"
[binary]="true">
></p-tableCheckbox> -->
                            <!-- <p-checkbox
[(ngModel)]="selectedClauseList.checked"
[binary]="true"
[disabled]="selectedClauseList.isMandatory === 'Y'"
(onChange)="onClauseSelectionChange(selectedClauseList)"
>
</p-checkbox> -->
                            {{ selectedClauseList.id }}
                        </td>

                        <td style="
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
overflow-y: auto;
max-width: 250px;
" pTooltip="{{ selectedClauseList.heading }}" tooltipPosition="top">
                            <p-cellEditor>
                                <ng-template pTemplate="input"
                                    *ngIf="selectedClauseList.isEditable === 'Y'">
                                    <input pInputText type="text"
                                        [(ngModel)]="selectedClauseList.heading"
                                        class="form-control form-control-sm"
                                        [ngModelOptions]="{ standalone: true }" />
                                </ng-template>
                                <ng-template pTemplate="output">
                                    {{ selectedClauseList.heading }}
                                </ng-template>
                            </p-cellEditor>
                        </td>
                        <td style="
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
max-width: 300px;
overflow-y: auto;
">
                            <p-cellEditor>
                                <ng-template pTemplate="input">
                                    <input pInputText type="text"
                                        [(ngModel)]="selectedClauseList.wording"
                                        class="form-control form-control-sm"
                                        [ngModelOptions]="{ standalone: true }" />
                                </ng-template>
                                <ng-template pTemplate="output">
                                    {{ selectedClauseList.wording }}
                                </ng-template>
                                <!-- Helper icon added next to the wording column -->
                            </p-cellEditor>
                        </td>
                        <td>
                            <button pButton pRipple type="button"
                                (click)="openHelperModal(selectedClauseList)" icon="pi pi-info-circle"
                                class="p-button-rounded p-button-text"></button>
                        </td>
                        <!-- <td
*ngIf="selectedClauseList.isEditable !== 'Y'"
style="padding-left: 24px"
>
--
</td> -->
                        <td class="text-center align-middle">
                            <ng-container
                                *ngIf="selectedClauseList.isEditable === 'Y'; else notEditable">
                                <div class="d-flex align-items-center justify-content-center gap-2">
                                    <button *ngIf="!editing" pButton pRipple type="button"
                                        pInitEditableRow
                                        class="p-button-rounded p-button-text">Edit</button>
                                    <button *ngIf="editing" pButton pRipple type="button"
                                        pSaveEditableRow icon="pi pi-check"
                                        class="p-button-rounded p-button-text p-button-success"></button>
                                    <button *ngIf="editing" pButton pRipple type="button"
                                        pCancelEditableRow icon="pi pi-times"
                                        class="p-button-rounded p-button-text p-button-danger"></button>
                                </div>
                            </ng-container>
                            <ng-template #notEditable>
                                <span class="d-block text-muted">--</span>
                            </ng-template>
                        </td>

                    </tr>
                    <!-- Modal for each row -->
                    <p-dialog [(visible)]="selectedClauseList.showHelperModal" [modal]="false"
                        [style]="{ width: '700px' }">
                        <ng-container *ngIf="selectedClauseList">
                            <div pResizable [ngStyle]="{ 'min-width.px': 200, 'min-height.px': 150 }"
                                (onResize)="onResize($event)">
                                <p>{{ selectedClauseList.wording }}</p>
                            </div>
                        </ng-container>
                    </p-dialog>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr>
                        <td colspan="5" class="text-center text-muted">
                            No clauses defined for this risk.
                        </td>
                    </tr>
                </ng-template>
            </p-table>
            <!-- <p-table [value]="SubclauseList" dataKey="code" editMode="row" [tableStyle]="{'min-width': '50rem'}"
responsiveLayout="scroll" class='ui-datatable' [autoLayout]="true" selectionMode="multiple"
[(selection)]="selectedRiskClause" [paginator]="selectedClauseList?.length > 5" [rows]="5"
[showCurrentPageReport]="selectedClauseList?.length > 5"
currentPageReportTemplate=" {first} - {last} of {totalRecords}">
<ng-template pTemplate="header">
<tr>
<th style="width: 5%;padding-right: 50px;">{{'gis.quotation.select' | translate}}</th>
<th style="width: 25%;padding-right: 50px;">{{'gis.quotation.heading' | translate}}</th>
<th style="width: 40%;">{{'gis.quotation.wording' | translate}}</th>
<th style="width: 5%;"></th>
<th style="width: 5%;">{{'gis.quotation.editable' | translate}}</th>
</tr>
</ng-template>
<ng-template pTemplate="body" let-selectedClauseList let-editing="editing" let-ri="rowIndex">
<tr (click)="onSelectRiskClauses(selectedClauseList)" [pEditableRow]="selectedClauseList">
<td>
<p-tableCheckbox [value]="selectedClauseList"></p-tableCheckbox>

</td>

<td style=" white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              overflow-y: auto;
              max-width: 250px;" pTooltip="{{selectedClauseList.heading }}" tooltipPosition="top">
<p-cellEditor>
  <ng-template pTemplate="input" *ngIf="selectedClauseList.is_editable  === 'Y'">
    <input pInputText type="text" [(ngModel)]="selectedClauseList.heading"
      class="form-control form-control-sm" [ngModelOptions]="{standalone: true}">
  </ng-template>
  <ng-template pTemplate="output">
    {{selectedClauseList.heading}}
  </ng-template>
</p-cellEditor>
</td>
<td
style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width:300px; overflow-y: auto;">
<p-cellEditor>
  <ng-template pTemplate="input">
    <input pInputText type="text" [(ngModel)]="selectedClauseList.wording"
      class="form-control form-control-sm" [ngModelOptions]="{standalone: true}">
  </ng-template>
  <ng-template pTemplate="output">
    {{selectedClauseList.wording}}
  </ng-template>
</p-cellEditor>
</td>
<td>
<button pButton pRipple type="button" (click)="openHelperModal(selectedClauseList)"
  icon="pi pi-info-circle" class="p-button-rounded p-button-text"></button>
</td>
<td *ngIf="selectedClauseList.isEditable  !== 'Y'" style="padding-left: 24px;"> -- </td>
<td *ngIf="selectedClauseList.isEditable  === 'Y'">
<div class="flex align-items-center justify-content-center gap-2">
  <button *ngIf="!editing" pButton pRipple type="button" pInitEditableRow icon="pi pi-pencil"
    class="p-button-rounded p-button-text"></button>
  <button *ngIf="editing" pButton pRipple type="button" pSaveEditableRow icon="pi pi-check"
    class="p-button-rounded p-button-text p-button-success mr-2"></button>
  <button *ngIf="editing" pButton pRipple type="button" pCancelEditableRow icon="pi pi-times"
    class="p-button-rounded p-button-text p-button-danger"></button>
</div>
</td>
</tr>
<p-dialog [(visible)]="selectedClauseList.showHelperModal" [modal]="false" [style]="{ 'width': '700px'}">
<ng-container *ngIf="selectedClauseList">
<div pResizable [ngStyle]="{'min-width.px': 200, 'min-height.px': 150}" (onResize)="onResize($event)">
  <p>{{ selectedClauseList.wording }}</p>
</div>
</ng-container>
</p-dialog>
</ng-template>
</p-table> -->
        </div>
    </div>
</div>



















filterHeading(event: Event) {
    const input = event.target as HTMLInputElement;
    this.riskClauseTable.filter(input.value, 'heading', 'contains');
  }

  filterId(event: Event) {
    const input = event.target as HTMLInputElement;
    this.riskClauseTable.filter(input.value, 'id', 'contains');
  }
  filterWording(event: Event) {
    const input = event.target as HTMLInputElement;
    this.riskClauseTable.filter(input.value, 'wording', 'contains');
  }
  



  .narrow-input {
    width: 100px;
  }

  .modal-title{
    margin-bottom: 15px;
    color: #00529B;
  }
  .delete-title{
    color: #00529B;
    margin-left: 4.5rem;
  }
  .btn-close.red-close {
    font-weight: 600;
    filter: invert(29%) sepia(96%) saturate(7476%) hue-rotate(354deg) brightness(94%) contrast(123%);
  }
  .clause-title{
    font-family: Roboto;
    font-weight: 500;
    font-size: 20px;
    color: #00529B;

  }
  
  
  .custom-close {
    filter: brightness(0) saturate(100%) invert(19%) sepia(97%) saturate(7451%) hue-rotate(357deg) brightness(102%) contrast(122%);
    background-color: transparent !important;
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    width: 1.75rem;         /* Adjust width */
    height: 1.75rem;        /* Adjust height */
    font-size: 1.2rem;      /* Makes the "×" icon bigger */
    line-height: 1.75rem; 
  }
  ::ng-deep .p-datatable table {
    width: 100% !important;
  }




