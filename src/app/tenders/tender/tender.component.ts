import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { TenderService } from 'app/services/tender.service';
import { Tender } from 'app/types/tender.types';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-tender',
  templateUrl: './tender.component.html',
  styleUrls: ['./tender.component.scss']
})
export class TenderComponent implements OnInit {

  tender: Tender;
  user: User;
  activeLang: string;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _tenderService: TenderService,
    private _userService: UserService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _activatedRoute: ActivatedRoute,
    private _translocoService: TranslocoService
  ) {

  }

  ngOnInit(): void {

    this._userService.user$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user: User) => {
        this.user = user;
        this._changeDetectorRef.markForCheck();
      });

    this._translocoService.langChanges$.subscribe((activeLang) => {
      this.activeLang = activeLang;
    });

    this._tenderService.tender$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((tender: Tender) => {
        this.tender = tender;
        this._changeDetectorRef.markForCheck();
      });

    this._activatedRoute.paramMap.subscribe((params) => {
      this._tenderService.getTenderById(params.get("id")).subscribe();
      window.scrollTo(0, 0);
    });
  }
}
