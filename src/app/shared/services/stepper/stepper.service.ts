import { Injectable } from '@angular/core';
import { Step } from '../../data/steps';

/**
 *  Service class to get the list of steps
 */

@Injectable({
  providedIn: 'root'
})
export class StepperService {
  private quoteData: Step[] = [
    {
      number: 1,
      title: 'First Step',
      caption: 'Optional'
    },
    {
      number: 2,
      title: 'Second Step',
      caption: 'This is description of the second step.'
    },
    {
      number: 3,
      title: 'Third Step',
      caption: 'Some text about the third step.'
    },

    {
      number: 4,
      title: 'Fourth Step',
      caption: 'Some text about the third step.'
    },

    // {
    //   number: 5,
    //   title: 'Fifth Step',
    //   caption: 'Some text about the third step.'
    // },

    // {
    //   number: 6,
    //   title: 'Sixth Step',
    //   caption: 'Some text about the third step.'
    // },

    {
      number: 7,
      title: 'Finish',
    },
    // Add more steps as needed
  ];

  private proposalData: Step[] = [
    {
      number: 1,
      title: 'Client Basic Information',
      caption: 'create a client full information'
    },
    // {
    //   number: 2,
    //   title: 'Policy Agent',
    //   caption: 'This is description of the second step.'
    // },
    {
      number: 2,
      title: 'Coverage Preferences',
      caption: 'This is description of the second step.'
    },
    {
      number: 3,
      title: 'Health and Lifestyle Questions',
      caption: 'Some text about the third step.'
    },

    {
      number: 4,
      title: 'Proposal Calculation',
      caption: 'Some text about the third step.'
    },

    {
      number: 5,
      title: 'Premium Payment',
      caption: 'Some text about the third step.'
    },

    {
      number: 6,
      title: 'Proposal to Policy Conversion',
      caption: 'Some text about the third step.'
    },
    {
      number: 7,
      title: 'Authorizing the Policy, issuance and Dispatch of document',
      caption: 'Some text about the third step.'
    },

    {
      number: 8,
      title: 'Finish',
    },
  ];

  constructor() { }

  getQuotationSteps(){
    return this.quoteData
  }
  getProposalSteps(){
    return this.proposalData
  }
}


