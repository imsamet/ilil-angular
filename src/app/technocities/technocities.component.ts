import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TechnocityService } from 'app/services/technocity.service';
import { Technocity } from 'app/types/technocity.types';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-technocities',
  templateUrl: './technocities.component.html',
  styleUrls: ['./technocities.component.scss']
})
export class TechnocitiesComponent implements OnInit {

  technocities: Technocity[];
  filteredTechnocities: Technocity[] = [];

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _technocityService: TechnocityService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }


  ngOnInit(): void {
    this._technocityService.technocities$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((technocities: Technocity[]) => {
        this.technocities = technocities;
        this.filteredTechnocities = this.technocities;
        this._changeDetectorRef.markForCheck();
      });
  }

  filterTechnocities(query: string): void {
    if (!query) {
      this.filteredTechnocities = this.technocities;
      return;
    }
    this.filteredTechnocities = this.technocities.filter(organization => organization.title.toLowerCase().includes(query.toLowerCase()));
  }

}
