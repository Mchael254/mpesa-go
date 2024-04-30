import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import stepData from '../../data/steps.json';
import { FormBuilder } from '@angular/forms';
import { ReinsuranceService } from '../../service/reinsurance.service';
import { FacultativeTreatyDTO, MemberDetailedSummaryDTO, ReinsuranceMembersDTO, SurplusTreatyDTO, SurplusTreatyTotalsDTO } from '../../models/reinsurance-summaryDTO';
import {AutoUnsubscribe} from "../../../../../../../shared/services/AutoUnsubscribe";

@AutoUnsubscribe
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit, OnDestroy {
  data = 257;
  columnOptions: SelectItem[];
  selectedColumns: string[];
  steps = stepData;
  endorsementCode = 20231683286
  productCode = 2021675
  policyCode = 20231454213
  // policyMemUniqueCode = 20231162587
  policyMemUniqueCode: number
  surplusTreaty: SurplusTreatyDTO[];
  facultativeTreaty: FacultativeTreatyDTO[];
  memDetailedSummary: MemberDetailedSummaryDTO;
  reinsuranceMembers: ReinsuranceMembersDTO[];
  surplusTreatyTotals: SurplusTreatyTotalsDTO;

  constructor (
    private router: Router,
    private reinsurancService: ReinsuranceService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.getSurplusTreaty();
    this.getFacultativeTreaty();
    this.getReinsuranceMembers();
    this.getReinsuranceTotals();
  }

  ngOnDestroy(): void {

  }

  finish() {

  }

  back() {
    this.router.navigate(['/home/lms/grp/reinsurance/selection'])
  }

  showMemberDetailedSummary(reinsuranceMembers) {
    this.policyMemUniqueCode = reinsuranceMembers.polm_code
    console.log('Selected Row Data:', reinsuranceMembers, this.policyMemUniqueCode);
    const modal = document.getElementById('memberDetailedSummary');
    this.getDetailedMemSummary()
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }

  }

  closeMemberDetailedSummary() {
    const modal = document.getElementById('memberDetailedSummary');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }

  }

  getSurplusTreaty() {
    this.reinsurancService.getSurplusParticipantsSummary(this.endorsementCode).subscribe((surplusTreaty: SurplusTreatyDTO[]) => {
      console.log("surplusTreaty", surplusTreaty);
      this.surplusTreaty = surplusTreaty;
    })
  }

  getFacultativeTreaty() {
    this.reinsurancService.getFacultativeParticipantsSummary(this.endorsementCode).subscribe((facultativeTreaty: FacultativeTreatyDTO[]) => {
      console.log("facultativeTreaty", facultativeTreaty);
      this.facultativeTreaty = facultativeTreaty;
    })
  }

  getDetailedMemSummary() {
    this.reinsurancService.getMemDetailedSummary(this.endorsementCode, this.policyMemUniqueCode).subscribe((MemDetailedSummary:MemberDetailedSummaryDTO) => {
      console.log("MemDetailedSummary", MemDetailedSummary);
      this.memDetailedSummary = MemDetailedSummary
    })
  }

  getReinsuranceMembers() {
    this.reinsurancService.getReinsuranceMembers(20231454304, this.endorsementCode).subscribe((reinsuranceMembers: ReinsuranceMembersDTO[]) => {
      console.log("reinsuranceMembers", reinsuranceMembers);
      this.reinsuranceMembers = reinsuranceMembers;
    })
  }

  getReinsuranceTotals() {
    this.reinsurancService.getReinsuranceTotals(this.endorsementCode).subscribe((reinsuranceTotals: SurplusTreatyTotalsDTO) => {
      console.log("reinsuranceTotals", reinsuranceTotals);
      this.surplusTreatyTotals = reinsuranceTotals;
    })
  }

}
