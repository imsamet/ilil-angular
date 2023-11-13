import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TechnocityService } from 'app/services/technocity.service';
import { Technocity } from 'app/types/technocity.types';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-technocity-details',
  templateUrl: './technocity-details.component.html',
  styleUrls: ['./technocity-details.component.scss']
})
export class TechnocityDetailsComponent implements OnInit {

  technocity: Technocity;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _technocityService: TechnocityService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {

  }

  ngOnInit(): void {
    this._technocityService.technocity$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((technocity: Technocity) => {
        this.technocity = technocity;
        this._changeDetectorRef.markForCheck();
      });
  }

}
