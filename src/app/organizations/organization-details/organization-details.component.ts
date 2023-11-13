import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { OrganizationService } from 'app/services/organization.service';
import { Organization } from 'app/types/organization.types';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-organization-details',
  templateUrl: './organization-details.component.html',
  styleUrls: ['./organization-details.component.scss']
})
export class OrganizationDetailsComponent implements OnInit {

  organization: Organization;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  activeLang: string;

  constructor(
    private _organizationService: OrganizationService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _translocoService: TranslocoService,
  ) {

  }

  ngOnInit(): void {
    this._organizationService.organization$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((organization: Organization) => {
        this.organization = organization;
        this._changeDetectorRef.markForCheck();
      });

    this._translocoService.langChanges$.subscribe((activeLang) => {
      this.activeLang = activeLang;
    });
  }
}
