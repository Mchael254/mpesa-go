import { Component, OnInit } from '@angular/core';
import { ExceptionsService } from 'src/app/features/lms/service/exceptions/exceptions.service';
import { TableDetail } from 'src/app/shared/data/table-detail';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';

@Component({
  selector: 'app-exceptions',
  templateUrl: './exceptions.component.html',
  styleUrls: ['./exceptions.component.css']
})
@AutoUnsubscribe
export class ExceptionsComponent implements OnInit {

  colsInd = [
    { field: 'name', header: 'Name' },
    { field: 'description', header: 'Description' },
    { field: 'type', header: 'Type' },
    {field: 'captured_by', header: 'Captured By'}
  ];
  webQuoteTotalLength = 0;
  rowsInd: any[] = [];

  exceptionList: TableDetail= {
    cols: this.colsInd,
    rows: this.rowsInd,
    // globalFilterFields: this.globalFilterFieldsInd,
    showFilter: false,
    showSorting: false,
    paginator: false,
  };

  constructor(private exceptions_service: ExceptionsService){}
  ngOnInit(): void {
    this.exceptions_service.getListOfExceptionsByPolCode().subscribe((data:any) => {
      // this.rowsInd = data
      this.exceptionList['rows'] = data
      console.log(data);
      
    })

  }

  deleteException(item:any){ 
    console.log(item); 
    // this.exceptionList.rows = this.exceptionList.rows.filter(data => {data?.code !== item?.code});
    this.exceptions_service.deleteExceptionsByPolCode(item?.code).subscribe(data => {
      this.exceptionList.rows = this.exceptionList.rows.filter(data => {data?.code !== item?.code});
    })
  }

  paginate(e: any){}

  selectRow(e:any){}

}
