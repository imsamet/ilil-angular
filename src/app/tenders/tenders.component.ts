import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { ApiService } from 'app/services/api.service';
import { TenderService } from 'app/services/tender.service';
import { Tender } from 'app/types/tender.types';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-tenders',
  templateUrl: './tenders.component.html',
  styleUrls: ['./tenders.component.scss']
})
export class TendersComponent implements OnInit {

  tenders: Tender[] = [];
  filteredTenders: Tender[] = [];
  categories: any[] = [];
  tenderCategories: any[] = [];
  selectedCategoryIds: string[] = [];
  activeLang: string;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _tenderService: TenderService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _activatedRoute: ActivatedRoute,
    private _apiService: ApiService,
    private _translocoService: TranslocoService
  ) {

  }


  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe((query) => {
      this._tenderService.tenders$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((tenders: Tender[]) => {
          this.tenders = tenders;
          this.getCategories(query.category);
          this._changeDetectorRef.markForCheck();
        });
    })

    this._translocoService.langChanges$.subscribe((activeLang) => {
      this.activeLang = activeLang;
    });

  }


  getCategories(query: string) {
    this._apiService.getCategories([]).subscribe((categories) => {
      this.categories = categories;
      this.tenderCategories = this.categories.filter((el) => el.types.some((type) => ["Tenders"].includes(type)));
      this.tenderCategories.forEach((el) => {
        if (el._id == query) {
          el.selected = true;
        }
        else {
          el.selected = false;
        }
      });
      this.updateAllComplete();
    })
  }

  updateAllComplete() {
    const selectedCategories = this.tenderCategories.filter((el) => el.selected == true);
    this.selectedCategoryIds = selectedCategories.map((el) => el._id);
    if (this.selectedCategoryIds.length == 0) {
      this.filteredTenders = this.tenders;
    }
    else {
      this.filteredTenders = this.tenders.filter((tender) => this.selectedCategoryIds.includes(tender.category._id));
    }
  }

  clearFilters() {
    this.tenderCategories.forEach((el) => {
      el.selected = false;
      this.updateAllComplete()
    });
  }


  setBorders(index: number): string {
    if (index == 1) {
      return 'first';
    }
    else if (index == 2) {
      return 'second';
    }
    else if (index == (this.tenders.length - 1)) {
      return 'beforLast';
    }
    else if (index == this.tenders.length) {
      return 'last';
    }
  }


  getCount(categoryId: string): number {
    return this.tenders.filter((tender) => tender.category._id == categoryId).length;;
  }
}
