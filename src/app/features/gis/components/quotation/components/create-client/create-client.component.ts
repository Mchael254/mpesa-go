import { Component } from '@angular/core';
import { Logger, untilDestroyed } from '../../../../../../shared/shared.module'
import { PassedClientDto } from 'src/app/features/entities/data/PassedClientDTO';


const log = new Logger('CreateClientComponent');

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.css']
})
export class CreateClientComponent {

  passedNewClientDetails: any;
  clientData: PassedClientDto

  constructor() {

  }

  ngOnInit(): void {

    const passedNewClientDetailsString = sessionStorage.getItem(
      'passedNewClientDetails'
    );
    this.passedNewClientDetails = JSON.parse(passedNewClientDetailsString);
    log.debug('passed Gis Client Details:', this.passedNewClientDetails);

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

  }
}
