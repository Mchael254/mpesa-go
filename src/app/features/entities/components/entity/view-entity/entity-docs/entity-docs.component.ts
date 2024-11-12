import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {PartyAccountsDetails} from "../../../../data/accountDTO";
import {Logger} from "../../../../../../shared/services";
import {untilDestroyed} from "../../../../../../shared/services/until-destroyed";
import {DmsService} from "../../../../../../shared/services/dms/dms.service";
import {DmsDocument, SingleDmsDocument} from "../../../../../../shared/data/common/dmsDocument";
import {ReqPartyById} from "../../../../data/entityDto";
import {AuthService} from "../../../../../../shared/services/auth.service";
import {GlobalMessagingService} from "../../../../../../shared/services/messaging/global-messaging.service";
import {take} from "rxjs/internal/operators/take";

const log = new Logger("EntityDocsComponent")
@Component({
  selector: 'app-entity-docs',
  templateUrl: './entity-docs.component.html',
  styleUrls: ['./entity-docs.component.css']
})

export class EntityDocsComponent implements OnInit {

  @Input('partyAccountDetails') partyAccountDetails: PartyAccountsDetails;
  @Input() entityPartyIdDetails: ReqPartyById;
  selectedOptions: any;

  documentPayload: any;

  selectedFile: File;
  viewAllDocs: DmsDocument[] = [];
  docsList: any[] = [];
  isLoading: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private dmsService: DmsService,
    private authService: AuthService,
    private globalMessagingService: GlobalMessagingService,
    ) {}

  ngOnInit(): void {
    this.selectedOptions = [
      {
        id: 1,
        actualName: 'Test 1'
      },
      {
        id: 2,
        actualName: 'Test 2'
      },
    ];
    this.fetchDocuments();
    log.info("acc", this.entityPartyIdDetails);
  }

  /**
   * Called when a file is selected in the file input element.
   * The selected file is converted to a Base64 string and stored in the `documentPayload` property.
   * The file is then uploaded to the server using the `uploadFile` method.
   */
  onFileSelected(event: Event): void {
    const assignee = this.authService.getCurrentUserName();
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        this.selectedFile = file;
        // Read the file as a data URL
        const reader = new FileReader();
        reader.onload = () => {
          // Convert the file to Base64 string
          const base64String = reader.result?.toString().split(',')[1];

          let payload: DmsDocument = {
            actualName: file.name,
            userName: assignee,
            docType: this.selectedFile.type,
            docData: base64String,
            originalFileName: file.name
          }
          switch (this.partyAccountDetails.partyType.partyTypeName) {
            case 'Agent':
              payload = { ...payload, agentName: this.entityPartyIdDetails?.name, agentCode: this.partyAccountDetails?.accountCode.toString() };
              break;
            case 'Client':
              payload = { ...payload, clientName: this.entityPartyIdDetails?.name, clientCode: this.partyAccountDetails?.accountCode.toString() };
              break;
            case 'Service Provider':
              payload = { ...payload, spName: this.entityPartyIdDetails?.name, spCode: this.partyAccountDetails?.accountCode. toString() };
              break;
          }

          this.documentPayload = payload;
          log.info("file upload payload", this.documentPayload);

          this.uploadFile();
        };
        // Read the file as data URL
        reader.readAsDataURL(file);
      }
    }
  }

  /**
   * Deletes a document that has already been uploaded to the server.
   *
   * Calls the DMS service to delete the document by its ID.
   * If successful, displays a success message and calls `fetchDocuments` to refresh the list of documents.
   * If there is an error, logs the error and still calls `fetchDocuments`.
   */
  deleteUploadedFile(doc: any) {
    this.dmsService.deleteDocumentById(doc.id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          this.globalMessagingService.displaySuccessMessage('Success', 'File deleted successfully!');
          log.info('Calling fetchDocuments...');
          this.fetchDocuments();
        },
        error: (error) => {
          log.error('Error during document deletion:', error);
          this.fetchDocuments();
        }
      });
  }

  /**
   * Uploads a file based on the party type selected.
   *
   * Based on the party type selected, it calls the corresponding DMS service to upload the file.
   * If the upload is successful, it displays a success message and fetches the documents again.
   * If there is an error during the upload, it displays an error message.
   */
  uploadFile() {
    switch (this.partyAccountDetails.partyType.partyTypeName) {

      case 'Agent':
        this.isLoading = true;
        this.dmsService.saveAgentDocs(this.documentPayload).pipe(untilDestroyed(this))
          .subscribe({
            next: (res) => {
              log.info("agent file uploaded", res);
              this.selectedFile = null;
              this.globalMessagingService.displaySuccessMessage('Success', 'File uploaded successfully!');
              this.isLoading = false;
              this.fetchDocuments();
            },
            error: (err) => {
              let errorMessage = err?.error?.message ?? err.message;
              this.globalMessagingService.displayErrorMessage('Error', errorMessage);
            }
        });
        // log.info('Agent');
        break;
      case 'Client':
        this.dmsService.saveClientDocs(this.documentPayload).pipe(untilDestroyed(this))
          .subscribe({
            next: (res) => {
              log.info("client file uploaded", res);
              this.selectedFile = null;
              this.globalMessagingService.displaySuccessMessage('Success', 'File uploaded successfully!');
              this.fetchDocuments();
            },
            error: (err) => {
              let errorMessage = err?.error?.message ?? err.message;
              this.globalMessagingService.displayErrorMessage('Error', errorMessage);
            }
          });
        // log.info('Client');
        break;
      case 'Service Provider':
        this.dmsService.saveServiceProviderDocs(this.documentPayload).pipe(untilDestroyed(this))
          .subscribe({
            next: (res) => {
              log.info("SP file uploaded", res);
              this.selectedFile = null;
              this.globalMessagingService.displaySuccessMessage('Success', 'File uploaded successfully!');
              this.fetchDocuments();
            },
            error: (err) => {
              let errorMessage = err?.error?.message ?? err.message;
              this.globalMessagingService.displayErrorMessage('Error', errorMessage);
            }
          });
        // log.info('ServiceProvider');
        break;
      case 'Staff':
        log.info('Staff');
        break;
      case 'Creditor':
        log.info('Creditor');
        break;
      case 'Debtoris':
        log.info('Debtoris');
        break;
      case 'Lead':
        log.info('Lead');
        break;
      default:
        log.warn('No party type selected');
    }
  }

  /**
   * Fetches documents for a given client code.
   *
   * @param clientCode client code
   *
   * @returns list of documents for the client
   */
  fetchClientDocs(clientCode: string) {
    this.dmsService.fetchDocumentsByClientCode(clientCode)
      .subscribe((data) => {
        /*data.forEach( doc => {
          const splitName = doc['actualName'].split('.');
          doc.format = splitName[1]?.toUpperCase();
        });*/
        this.viewAllDocs = data;
        this.cdr.detectChanges();

        log.info("client docs>>", this.viewAllDocs);
      });
  }

  /**
   * Fetches documents for a given agent code.
   * @param agentCode agent code
   */
  fetchAgentDocuments(agentCode: string) {
    this.dmsService.fetchDocumentsByAgentCode(agentCode)
      .pipe(untilDestroyed(this))
      .subscribe( data => {
          this.viewAllDocs = data;
          this.cdr.detectChanges();
        });
  }

  /**
   * Fetches documents for a given service provider code.
   * @param spCode service provider code
   */
  fetchServiceProvDocuments(spCode: string) {
    this.dmsService.fetchDocumentsByServiceProviderCode(spCode)
      .pipe(untilDestroyed(this))
      .subscribe( data => {
          this.viewAllDocs = data;
          this.cdr.detectChanges();
        });
  }

  /**
   * Fetches documents for the given party type. The party type is determined by the
   * `partyAccountDetails.partyType.partyTypeName` property and is used to call the
   * corresponding function to fetch the documents.
   */
  fetchDocuments() {
    switch (this.partyAccountDetails.partyType.partyTypeName) {

      case 'Agent':
        this.fetchAgentDocuments(this.partyAccountDetails?.accountCode.toString());
        break;

      case 'Client':
        this.fetchClientDocs(this.partyAccountDetails?.accountCode.toString());
        break;

      case 'Service Provider':
        this.fetchServiceProvDocuments(this.partyAccountDetails?.accountCode.toString());
        break;
    }
  }

  /**
   * Fetches documents for each document in the `viewAllDocs` array. The array is iterated and
   * `previewDocument` is called for each document, which fetches the document data and appends it to
   * the `docsList` array. The `openDocViewerModal` function is also called to display the document
   * viewer modal.
   */
  fetchSelectedDoc() {
    this.viewAllDocs.forEach(doc => {

      this.previewDocument(doc.id);
      this.openDocViewerModal();
    })

  }

  /**
   * Fetches a document by its ID from the DMS (Document Management System), and appends it to the
   * `docsList` array. The document is fetched using the `dmsService.getDocumentById(docId)` method,
   * and the observable is piped through `untilDestroyed(this)` to ensure that it is automatically
   * unsubscribed when the component is destroyed. The `take(1)` operator is used to take the first
   * emission from the observable and then unsubscribe. The `subscribe` method is used to subscribe
   * to the observable and handle the document data when it is received. The document data is
   * appended to the `docsList` array and the list is then updated using the `cdr.detectChanges()`
   * method.
   */
  previewDocument(docId){
    console.log('doc id', docId);
    this.dmsService.getDocumentById(docId)
      .pipe(
        untilDestroyed(this),
        take(1)
      )
      .subscribe((documentData: SingleDmsDocument) => {
        // this.selectedDocumentData = documentData;
        this.docsList.push({
          isBase64: documentData.byteData,
          base64String: documentData.byteData,
          fileName: documentData.docName,
          srcUrl: documentData.url,
          mimeType: documentData.docMimetype,
        })
        this.cdr.detectChanges();
        log.info('doc list', this.docsList);
      });
  }

  /**
   * Displays the document viewer modal.
   * The function adds the 'show' class to the modal and its backdrop, and sets their
   * display styles to 'block'. This makes the modal visible.
   */
  openDocViewerModal() {
    const modal = document.getElementById('docViewerToggle');
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
   * Hides the document viewer modal and resets the list of documents.
   * The function removes the 'show' class from the modal and its backdrop, and sets
   * their display styles to 'none'. It also empties the `docsList` array.
   */
  closeDocViewerModal() {
    const modal = document.getElementById('docViewerToggle');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        modalBackdrop.classList.remove('show');
      }
    }
    this.docsList= [];
  }

  ngOnDestroy(): void {
  }
}
