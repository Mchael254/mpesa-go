import { ChangeDetectorRef, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Logger } from '../../services';
import { AgentDTO } from 'src/app/features/entities/data/AgentDTO';
import { Router } from '@angular/router';
import { QuotationsService } from '../../../features/gis/components/quotation/services/quotations/quotations.service';
import { GlobalMessagingService } from '../../services/messaging/global-messaging.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { untilDestroyed } from '../../shared.module';
import { Table } from 'primeng/table';
import { IntermediaryService } from '../../../features/entities/services/intermediary/intermediary.service';
import { AgentDto, AgentResponseDto } from 'src/app/features/gis/data/quotations-dto';


const log = new Logger('agentSearchComponent');

@Component({
  selector: 'app-agent-search-modal',
  templateUrl: './agent-search-modal.component.html',
  styleUrls: ['./agent-search-modal.component.css'],
  standalone: false,
})

export class AgentSearchModalComponent {
  @ViewChild('agentTable') agentTable!: Table;
  @ViewChild('closebutton') closebutton;
  @Output() agentSelected = new EventEmitter<{ agentName: string; agentId: number }>();

  agentName: string;
  agentId: number;
  agents: AgentDto[] = [];
  agentResponse: AgentResponseDto;
  selectedAgent: AgentDto | null = null;
  searchTerm: string = '';
  searchIdTerm: string = '';
  originalAgents: AgentDto[] = [];

  // Client-side pagination properties
  rows: number = 10;


  constructor(
    private router: Router,
    public quotationService: QuotationsService,
    public globalMessagingService: GlobalMessagingService,
    public cdr: ChangeDetectorRef,
    private intermediaryService: IntermediaryService,
    private spinner: NgxSpinnerService,
  ) { }


  ngOnDestroy(): void { }

  onModalOpen(): void {
    this.selectedAgent = null;
    this.searchTerm = '';
    this.searchIdTerm = '';
    
    if (this.agents.length === 0) {
      this.loadAgents(0, 100);
    } else {
      // Reset to original agents if we have them
      this.agents = [...this.originalAgents];
      // Clear any existing filters
      if (this.agentTable) {
        this.agentTable.clear();
      }
      this.cdr.detectChanges();
    }
  }

  inputAgentName(event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm = value;
    
    if (!value || value.trim().length === 0) {
      if (this.originalAgents.length > 0) {
        this.agents = [...this.originalAgents];
        this.cdr.detectChanges();
      }
 
      if (this.agentTable) {
        this.agentTable.clear();
      }
      return;
    }
    
    if (this.agentTable) {
      this.agentTable.filterGlobal(value, 'contains');
    }
  }

  onAgentNameEnter(event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm = value;
    
    if (value && value.trim().length > 0) {
      // Perform database search when user hits Enter
      this.searchAgentsFromDatabase('name', value.trim());
    } else {
      // If search term is empty, reload original agents
      this.agents = [...this.originalAgents];
      this.cdr.detectChanges();
    }
  }

  inputAgentId(event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchIdTerm = value;
    
    if (!value || value.trim().length === 0) {
      if (this.originalAgents.length > 0) {
        this.agents = [...this.originalAgents];
        this.cdr.detectChanges();
      }
 
      if (this.agentTable) {
        this.agentTable.clear();
      }
      return;
    }
    
    if (this.agentTable) {
      this.agentTable.filterGlobal(value, 'contains');
    }
  }

  onAgentIdEnter(event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchIdTerm = value;
    
    if (value && value.trim().length > 0) {
      // Perform database search when user hits Enter
      this.searchAgentsFromDatabase('id', value.trim());
    } else {
      // If search term is empty, reload original agents
      this.agents = [...this.originalAgents];
      this.cdr.detectChanges();
    }
  }

  searchAgentsFromDatabase(searchField: string, searchTerm: string): void {
    this.spinner.show();
    this.intermediaryService
      .searchAgent(0, 100, searchField, searchTerm)
      .pipe(
        untilDestroyed(this)
      )
      .subscribe({
        next: (response: any) => {
          log.debug('Search agents response:', response);
          
          if (response && response.content) {
            this.agents = response.content.map(agent => ({
              id: agent.id,
              name: agent.name,
              shortDesc: agent.shortDesc,
              businessUnit: agent.businessUnit,
              primaryType: agent.primaryType,
              accountType: agent.accountType,
              ...agent
            }));
          } else {
            this.agents = [];
          }
          
          log.debug('Searched agents:', this.agents);
          this.spinner.hide();
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error searching agents:', error);
          this.globalMessagingService.displayErrorMessage('Error', 'Failed to search agents. Please try again.');
          this.agents = [];
          this.spinner.hide();
          this.cdr.detectChanges();
        }
      });
  }

  loadAgents(
    pageIndex: number = 0,
    pageSize: number = 100,
    sortField: string = 'createdDate',
    sortOrder: string = 'desc'
  ): void {
    this.spinner.show();
    this.intermediaryService
      .getAgents(pageIndex, pageSize, sortField, sortOrder)
      .pipe(
        untilDestroyed(this)
      )
      .subscribe({
        next: (response: AgentResponseDto) => {
          log.debug('Agents response:', response);

          this.agentResponse = response;
          this.agents = response.content || [];
          
          // Store original agents list for hybrid search
          if (this.originalAgents.length === 0) {
            this.originalAgents = [...this.agents];
          }

          log.debug('Loaded agents:', this.agents);
          this.spinner.hide();
        },
        error: (error) => {
          console.error('Error loading agents:', error);
          this.globalMessagingService.displayErrorMessage('Error', 'Failed to load agents. Please try again.');
          this.agents = [];
          this.spinner.hide();
        }
      });
  }


  saveSelectedAgent() {
    this.agentId = Number(this.selectedAgent.id);
    this.agentName = this.selectedAgent.name;
    sessionStorage.setItem('agentId', JSON.stringify(this.agentId));

    this.agentSelected.emit({
      agentName: this.agentName,
      agentId: this.agentId,
    });
    this.closebutton.nativeElement.click();
  }

  cancel() {
    this.selectedAgent = null;

  }


  applyGlobalFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.agentTable) {
      this.agentTable.filterGlobal(filterValue, 'contains');
    }
  }


}
