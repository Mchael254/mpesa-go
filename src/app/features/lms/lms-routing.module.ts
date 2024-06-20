import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuotationListComponent } from './components/quotation-list/quotation-list.component';
import { PolicyListComponent } from './components/policy-list/policy-list.component';
import { BaseComponent } from './base/base.component';

const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    children: [
      {
        path: '',
        redirectTo: 'quotation/list',
        pathMatch: 'full',
      },
      {
        path: 'quotation',
        children: [{ path: 'list', component: QuotationListComponent }],
      },
      {
        path: 'policy',
        children: [{ path: 'list', component: PolicyListComponent }],
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
            path: 'reinsurance',
            loadChildren: () =>
              import('./ind/components/reinsurance/reinsurance.module').then(
                (m) => m.ReinsuranceModule
              ),
          },
          {
            path: 'claims',
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
          {
            path: 'underwriting',
            loadChildren: () =>
              import('./grp/components/underwriting/underwriting.module').then(
                (m) => m.UnderwritingModule
              ),
          },
          {
            path: 'policy',
            loadChildren: () =>
              import('./grp/components/policy/policy.module').then(
                (m) => m.PolicyModule
              ),
          },
          {
            path: 'reinsurance',
            loadChildren: () =>
              import('./grp/components/reinsurance/reinsurance.module').then(
                (m) => m.ReinsuranceModule
              ),
          },
          {
            path: 'dashboard',
            loadChildren: () =>
              import('./grp/components/dashboard/dashboard.module').then(
                (m) => m.DashboardModule
              ),
          },
          {
            path: 'service-request',
            loadChildren: () =>
              import('./grp/components/service-request/service-request.module').then(
                (m) => m.ServiceRequestModule
              ),
          },
          {
            path: 'downloads',
            loadChildren: () =>
              import('./grp/components/downloads/downloads.module').then(
                (m) => m.DownloadsModule
              ),
          },
          {
            path: 'medicals',
            loadChildren: () =>
              import('./grp/components/medicals/medicals.module').then(
                (m) => m.MedicalsModule
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
      {
        path: 'medicals',
        loadChildren: () =>
          import('./ind/components/medicals/medicals.module').then(
            (m) => m.MedicalsModule
          ),
      },
      {
        path: 'policy',
        loadChildren: () =>
          import('./grp/components/policy/policy.module').then(
            (m) => m.PolicyModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LmsRoutingModule {}
