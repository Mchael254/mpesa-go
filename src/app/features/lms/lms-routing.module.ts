import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuotationListComponent } from './ind/components/quotation/components/quotation-list/quotation-list.component';
import { AuthGuard } from 'src/app/shared/services/guard/auth-guard.service';

const routes: Routes = [
  {
    path: 'quotation',
    children: [{ path: 'list', component: QuotationListComponent }],
  },

  {
    path: 'ind',
    children: [
      {
        path: 'quotation',
        loadChildren: () =>
          import('./ind/components/quotation/quotation.module').then(
            (m) => m.QuotationModule
          ),
      },
      {
        path: 'proposal',
        loadChildren: () =>
          import('./ind/components/proposal/proposal.module').then(
            (m) => m.ProposalModule
          ),
      },
      {
        path: 'policy',
        loadChildren: () =>
          import('./ind/components/policy/policy.module').then(
            (m) => m.PolicyModule
          ),
      },
      {
        path: 'claim',
        loadChildren: () =>
          import('./ind/components/claims/claims.module').then(
            (m) => m.ClaimsModule
          ),
      },
    ],
  },

  {
    path: 'grp',
    children: [
      {
        path: 'quotation',
        loadChildren: () =>
          import('./grp/components/quotation/quotation.module').then(
            (m) => m.QuotationModule
          ),
      },
    ],
  },

  {
    path: 'need-analysis',
    loadChildren: () =>
      import('./ind/components/need-analysis/need-analysis.module').then(
        (m) => m.NeedAnalysisModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LmsRoutingModule {}
