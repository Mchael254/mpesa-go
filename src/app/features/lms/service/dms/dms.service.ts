import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs/internal/observable/of';
import { map } from 'rxjs/internal/operators/map';
import {ApiService} from "../../../../shared/services/api/api.service";
import {API_CONFIG} from "../../../../../environments/api_service_config";


@Injectable({
  providedIn: 'root'
})
export class DmsService {
  DMS_BASE_URL = 'documents';
  constructor(private api:ApiService, private http: HttpClient) {}

  getClientDocumentById(code: number){
    return this.api.GET(`${this.DMS_BASE_URL}?page=0&size=5&owner_type=CLIENT&owner_code=${code}`, API_CONFIG.IND_MARKETING_SERVICE_BASE_URL);
  }

  saveClientDocument(code: any, file_name: string, formData: any, uploadType: string = 'QUOTATION', ownerType='CLIENT') {
    const url = `${this.DMS_BASE_URL}/upload?type=${file_name}&owner_type=${ownerType}&owner_code=${code}&module_upload_type=${uploadType}`;
    return this.api.FILEUPLOAD(url, formData as FormData, API_CONFIG.IND_MARKETING_SERVICE_BASE_URL);
  }

  downloadFileById(url: string) {
    console.log(url);

    return this.api.GET(url.replace('https://mutual-uat.turnkeyafrica.com/alfrescoServices/', ''), API_CONFIG.DMS_SERVICE).pipe(map((data) => of(this.downloadFile(data['byteData'], `${data['docName']}`))))

    // return this.http.get(url).pipe(map((data) => of(this.downloadFile(data['byteData'], `${data['docName']}`))))
  }

  deleteDocumentById(code: string){
    return this.api.DELETE(`${this.DMS_BASE_URL}/${code}`,  API_CONFIG.IND_MARKETING_SERVICE_BASE_URL);
  }

  downloadFile(base64Data: string, fileName: string) {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/octet-stream' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.style.display = 'none';

    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
