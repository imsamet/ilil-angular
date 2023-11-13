import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CvService } from 'app/services/cv.service';
import { Cv } from 'app/types/cv.types';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { TranslocoService } from '@ngneat/transloco';


@Component({
  selector: 'app-cv-details',
  templateUrl: './cv-details.component.html',
  styleUrls: ['./cv-details.component.scss']
})
export class CvDetailsComponent implements OnInit {

  cv: Cv;
  user: User;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  activeLang: string;

  constructor(
    private _cvService: CvService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _userServecies: UserService,
    private _translocoService: TranslocoService
  ) {

  }

  ngOnInit(): void {
    this.getUser()
    this._cvService.cv$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((cv: Cv) => {
        this.cv = cv;
        this._changeDetectorRef.markForCheck();
      });

    this._translocoService.langChanges$.subscribe((activeLang) => {
      this.activeLang = activeLang;
    });
  }

  getUser() {
    this._userServecies.user$.subscribe((user) => {
      this.user = user;
    });
  }

}
