import {Component, OnInit} from '@angular/core';
import {Logger} from "../../../../../shared/services";
import {Subclasses} from "../../../../gis/components/setups/data/gisDTO";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Pagination} from "../../../../../shared/data/common/pagination";
import {PreviousCedingDTO, ReinsuranceRiskDetailsDTO} from "../../../../gis/data/reinsurance-dto";
import {AgentDTO} from "../../../../entities/data/AgentDTO";

const log = new Logger('ReinsuranceApportionmentComponent');
@Component({
  selector: 'app-reinsurance-apportionment',
  templateUrl: './reinsurance-apportionment.component.html',
  styleUrls: ['./reinsurance-apportionment.component.css']
})
export class ReinsuranceApportionmentComponent implements OnInit {
  pageSize: 5;
  riskReinsuranceDetails: any[];
  subclassData: Subclasses;
  treatySetupsData: Pagination<any> =  <Pagination<any>>{};
  reinsuranceRiskDetailsData: Pagination<ReinsuranceRiskDetailsDTO> = <Pagination<ReinsuranceRiskDetailsDTO>>{};
  reinsuranceFacreCedingData: any[];
  intermediaryData: AgentDTO;
  reinsurancePoolData: any[];
  reinsuranceXolPremiumData: any[];
  reXolPremiumParticipantData: any[];
  treatyParticipantData: any[];
  previousCedingData: PreviousCedingDTO[] = [];
  treatyCessionsData: Pagination<ReinsuranceRiskDetailsDTO> = <Pagination<ReinsuranceRiskDetailsDTO>>{};
  previousFacreCedingData: any[];

  treatyRISummaryForm: FormGroup;

  activeIndex: number = 0;

  constructor(private fb: FormBuilder,){}

  ngOnInit(): void {
    this.createTreatyRiSummaryForm();
  }

  selectTreatyRiskCeding(treatyRiskCeding: any) {

  }

  selectRiskRiSummary(treatyRISummary: any) {

  }

  selectPreviousCedingDetails(previousCeding: any) {

  }

  /**
   * The function creates a form group for a treaty reinsurance summary.
   */
  createTreatyRiSummaryForm() {

    this.treatyRISummaryForm = this.fb.group({
      companyNetPRate: [''],
      companyNetRiAmt: [''],
      companyNetCession: [''],
      companyNetPremium: [''],
      reinsurancePRate: [''],
      reinsuranceRiAmt: [''],
      reinsuranceCession: [''],
      reinsurancePremium: [''],
      treatyPRate: [''],
      treatyRiAmt: [''],
      treatyCession: [''],
      treatyPremium: [''],
      facrePRate: [''],
      facreRiAmt: [''],
      facreCession: [''],
      facrePremium: [''],
      totalRiAmt: [''],
      totalCession: [''],
      totalPremium: [''],
      excessRiAmt: [''],
      excessCession: [''],
      excessPremium: [''],
    });
  }

  /**
   * The function opens the treaty setup modal window.
   */
  openTreatySetupModal() {
    const modal = document.getElementById('treatySetupToggle');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        modalBackdrop.classList.add('show');
      }
    }
  }

  /**
   * The function closes the treaty setup modal window.
   */
  closeTreatySetupModal() {
    const modal = document.getElementById('treatySetupToggle');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        modalBackdrop.classList.remove('show');
      }
    }
  }

  /**
   * The function opens the risk ceding modal window.
   */
  openRiskCedingModal() {
    const modal = document.getElementById('riskCedingEditToggle');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        modalBackdrop.classList.add('show');
      }
    }
  }

  /**
   * The function closes the risk ceding modal window.
   */
  closeRiskCedingModal() {
    const modal = document.getElementById('riskCedingEditToggle');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        modalBackdrop.classList.remove('show');
      }
    }
  }

  /**
   * The function opens the treaty cessions modal window.
   */
  openTreatyCessionsModal() {
    const modal = document.getElementById('treatyCessionsEditToggle');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        modalBackdrop.classList.add('show');
      }
    }
  }

   /**
   * The function closes the treaty cessions modal window.
   */
  closeTreatyCessionsModal() {
    const modal = document.getElementById('treatyCessionsEditToggle');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        modalBackdrop.classList.remove('show');
      }
    }
  }

  /**
   * The function opens the facre ceding modal window.
   */
  openFacreCedingModal() {
    const modal = document.getElementById('facreCedingEditToggle');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        modalBackdrop.classList.add('show');
      }
    }
  }

  /**
   * The function closes the facre ceding modal window.
   */
  closeFacreCedingModal() {
    const modal = document.getElementById('facreCedingEditToggle');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        modalBackdrop.classList.remove('show');
      }
    }
  }

  /**
   * The function opens the policy facre ceding modal window.
   */
  openPolicyFacreCedingModal() {
    const modal = document.getElementById('policyFacreCedingEditToggle');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        modalBackdrop.classList.add('show');
      }
    }
  }

   /**
   * The function closes the policy facre ceding modal window.
   */
  closePolicyFacreCedingModal() {
    const modal = document.getElementById('policyFacreCedingEditToggle');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        modalBackdrop.classList.remove('show');
      }
    }
  }
}
