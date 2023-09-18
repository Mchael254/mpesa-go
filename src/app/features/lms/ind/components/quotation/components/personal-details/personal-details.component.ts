import { Component } from '@angular/core';
import stepData from '../../data/steps.json';
import { Location } from '@angular/common';
import { QuotationFormSetUp } from '../../config/quotations.forms';
import { Router } from '@angular/router';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.css']
})
export class PersonalDetailsComponent {
  steps = stepData
  personalDetailFormfields: any[];
  buttonConfig: any;
  searchForm: FormGroup;
  escalationForm: FormGroup;
  contactDetailsForm: FormGroup;
  postalAddressForm: FormGroup;
  residentialAddressForm: FormGroup;
  uploadList: any[] = [];
  selectedUploadItem: string;

  breadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard'
    },
    {
      label: 'Quotation',
      url: '/home/lms/ind/quotation/list'
    },
    {
      label: 'Client Details(Data Entry)',
      url: '/home/lms/ind/quotation/client-details'
    },
  ];

  isTableOpen: boolean = false;
  openTable() {
    this.isTableOpen = true;
  }

  closeTable() {
    this.isTableOpen = false;
  }


  constructor(private location:Location, private quoteFormSetup: QuotationFormSetUp, private router: Router, private fb:FormBuilder){
    this.personalDetailFormfields = quoteFormSetup.personalDetailForms();
    this.buttonConfig = quoteFormSetup.actionButtonConfig();
    this.searchForm = this.fb.group({
      client: ['N'],
      clientType: ['N'],
      IdetifierType: ['N'],
      citizenship: ['N'],
      surname: ['N'],
      other_name: ['N'],
      idNumber: ['N'],
      gender: ['N'],
      pinNo: ['N'],
      date_of_birth: ['N'],
      // pinNo: ['N'],
      // pinNo: ['N'],
      // pinNo: ['N'],
    });

    this.escalationForm = this.fb.group({
      question: ['N'],
    });

    this.contactDetailsForm = this.fb.group({
      branch: [''],
      number: [''],
      title: [''],
      telephone: [''],
      email: [''],
      p_contact_channel: [''],
      edocs: [''],
    });


    this.postalAddressForm = this.fb.group({
      po_box: [''],
      country: [''],
      county: [''],
      town: [''],
      p_address: [''],
    });

    this.residentialAddressForm = this.fb.group({
      town: [''],
      road: [''],
      house_no: [''],
      u_bill: [''],
      u_u_bill: [''],
    });

    this.uploadList = [{
      label: 'Means of Identification', value: 'IND',
      items: [
          { label: 'Mumbai', value: 'Mumbai' },
          { label: 'Varanasi', value: 'Varanasi' },
          { label: 'Nashik', value: 'Nashik' },
          { label: 'Delhi', value: 'Delhi' }
      ]
  },
  {
      label: 'Bill Uploads', value: 'us',
      items: [
          { label: 'Chicago', value: 'Chicago' },
          { label: 'Los Angeles', value: 'Los Angeles' },
          { label: 'New York', value: 'New York' },
          { label: 'San Francisco', value: 'San Francisco' }
      ]
  },]
  }

  get clientControl(){
    return this.searchForm.get('client') as FormControl;
  }

  selectDate(event){}


  saveButton(value){

    value['webClntType'] ='I'
    value['webClntIdRegDoc'] ='I'
    console.log(value);
    this.router.navigate(['/home/lms/ind/quotation/quotation-details']);
  }
  goBack(){
    this.location.back()
  }




















  products!: any[];

  statuses!: any[];

  clonedProducts: { [s: string]: any } = {};

  ngOnInit() {
          this.products = [{
            id: '1000',
            code: 'f230fh0g3',
            name: 'Bamboo Watch',
            description: 'Product Description',
            image: 'bamboo-watch.jpg',
            price: 65,
            category: 'Accessories',
            quantity: 24,
            inventoryStatus: 'INSTOCK',
            rating: 5
        },];

      this.statuses = [
          { label: 'In Stock', value: 'INSTOCK' },
          { label: 'Low Stock', value: 'LOWSTOCK' },
          { label: 'Out of Stock', value: 'OUTOFSTOCK' }
      ];
  }

  onRowEditInit(product: any) {
      this.clonedProducts[product.id as string] = { ...product };
  }

  onRowEditSave(product: any) {
      if (product.price > 0) {
          delete this.clonedProducts[product.id as string];
          // this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is updated' });
      } else {
          // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price' });
      }
  }

  onRowEditCancel(product: any, index: number) {
      this.products[index] = this.clonedProducts[product.id as string];
      delete this.clonedProducts[product.id as string];
  }

}
