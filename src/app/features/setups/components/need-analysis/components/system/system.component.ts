import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SESSION_KEY } from 'src/app/features/lms/util/session_storage_enum';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.css']
})
export class SystemComponent {

  constructor(private session_storage_service: SessionStorageService, private router: Router){}

  saveSystem(name: string, url:string){
    // this.session_storage_service.setItem(SESSION_KEY.NEED_ANALYSIS_SYSTEM_NAME, name);
    this.router.navigate([url])

  }

}
