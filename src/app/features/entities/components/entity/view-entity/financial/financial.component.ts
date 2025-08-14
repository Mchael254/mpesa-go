import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Logger, UtilService} from "../../../../../../shared/services";
import {GlobalMessagingService} from "../../../../../../shared/services/messaging/global-messaging.service";
import {BankService} from "../../../../../../shared/services/setups/bank/bank.service";
import {Country} from "ngx-intl-tel-input/lib/model/country.model";
import {Observable} from "rxjs";
import {Bank} from "../../../../data/BankDto";
import {BankDTO} from "../../../../../../shared/data/common/bank-dto";

const log = new Logger('FinancialComponent');

@Component({
  selector: 'app-financial',
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.css']
})
export class FinancialComponent implements OnInit {

  @ViewChild('editButton') editButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('closeButton') closeButton!: ElementRef<HTMLButtonElement>;

  @Input() financialDetailsConfig: any
  @Input() formFieldsConfig: any;
  @Input() financialDetails: any;
  @Input() accountCode: number;
  @Input() countryId: number;

  language: string = 'en';
  editForm: FormGroup;

  // countries$: Observable<Country[]>;
  banks$: Observable<BankDTO[]>;
  banks: BankDTO[];

  constructor(
    private fb: FormBuilder,
    private utilService: UtilService,
    private globalMessagingService: GlobalMessagingService,
    private bankService: BankService,
  ) {
    this.utilService.currentLanguage.subscribe(lang => this.language = lang);
  }


  ngOnInit(): void {
    this.banks$ = this.bankService.getBanks(this.countryId);
    this.createEditForm(this.formFieldsConfig.fields);
  }

  createEditForm(fields: any[]): void {
    const group: { [key: string]: any } = {};
    fields.forEach(field => {
      group[field.fieldId] = [
        field.defaultValue,
        field.isMandatory ? Validators.required : []
      ];
    });
    this.editForm = this.fb.group(group);
  }

  openEditFinancialDialog(): void {
    this.editButton.nativeElement.click();
    this.setSelectOptions();
    // setTimeout(() => {this.patchFormValues()}, 500)
  }

  editFinancialDetails(): void {
    const formValues = this.editForm.getRawValue();
    log.info(formValues);
  }

  setSelectOptions(): void {
    this.formFieldsConfig.fields.forEach(field => {
      switch (field.fieldId) {
        case 'bankName':
          this.banks$.subscribe({
            next: res => {
              field.options = res;
              this.banks = res;
            }
          })
      }
    });
  }

}
