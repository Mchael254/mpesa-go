import { Component } from '@angular/core';

@Component({
  selector: 'app-quoutation-report',
  templateUrl: './quoutation-report.component.html',
  styleUrls: ['./quoutation-report.component.css']
})
export class QuoutationReportComponent {
   // Quotation header info
   quotationStatus = 'Draft';
   proposalIssued = 'NA';
   period = '15 May 2025 to 15 February 2026';
   quoteTime = '10 May 2025 1000 HRS';
   agencyName = 'John Doe';
 
   
   motorPrivateList = [
     {
       useOfProperty: 'Private',
       value: 'KES 1,600,000',
       premium: {
         comprehensive: 'KES 792,000.00',
         clauses: ['Excess clause', 'Average clause', 'Reinstatement clause'],
         limitsOfLiability: [
           'Third party liability - KES 1,000,000',
           'Third party property damage - KES 500,000',
           'Windscreen cover - KES 50,000'
         ],
         excess: [
           'Theft with standard anti-theft device',
           'Own damage',
           'Theft with satellite tracking'
         ],
         benefits: ['Windshield', 'Radio cassette']
       },
       thirdParty: {
         premium: 'KES 792,000.00',
         clauses: ['Excess clause', 'Average clause', 'Reinstatement clause'],
         limitsOfLiability: [
           'Third-party liability - KES 1,000,000',
           'Windscreen cover - KES 50,000'
         ],
         excess: [
           'Theft with standard anti-theft device',
           'Own damage',
           'Theft with satellite tracking'
         ],
         benefits: ['Windshield', 'Radio cassette']
       }
     },
     {
       useOfProperty: 'Private',
       value: 'KES 1,600,000',
       premium: {
         comprehensive: 'KES 792,000.00',
         clauses: ['Excess clause', 'Average clause', 'Reinstatement clause'],
         limitsOfLiability: [
           'Third party liability - KES 1,000,000',
           'Third party property damage - KES 500,000',
           'Windscreen cover - KES 50,000'
         ],
         excess: [
           'Theft with standard anti-theft device',
           'Own damage',
           'Theft with satellite tracking'
         ],
         benefits: ['Windshield', 'Radio cassette']
       },
       thirdParty: {
         premium: 'KES 792,000.00',
         clauses: ['Excess clause', 'Average clause', 'Reinstatement clause'],
         limitsOfLiability: [
           'Third-party liability - KES 1,000,000',
           'Windscreen cover - KES 50,000'
         ],
         excess: [
           'Theft with standard anti-theft device',
           'Own damage',
           'Theft with satellite tracking'
         ],
         benefits: ['Windshield', 'Radio cassette']
       }
     }
   ];
 
 // ✅ New - Domestic Insurance as Array
 domesticList = [
   {
     useOfProperty: 'Private',
     value: 'KES 1,600,000',
     premium: {
       comprehensive: 'KES 792,000.00',
       clauses: ['Excess clause', 'Average clause', 'Reinstatement clause'],
       limitsOfLiability: [
         'Third party liability - KES 1,000,000',
         'Third party property damage - KES 500,000',
         'Windscreen cover - KES 50,000'
       ],
       excess: [
         'Theft with standard anti-theft device',
         'Own damage',
         'Theft with satellite tracking'
       ],
       benefits: ['Windshield', 'Radio cassette']
     }
   },
   // ➕ Add more domestic entries if needed
 ];
 
 
 paymentMethodsList = [
   {
     method: 'M-pesa',
     details: [
       { label: 'PayBill Number', value: '123456' },
       { label: 'Your Name', value: '' }
     ]
   },
   {
     method: 'Cheque',
     details: [
       { label: 'Payee', value: 'TurnQuest Insurance Ltd' },
       { label: 'Drop off', value: 'Lexington Chuka office' }
     ]
   }
 ];
   constructor() {}
 
   ngOnInit(): void {}
 
   
   downloadPDF(): void {
     if (typeof window !== 'undefined') {
       // Dynamically import html2pdf.js only on the client-side
       import('html2pdf.js').then((html2pdfModule) => {
         const html2pdf = html2pdfModule.default;
   
         // Target the element with id 'content-to-pdf'
         const element = document.getElementById('content-to-pdf');
         
         // Check if the element is found
         if (element) {
           console.log('Element found, generating PDF...');
           
           const options = {
             margin: 0.5,
             filename: 'insurance-quotation.pdf',
             image: { type: 'jpeg', quality: 0.98 },
             html2canvas: { scale: 2 },
             jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
           };
           
           // Generate and download the PDF
           html2pdf().from(element).set(options).save()
             .then(() => console.log('PDF saved successfully!'))
             .catch((error:any) => console.error('Error generating PDF:', error));
         } else {
           console.error('Error: Element with id "content-to-pdf" not found!');
         }
       }).catch((error) => {
         console.error('Error loading html2pdf.js:', error);
       });
     } else {
       console.warn('html2pdf.js is only available in a browser environment.');
     }
   }
   
   
 
 }


