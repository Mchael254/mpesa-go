import {
  AfterViewInit, ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import { PaymentAdviceDTO, PaymentMethodDTO, QuotationDetails, QuotationHeaderDTO } from '../../data/quotationsDTO';
import { PdfGeneratorService } from '../../services/quotations/pdf-generator.service';
import { ProductLevelPremium } from "../../data/premium-computation";
import { Logger } from "../../../../../../shared/services";
import { Router } from '@angular/router';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs = (pdfFonts as any).vfs;
import { TDocumentDefinitions } from 'pdfmake/interfaces';

import { AppConfigService } from 'src/app/core/config/app-config-service';
import { ConfigurationLoader } from 'src/app/core/config/app-config-loader';
import { NgxCurrencyConfig } from 'ngx-currency';
import { CurrencyService } from 'src/app/shared/services/setups/currency/currency.service';
import { untilDestroyed } from 'src/app/shared/services/until-destroyed';




const log = new Logger('QuoteReportComponent');

interface DisplayRow {
  productDescription: string;
  risk: any;
  propertyId: string;
  count: number;
}

interface EnrichedRisk {
  risk: any;
  count: number;
}

interface EnrichedProduct {
  description: string;
  code: number;
  enrichedRisks: EnrichedRisk[];
}

@Component({
  selector: 'app-quote-report',
  templateUrl: './quote-report.component.html',
  styleUrls: ['./quote-report.component.css']
})
export class QuoteReportComponent implements OnInit, AfterViewInit {

  paymentAdviceData!: PaymentAdviceDTO;

  @Input() quotationDetails!: QuotationDetails;
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;
  private _premiumComputationResponse: ProductLevelPremium
  @Input() selectedCovers: any
  enrichedProducts: { description: string; code: number; enrichedRisks: EnrichedRisk[]; }[];
  @Input()
  set premiumComputationResponse(value: ProductLevelPremium) {
    log.debug("Computation payload upon click>>>", value)
    this._premiumComputationResponse = value
  }

  currencyList: any;
  currencyCode: any;
  selectedCurrency: any;
  selectedCurrencyCode: any;
  defaultCurrencyName: any;
  minDate: Date | undefined;
  currencyDelimiter: any;
  defaultCurrencySymbol: any;
  selectedCurrencySymbol: any;
  public currencyObj: NgxCurrencyConfig;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    private pdfGenerator: PdfGeneratorService,
    private cdr: ChangeDetectorRef, private router: Router,
    private currencyService: CurrencyService,
    private appConfigService: AppConfigService,
    private configLoader: ConfigurationLoader
  ) {

  }



  // constructor(@Inject(PLATFORM_ID) private platformId: Object,
  //   private pdfGenerator: PdfGeneratorService,
  //   private cdr: ChangeDetectorRef, private router: Router,
  //   private appConfigService: AppConfigService,
  //   private configLoader: ConfigurationLoader) {

  // }

  /**
   * Loads all currencies and selects based on the currency code.
   * - Subscribes to 'getAllCurrencies' from CurrencyService.
   * - Populates 'currencyList' and filters for the selected currency.
   * - Assigns name and code from the filtered currency.
   * - Logs the selected currency details and triggers change detection.
   * @method loadAllCurrencies
   * @return {void}
   */
  loadAllCurrencies() {
    this.currencyService
      .getAllCurrencies()
      .pipe(
        untilDestroyed(this))
      .subscribe((data) => {
        this.currencyList = data
        const defaultCurrency = this.currencyList.find(
          (currency) => currency.currencyDefault == 'Y'
        );
        if (defaultCurrency) {
          log.debug('DEFAULT CURRENCY', defaultCurrency);
          this.defaultCurrencyName = defaultCurrency.name;
          log.debug('DEFAULT CURRENCY Name', this.defaultCurrencyName);
          this.defaultCurrencySymbol = defaultCurrency.symbol;
          log.debug('DEFAULT CURRENCY Symbol', this.defaultCurrencySymbol);
          this.setCurrencySymbol(this.defaultCurrencySymbol);
        }
      });
  }

  setCurrencySymbol(currencySymbol: string) {
    this.selectedCurrencySymbol = currencySymbol + ' ';
    sessionStorage.setItem('currencySymbol', this.selectedCurrencySymbol);
    const currencyDelimiter = sessionStorage.getItem('currencyDelimiter');

    this.currencyObj = {
      prefix: this.selectedCurrencySymbol,
      allowNegative: false,
      allowZero: false,
      decimal: '.',
      precision: 0,
      thousands: currencyDelimiter,
      suffix: ' ',
      nullable: true,
      align: 'left',
    };
    log.debug("Currencyy object-quotation report:", this.currencyObj)
  }

  formatCurrency(value: number, prefix: string, delimiter: string): string {
    // No decimals, just thousands
    let parts = value.toFixed(0).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, delimiter);
    return `${prefix}${parts.join('')}`;
  }

  get premiumComputationResponse() {
    return this._premiumComputationResponse
  }

  // Add this getter to expose productLevelPremiums safely
  get productLevelPremiums() {
    return this._premiumComputationResponse?.productLevelPremiums || [];
  }


  ngAfterViewInit() {
    log.debug('PDF content:', this.pdfContent.nativeElement.innerHTML);
  }

  private updateHeaderFromDetails(): void {
    const details = this.quotationDetails;
    console.log('quotadddd', details);


    this.header = {
      quotationStatus: details.status,
      proposalIssued: details.dateCreated || 'N/A',
      period: this.formatPeriod(details.coverFrom, details.coverTo),
      quoteTime: this.formatDate(details.preparedDate),
      agencyName: details.agentName || '',
      logo: ''
    };
  }

  private formatPeriod(start: string | null, end: string | null): string {
    if (!start || !end) return '';
    return `${this.formatDate(start)} to ${this.formatDate(end)}`;
  }

  private formatDate(dateStr: string | null): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  private formatQuoteTime = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day} ${month} ${year} ${hours}:${minutes} ${ampm}`;
  };





  private encodeReference(ref: string): string {
    return btoa(ref)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }


  header: QuotationHeaderDTO = {
    quotationStatus: 'Draft',
    proposalIssued: 'NA',
    period: 'ffff',
    quoteTime: 'ffff',
    agencyName: 'N/A',
    logo: 'data:image/png;base64,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'
  };

  ngOnInit(): void {

    this.appConfigService.loadConfigurations(this.configLoader).then(() => {

    

    this.loadAllCurrencies()
    // log.debug('rregee', this.quotationDetails)

    const propertyIdCounter: { [key: string]: number } = {};

    this.enrichedProducts = this.premiumComputationResponse?.productLevelPremiums.map(product => {
      const enrichedRisks: EnrichedRisk[] = [];

      for (const risk of product.riskLevelPremiums) {
        const id = risk.propertyId;
        propertyIdCounter[id] = (propertyIdCounter[id] || 0) + 1;

        enrichedRisks.push({
          risk,
          count: propertyIdCounter[id],
        });
      }

      return {
        description: product.description,
        code: product.code,
        enrichedRisks
      };
    });

    this.paymentAdviceData = {
      paymentMethods: this.appConfigService.paymentMethods,
      footerInfo: this.appConfigService.footerInfo
    };
    this.cdr.detectChanges();

    log.debug(this.enrichedProducts)

    log.debug(this.paymentAdviceData)
  });
}

  
  ngOnDestroy(): void {
  }



  //quick-quote report
  IPREF: string = ''
  // enrichedProducts: EnrichedProduct[] = [];
  displayRows: DisplayRow[] = [];
  async generatePdf(download = false, fileName = 'document.pdf'): Promise<Blob | void> {

    if (
      !this.paymentAdviceData?.paymentMethods?.length ||
      !this.paymentAdviceData?.footerInfo?.length
    ) {
      console.warn('Missing paymentAdviceData. Cannot generate PDF.');
      return;
    }



    const riskContents: any = this.enrichedProducts.flatMap((product, productIndex) => {
      const risks: any = product.enrichedRisks.flatMap(enriched => {
        const coverageContent: any = !enriched.risk.selectCoverType
          ? (() => {
            //  (multiple covers)
            const coverChunks = [];
            for (let i = 0; i < enriched.risk.coverTypeDetails.length; i += 4) {
              coverChunks.push(enriched.risk.coverTypeDetails.slice(i, i + 4));
            }

            return coverChunks.map(chunk => {
              const rows = [];
              for (let i = 0; i < chunk.length; i += 2) {
                const rowItems = chunk.slice(i, i + 2);
                rows.push({
                  columns: rowItems.map(cover => ({
                    width: '50%',
                    table: {
                      widths: ['100%'],
                      heights: [200],
                      body: [
                        [
                          {
                            border: [true, true, true, true],
                            stack: [
                              {
                                text: cover.coverTypeDescription,
                                color: '#0d6efd',
                                bold: true,
                                alignment: 'center',
                                margin: [0, 0, 0, 8]
                              },
                              {
                                columns: [
                                  { width: '30%', text: 'Clauses', bold: true },
                                  {
                                    width: '*',
                                    stack: cover.clauses.map(c => ({
                                      text: c.heading,
                                      fontSize: 9,
                                      color: 'gray',
                                      margin: [0, 0, 0, 2]
                                    }))
                                  }
                                ],
                                margin: [0, 4, 0, 0]
                              },
                              {
                                columns: [
                                  { width: '30%', text: 'Limits of Liability', bold: true },
                                  {
                                    width: '*',
                                    stack: cover.limitOfLiabilities.map(l => ({
                                      text: l.narration,
                                      fontSize: 9,
                                      color: 'gray',
                                      margin: [0, 0, 0, 2]
                                    }))
                                  }
                                ],
                                margin: [0, 8, 0, 0]
                              },
                              {
                                columns: [
                                  { width: '30%', text: 'Excess applicable', bold: true },
                                  {
                                    width: '*',
                                    stack: cover.excesses.map(e => ({
                                      text: e.narration,
                                      fontSize: 9,
                                      color: 'gray',
                                      margin: [0, 0, 0, 2]
                                    }))
                                  }
                                ],
                                margin: [0, 8, 0, 0]
                              }
                            ],
                            margin: [0, 0, 0, 0]
                          }
                        ]
                      ]
                    },
                    layout: {
                      hLineWidth: () => 1,
                      vLineWidth: () => 1,
                      hLineColor: () => '#0d6efd',
                      vLineColor: () => '#0d6efd'
                    },
                    margin: [0, 0, 0, 0]
                  })),
                  columnGap: 0,
                  margin: [0, 0, 0, 0]
                });
              }
              return rows;
            }).flat();
          })()
          : (() => {
            //  selectCoverType structure
            const cover = enriched.risk.selectCoverType;

            return [{
              table: {
                widths: ['100%'],
                heights: [200],
                body: [
                  [
                    {
                      border: [true, true, true, true],
                      stack: [
                        {
                          text: cover.coverTypeDescription,
                          color: '#0d6efd',
                          bold: true,
                          alignment: 'center',
                          margin: [0, 0, 0, 8]
                        },
                        // Premium Information
                        {
                          columns: [
                            { width: '30%', text: 'Premium', bold: true },
                            {
                              width: '*',
                              text: this.formatCurrency(cover.computedPremium, this.currencyObj.prefix, this.currencyObj.thousands || '0'),
                              fontSize: 11,
                              color: 'gray'
                            }
                          ],
                          margin: [0, 4, 0, 0]
                        },
                        // Clauses section
                        {
                          columns: [
                            { width: '30%', text: 'Clauses', bold: true },
                            {
                              width: '*',
                              stack: cover.clauses ? cover.clauses.map(c => ({
                                text: c.heading,
                                fontSize: 9,
                                color: 'gray',
                                margin: [0, 0, 0, 2]
                              })) : [{ text: 'No clauses available', fontSize: 9, color: 'gray' }]
                            }
                          ],
                          margin: [0, 8, 0, 0]
                        },
                        // Limits of Liability section
                        {
                          columns: [
                            { width: '30%', text: 'Limits of Liability', bold: true },
                            {
                              width: '*',
                              stack: cover.limitOfLiabilities ? cover.limitOfLiabilities.map(l => ({
                                text: l.narration,
                                fontSize: 9,
                                color: 'gray',
                                margin: [0, 0, 0, 2]
                              })) : [{ text: 'No limits available', fontSize: 9, color: 'gray' }]
                            }
                          ],
                          margin: [0, 8, 0, 0]
                        },
                        // Excesses section
                        {
                          columns: [
                            { width: '30%', text: 'Excess applicable', bold: true },
                            {
                              width: '*',
                              stack: cover.excesses ? cover.excesses.map(e => ({
                                text: e.narration,
                                fontSize: 9,
                                color: 'gray',
                                margin: [0, 0, 0, 2]
                              })) : [{ text: 'No excess applicable', fontSize: 9, color: 'gray' }]
                            }
                          ],
                          margin: [0, 8, 0, 0]
                        },
                        // Additional Benefits section (if exists)
                        ...(cover.additionalBenefits && cover.additionalBenefits.length > 0 ? [{
                          columns: [
                            { width: '30%', text: 'Additional Benefits', bold: true },
                            {
                              width: '*',
                              stack: cover.additionalBenefits.map(b => ({
                                text: b.sectionDescription || 'Additional Benefit',
                                fontSize: 9,
                                color: 'gray',
                                margin: [0, 0, 0, 2]
                              }))
                            }
                          ],
                          margin: [0, 8, 0, 0]
                        }] : [])
                      ],
                      margin: [0, 0, 0, 0]
                    }
                  ]
                ]
              },
              layout: {
                hLineWidth: () => 1,
                vLineWidth: () => 1,
                hLineColor: () => '#0d6efd',
                vLineColor: () => '#0d6efd'
              },
              margin: [0, 10, 0, 10]
            }];
          })();

        return [
          {
            columns: [
              { text: `${product.description} ${enriched.risk.propertyId}`, style: 'riskTitle', width: '*' },
              {
                width: 'auto',
                text: [
                  { text: 'Use of Property: ', style: 'label' },
                  { text: `${enriched.risk.propertyDescription || enriched.risk.propertyId} `, bold: true },
                  { text: '    ' }
                ]
              },
              {
                width: 'auto',
                text: [
                  { text: 'Value: ', style: 'label' },
                  {
                    text: this.formatCurrency(
                      enriched.risk.sumInsured,
                      this.currencyObj.prefix,
                      this.currencyObj.thousands
                    ),
                    style: 'boldText'
                  }
                ]
              }
            ],
            margin: [5, 10, 5, 5]
          },
          ...coverageContent
        ];
      });

      return [
        // product title 
        {
          text: product.description,
          style: 'sectionHeader',
          margin: [5, 10, 0, 5],
          ...(productIndex > 0 && { pageBreak: 'before' })
        },
        {
          table: {
            widths: ['*'],
            body: [
              [
                {
                  stack: risks,
                  margin: [5, 5, 5, 5]
                }
              ]
            ]
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#0d6efd',
            vLineColor: () => '#0d6efd',
          },
          margin: [0, 0, 0, 10]
        }
      ];

    });

    const docDefinition: TDocumentDefinitions = {
      content: [
        {
          columns: [
            { image: this.header.logo, width: 100 },
            { text: 'QUOTATION REPORT', style: 'header', alignment: 'center', margin: [0, 30, 0, 0] }
          ]
        },
        { text: '\n' },
        {
          style: 'infoTable',
          table: {
            widths: ['auto', '*'],
            body: [
              ['Quotation status', 'Draft'],

            ]
          },
          layout: {
            fillColor: (rowIndex) => (rowIndex % 2 === 0 ? '#f3f3f3' : null),
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            hLineColor: () => '#aaa',
            vLineColor: () => '#aaa',
          }
        },
        { text: '\n' },

        ...riskContents
      ],

      footer: (currentPage, pageCount) => {
        const footerLines = this.paymentAdviceData.footerInfo || [];

        return {
          margin: [40, 10, 40, 10],
          layout: 'noBorders',
          table: {
            widths: ['*'],
            body: [
              // Each line of footerInfo
              ...footerLines.map(line => [
                {
                  text: line,
                  fontSize: 9,
                  alignment: 'center',
                  color: 'gray'
                }
              ]),
              // Page number
              [
                {
                  text: `Page ${currentPage} of ${pageCount}`,
                  fontSize: 9,
                  alignment: 'center',
                  margin: [0, 5, 0, 0]
                }
              ]
            ]
          }
        };
      },

      styles: {
        header: { fontSize: 22, bold: true },
        infoTable: { margin: [0, 0, 0, 10], fontSize: 12 },
        sectionHeader: { fontSize: 16, bold: true, color: '#0d6efd' },
        riskTitle: { fontSize: 14, bold: true, color: '#343a40' },
        label: { fontSize: 11, color: '#6c757d' }
      },

      defaultStyle: {

      }
    };

    if (download) {
      pdfMake.createPdf(docDefinition).download(fileName);
      return;
    } else {
      return new Promise<Blob>((resolve, reject) => {
        pdfMake.createPdf(docDefinition).getBlob(blob => {
          resolve(blob);
        });
      });
    }
  }

  // //payment adive
  // paymentAdviceData1: PaymentAdviceDTO = {
  //   paymentMethods: [
  //     {
  //       title: 'Cheque',
  //       details: ['Paybill: 123456', 'Account: Your name', 'Drop off: Lavington Chalbi drive']
  //     },
  //     {
  //       title: 'Mpesa',
  //       details: [
  //         'Paybill: 987654',
  //         'Account: Your Name',
  //         'Mobile number: +254712345678',
  //       ]
  //     },
  //     {
  //       title: 'Bank transfer',
  //       details: [
  //         'Bank: ABSA Bank Kenya',
  //         'Account name: TurnQuest Insurance Ltd',
  //         'Account Number: 12345658',
  //         'Branch: Westlands',
  //         'Swift code: ABSAKENX'
  //       ]
  //     },
  //     {
  //       title: 'Airtel money',
  //       details: ['Business name: TurnQuest Insurance Ltd', 'Reference: Your name']
  //     }
  //   ],

  //   footerInfo: [
  //     'Registered Office: Leadway Assurance House NN 28/29 Constitution Road P.O.Box 458, Kaduna',
  //   ]
  // };


  //Summary screen report
  iprefNo = 'fff'
  async generatePdfSelectCover(download = false, fileName = 'document.pdf'): Promise<void> {
    const productLevelPremiums = this.selectedCovers?.productLevelPremiums || [];

    // Header content with logo and info table
    const headerContent: any[] = [
      {
        columns: [
          { image: this.header.logo, width: 100 },
          { text: 'QUOTATION REPORT', style: 'header', alignment: 'center', margin: [0, 30, 0, 0] }
        ]
      },
      { text: '\n' },
      {
        style: 'infoTable',
        table: {
          widths: ['auto', '*'],
          body: [
            ['Quotation status', this.quotationDetails.status],
            ['Period', this.formatPeriod(this.quotationDetails.coverFrom, this.quotationDetails.coverTo),],
            ['Quote time', this.formatQuoteTime(new Date())],
            ['Expiry Date', this.formatDate(this.quotationDetails.expiryDate)],
            ['Agency Name', 'N/A'],

          ]
        },

        layout: {
          fillColor: (rowIndex) => (rowIndex % 2 === 0 ? '#f3f3f3' : null),
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => '#aaa',
          vLineColor: () => '#aaa',
        }
      },
      { text: '\n' }
    ];

    // All products content
    const allProductsContent: any[] = [];

    for (let productIndex = 0; productIndex < productLevelPremiums.length; productIndex++) {
      const product = productLevelPremiums[productIndex];

      // Product content with blue border
      const productContent: any[] = [
        { text: `Product: ${product.description} (${product.code})`, style: 'riskTitle', margin: [0, 0, 0, 10] },

        {
          canvas: [
            {
              type: 'line',
              x1: 0, y1: 0,
              x2: 515, y2: 0,
              lineWidth: 1,
              lineColor: '#0d6efd'
            }
          ],
          margin: [0, 0, 0, 15]
        }
      ];

      const risks = product.riskLevelPremiums || [];
      const coverTypesContent: any[] = [];

      for (const risk of risks) {
        const selectCoverType = risk.selectCoverType;

        if (selectCoverType) {
          const coverTypeContent: any[] = [
            {
              text: `Cover Type: ${selectCoverType.coverTypeDescription}`,
              style: 'riskTitle',
              margin: [0, 0, 0, 10]
            }
          ];

          // Additional Benefits
          if (selectCoverType.additionalBenefits?.length > 0) {
            coverTypeContent.push({
              text: 'Additional Benefits:',
              style: 'sectionHeader',
              margin: [0, 5, 0, 5]
            });

            const benefitsList = selectCoverType.additionalBenefits.map((benefit, i) =>
              `${String.fromCharCode(97 + i)}) ${benefit.sectionDescription}`
            ).join('\n');

            coverTypeContent.push({ text: benefitsList, margin: [0, 0, 0, 10] });
          }

          // Excesses
          if (selectCoverType.excesses?.length > 0) {
            coverTypeContent.push({
              text: 'Excesses:',
              style: 'sectionHeader',
              margin: [0, 5, 0, 5]
            });

            const excessesList = selectCoverType.excesses.map((excess, i) =>
              `${String.fromCharCode(97 + i)}) ${excess.narration}`
            ).join('\n');

            coverTypeContent.push({ text: excessesList, margin: [0, 0, 0, 10] });
          }

          // Limits of Liability
          if (selectCoverType.limitOfLiabilities?.length > 0) {
            coverTypeContent.push({
              text: 'Limits of Liability:',
              style: 'sectionHeader',
              margin: [0, 5, 0, 5]
            });

            const liabilitiesList = selectCoverType.limitOfLiabilities.map((limit, i) =>
              `${String.fromCharCode(97 + i)}) ${limit.narration}`
            ).join('\n');

            coverTypeContent.push({ text: liabilitiesList, margin: [0, 0, 0, 10] });
          }

          // Clauses
          if (selectCoverType.clauses?.length > 0) {
            coverTypeContent.push({
              text: 'Clauses:',
              style: 'sectionHeader',
              margin: [0, 5, 0, 5]
            });

            for (const clause of selectCoverType.clauses) {
              coverTypeContent.push({
                text: clause.wording,
                margin: [0, 0, 0, 15],
                style: 'clauseText'
              });
            }
          }

          //risk title 
          coverTypesContent.push({
            columns: [

              {
                text: `${risk.propertyId || risk.propertyDescription}`,
                width: 'auto',
                style: 'riskTitle'
              },

              {
                text: '',
                width: '*'
              },

              {
                text: `Premium: ${this.formatCurrency(selectCoverType.computedPremium, this.currencyObj.prefix,
                  this.currencyObj.thousands) || ''}`

              },

              {
                text: '',
                width: '*'
              },

              {
                text: this.formatCurrency(risk.sumInsured, this.currencyObj.prefix, this.currencyObj.thousands),
                width: 'auto',
                style: 'riskTitle',
                alignment: 'right'
              }

            ],
            margin: [0, 15, 0, 5]
          });

          coverTypesContent.push({
            table: {
              widths: ['*'],
              body: [[{ stack: coverTypeContent }]]
            },
            layout: {
              hLineWidth: () => 0.75,
              vLineWidth: (i) => 0.75,
              hLineColor: () => '#0d6efd',
              vLineColor: () => '#0d6efd',
              paddingTop: () => 12,
              paddingBottom: () => 12,
              paddingLeft: () => 15,
              paddingRight: () => 15
            },
            margin: [0, 0, 0, 15]
          });
        }
      }

      productContent.push(...coverTypesContent);

      allProductsContent.push({
        table: {
          widths: ['*'],
          body: [[{
            stack: productContent
          }]]
        },
        layout: {
          hLineWidth: () => 1.5,
          vLineWidth: () => 1.5,
          hLineColor: () => '#0d6efd',
          vLineColor: () => '#0d6efd',
          paddingTop: () => 15,
          paddingBottom: () => 15,
          paddingLeft: () => 15,
          paddingRight: () => 15
        },
        margin: [0, 0, 0, 20]
      });

      if (productIndex < productLevelPremiums.length - 1) {
        allProductsContent.push({ text: '', pageBreak: 'after' });
      }
    }

    // Payment Methods Section
    const paymentMethodsSection = {
      table: {
        widths: ['*'],
        body: [[{
          stack: [
            { text: 'Payment methods', style: 'sectionHeader', margin: [0, 20, 0, 10] },
            {
              columns: this.paymentAdviceData?.paymentMethods?.map(method => ({
                width: '*',
                stack: [
                  { text: method.title, bold: true, margin: [0, 0, 0, 5] },
                  ...method.details.map(detail => ({ text: detail, margin: [0, 0, 0, 2] }))
                ]
              })) || [],
              columnGap: 20,
              margin: [10, 0, 10, 15]
            },
            {
              text: [
                { text: 'Click here to pay', link: this.paymentLink, color: '#0d6efd', decoration: 'underline' }
              ],
              alignment: 'center',
              margin: [0, 10, 0, 20]
            }
          ]
        }]]
      },
      layout: {
        hLineWidth: () => 1,
        vLineWidth: () => 1,
        hLineColor: () => '#0d6efd',
        vLineColor: () => '#0d6efd',
        paddingTop: () => 10,
        paddingBottom: () => 10,
        paddingLeft: () => 15,
        paddingRight: () => 15
      },
      margin: [0, 10, 0, 10]
    };

    const fullContent = [
      ...headerContent,
      { text: 'Covers Selected', style: 'sectionHeader', margin: [0, 0, 0, 20], color: 'black' },
      ...allProductsContent,
      paymentMethodsSection
    ];


    
    const docDefinition: any = {
      content: fullContent,

      footer: function (currentPage, pageCount) {
        return {
          text: this.paymentAdviceData?.footerInfo?.join(' | ') || 'Footer Information',
          fontSize: 9,
          alignment: 'center',
          margin: [40, 10, 40, 10]
        };
      }.bind(this),

      styles: {
        header: { fontSize: 22, bold: true },
        infoTable: { margin: [0, 0, 0, 10], fontSize: 12 },
        sectionHeader: { fontSize: 16, bold: true, color: '#0d6efd' },
        riskTitle: { fontSize: 14, bold: true, color: '#343a40' },
        label: { fontSize: 11, color: '#6c757d' },
        clauseText: { fontSize: 10, alignment: 'justify' }
      },

      pageOrientation: 'portrait',
      pageSize: 'A4',
      pageMargins: [40, 40, 40, 60]
    };

    const pdf = pdfMake.createPdf(docDefinition);

    if (download) {
      await pdf.download(fileName);
    } else {
      pdf.open();
    }
  }

  get paymentLink(): string {
    const encodedRef = btoa(this.quotationDetails.ipayReferenceNumber);

    const urlTree = this.router.createUrlTree(
      ['/home/gis/quotation/payment-checkout', encodedRef]
    );

    return `${location.origin}${this.router.serializeUrl(urlTree)}`;
  }




}
function ngOnDestroy() {
  throw new Error('Function not implemented.');
}

