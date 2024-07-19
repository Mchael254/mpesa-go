import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Logger} from "../../../../../../../shared/services";
import {IdentityModeDTO} from "../../../../../data/entityDto";
import {AccountService} from "../../../../../services/account/account.service";

const log = new Logger('EditBankFormComponent');

@Component({
  selector: 'app-edit-nok-form',
  templateUrl: './edit-nok-form.component.html',
  styleUrls: ['./edit-nok-form.component.css']
})
export class EditNokFormComponent implements OnInit {

  nokForm: FormGroup;
  modeIdentityType: IdentityModeDTO[];

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
  ) {}

  ngOnInit(): void {
    this.createNokForm();
    this.fetchModeOfIdentity(2);
  }

  createNokForm(): void {
    this.nokForm = this.fb.group({
      identityType: [''],
      idNo: [''],
      fullNames: [''],
      email: [''],
      relation: [''],
      mobile: [''],
      dob: [''],
    });
  }

  fetchModeOfIdentity(organizationId: number): void {
    this.accountService.getIdentityMode(organizationId).subscribe({
      next: (identityMode) => {
        this.modeIdentityType = identityMode;
      },
      error: (err) => {
        log.info(`could not fetch identity modes `, err);
      }
    })
  }

  updateDetails(): void {
    const formValues = this.nokForm.getRawValue();
    log.info(`edit bank details >>> `, formValues);
  }

}
