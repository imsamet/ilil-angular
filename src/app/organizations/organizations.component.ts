import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { OrganizationService } from 'app/services/organization.service';
import { Organization } from 'app/types/organization.types';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.scss']
})
export class OrganizationsComponent implements OnInit {

  organizations: Organization[];
  filteredOrganizations: Organization[] = [];
  activeLang: string;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _organizationService: OrganizationService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _translocoService: TranslocoService,
  ) { }


  ngOnInit(): void {
    this._organizationService.organizations$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((organizations: Organization[]) => {
        this.organizations = organizations;
        this.filteredOrganizations = this.organizations;
        this._changeDetectorRef.markForCheck();
      });

    this._translocoService.langChanges$.subscribe((activeLang) => {
      this.activeLang = activeLang;
    });
  }

  filterOrganizations(query: string): void {
    if (!query) {
      this.filteredOrganizations = this.organizations;
      return;
    }
    this.filteredOrganizations = this.organizations.filter(organization => organization.title.toLowerCase().includes(query.toLowerCase()));
  }
}
