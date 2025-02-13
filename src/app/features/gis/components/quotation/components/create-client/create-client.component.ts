import { Component } from '@angular/core';
import { Logger, untilDestroyed } from '../../../../../../shared/shared.module'
import { PassedClientDto } from 'src/app/features/entities/data/PassedClientDTO';
import { QuotationsService } from '../../services/quotations/quotations.service';
import { Router } from '@angular/router';


const log = new Logger('CreateClientComponent');

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.css']
})
export class CreateClientComponent {

  passedNewClientDetails: any;
  clientData: PassedClientDto
  passedQuotation: any;
  passedQuotationNo: any;
  passedQuotationCode: string;
  quotationCode: number;
  batchNo: any;
  convertToNormalQuoteFlag: string;
  convertToPolicyFlag: string;

  constructor(
    public quotationService: QuotationsService,
    public router: Router,


  ) {

  }

  ngOnInit(): void {

    const passedNewClientDetailsString = sessionStorage.getItem(
      'passedNewClientDetails'
    );
    this.passedNewClientDetails = JSON.parse(passedNewClientDetailsString);
    log.debug('passed Gis Client Details:', this.passedNewClientDetails);

    const passedQuotationDetailsString = sessionStorage.getItem(
      'passedQuotationDetails'
    );
    this.passedQuotation = JSON.parse(passedQuotationDetailsString);
    log.debug("Passed Quotation Details",this.passedQuotation)


    const inputClientName = this.passedNewClientDetails.inputClientName;
    const inputClientEmail = this.passedNewClientDetails.inputClientEmail;
    const inputClientPhone = this.passedNewClientDetails.inputClientPhone;
    const inputClientZipCode = this.passedNewClientDetails.inputClientZipCode

    const surname= inputClientName.split(' ').pop()
    const otherName= inputClientName.split(' ').slice(0, -1).join(' ')
    // const [otherName, surname] = inputClientName.split(' '); // Split into parts

    this.clientData = {
      surname,
      otherName,
      countryCodeSms:inputClientZipCode,
      smsNumber: inputClientPhone,
      email: inputClientEmail,
    };
    log.debug("CLIENTDATA", this.clientData)
  }
  convertToPolicy() {
    log.debug("Quotation Details",this.passedQuotation)
    this.quotationCode = this.passedQuotation?.quotationProducts[0]?.quotCode;
    log.debug("Quotation Code",this.quotationCode)
    this.quotationService.convertQuoteToPolicy(this.quotationCode).subscribe((data:any) => {
      log.debug("Response after converting quote to a policy:", data)
      this.batchNo = data._embedded.batchNo
      log.debug("Batch number",this.batchNo)
      const convertedQuoteBatchNo = JSON.stringify(this.batchNo);
      sessionStorage.setItem('convertedQuoteBatchNo', convertedQuoteBatchNo);
      this.router.navigate(['/home/gis/policy/policy-summary']);

    })
  }

  convertQuoteToNormalQuote() {
    log.debug("Quotation Details",this.passedQuotation);

    const quotationNumber = this.passedQuotation?.quotOriginalQuotNo;
    log.debug("Quotation Number",quotationNumber);
    sessionStorage.setItem("quotationNum", quotationNumber);

    const conversionFlag = true;
    sessionStorage.setItem("conversionFlag", JSON.stringify(conversionFlag));

    // Get the quotCode
    const quotationCode = this.passedQuotation?.quotationProducts[0]?.quotCode;
    log.debug("Quotation Code",this.quotationCode);


    // Call the API to convert quote to normal quote
    this.quotationService
      .convertToNormalQuote(quotationCode)
      .subscribe((data:any) => {
        log.debug("Response after converting quote to a normlaQuote:", data)

        this.router.navigate(['/home/gis/quotation/quotation-summary']);

      }
    );
  }

  handleSaveClient(eventData: any) {
    log.debug('Event received in Component B:', eventData);

    if(eventData) {
      this.convertToNormalQuoteFlag = sessionStorage.getItem("convertToNormalQuoteFlag") || "";
      this.convertToPolicyFlag = sessionStorage.getItem("convertToPolicyFlag") || "";

      log.debug("convertToNormalQuoteFlag", this.convertToNormalQuoteFlag);
      log.debug("convertToPolicyFlag", this.convertToPolicyFlag);

      if(this.convertToPolicyFlag) {
        this.convertToPolicy();
        sessionStorage.removeItem("convertToPolicyFlag");
      } else if (this.convertToNormalQuoteFlag) {
        this.convertQuoteToNormalQuote();
        sessionStorage.removeItem("convertToNormalQuoteFlag");
      }
    }
  }
}
