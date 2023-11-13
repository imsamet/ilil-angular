import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { ApiService } from 'app/services/api.service';
import { CvService } from 'app/services/cv.service';
import { Cv } from 'app/types/cv.types';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-cvs',
  templateUrl: './cvs.component.html',
  styleUrls: ['./cvs.component.scss']
})
export class CvsComponent implements OnInit {

  cvs: Cv[] = [];
  filteredCvs: Cv[] = [];
  categories: any[] = [];
  jobCategories: any[] = [];
  selectedCategoryIds: string[] = [];
  activeLang: string;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _cvService: CvService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _apiService: ApiService,
    private _translocoService: TranslocoService
  ) {

  }

  ngOnInit(): void {
    this._cvService.cvs$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((cvs: Cv[]) => {
        this.cvs = cvs;
        this.getCategories();
        this._changeDetectorRef.markForCheck();
      });

    this._translocoService.langChanges$.subscribe((activeLang) => {
      this.activeLang = activeLang;
    });
  }

  getCategories() {
    this._apiService.getCategories([]).subscribe((categories) => {
      this.categories = categories;
      this.jobCategories = this.categories.filter((el) => el.types.some((type) => ["Jobs"].includes(type)));
      this.jobCategories.forEach((el) => {
        el.selected = false;
      });
      this.updateAllComplete();
    })
  }

  updateAllComplete() {
    const selectedCategories = this.jobCategories.filter((el) => el.selected == true);
    this.selectedCategoryIds = selectedCategories.map((el) => el._id);
    if (this.selectedCategoryIds.length == 0) {
      this.filteredCvs = this.cvs;
    }
    else {
      this.filteredCvs = this.cvs.filter((project) => this.selectedCategoryIds.includes(project.category._id));
    }
  }

  clearFilters() {
    this.jobCategories.forEach((el) => {
      el.selected = false;
      this.updateAllComplete();
    });
  }


  getCount(categoryId: string): number {
    return this.cvs.filter((job) => job.category._id == categoryId).length;;
  }
}
