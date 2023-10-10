import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import stepData from '../../data/steps.json';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';
import { Observable, map, finalize } from 'rxjs';

@Component({
  selector: 'app-insurance-history',
  templateUrl: './insurance-history.component.html',
  styleUrls: ['./insurance-history.component.css']
})
@AutoUnsubscribe
export class InsuranceHistoryComponent implements OnDestroy {
  steps = stepData
  products = []
  insuranceHistoryForm: FormGroup;
  breadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard'
    },
    {
      label: 'Quotation',
      url: '/home/lms/quotation/list'
    },
    {
      label: 'Insurance History(Data Entry)',
      url: '/home/lms/ind/quotation/insurance-history'
    },
  ];

  benefricairyList$: Observable<any[]>;
  editEntity: boolean;



  constructor(private fb: FormBuilder){
    this.insuranceHistoryForm = this.fb.group({
      question1: ['N'],
      question2: ['N'],
    });
  }

  getValue(name: string = 'question1') {
    return this.insuranceHistoryForm.get(name).value;
  }



  onRowEditInit(event){}
  onRowEditSave(event){}
  onRowEditCancel(event, ev){}


  addBeneficary() {
    this.benefricairyList$ = this.addEntity(this.benefricairyList$);
  }
  deleteBeneficiary(i: number) {
    this.benefricairyList$ = this.deleteEntity(this.benefricairyList$, i);
  }

  private addEntity(d: Observable<any[]>) {
    this.editEntity = true;
    return d.pipe(
      map((data: any[]) => {
        let addNew = { isEdit: true };
        data.push(addNew);
        return data;
      }),
      finalize(() => {
        this.editEntity = false;
      })
    );
  }
  private deleteEntity(d: Observable<any[]>, i) {
    this.editEntity = true;
    return d.pipe(
      map((d) => {
        return d.filter((data, x) => {
          return i !== x;
        });
      }),
      finalize(() => {
        this.editEntity = false;
      })
    );
  }
  private returnLowerCase(data: any) {
    let mapData = data.map((da) => {
      da['name'] = da['name'].toLowerCase();
      return da;
    });
    return mapData;
  }
  ngOnDestroy(): void {
    console.log('InsuranceHistoryComponent UNSUBSCRIBE');

  }

}
