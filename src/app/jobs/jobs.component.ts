import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { ApiService } from 'app/services/api.service';
import { JobService } from 'app/services/job.service';
import { Job } from 'app/types/job.types';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {

  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  categories: any[] = [];
  jobCategories: any[] = [];
  selectedCategoryIds: string[] = [];
  activeLang: string;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _jobService: JobService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _apiService: ApiService,
    private _translocoService: TranslocoService
  ) {

  }

  ngOnInit(): void {
    this._jobService.jobs$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((jobs: Job[]) => {
        this.jobs = jobs;
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
      this.filteredJobs = this.jobs;
    }
    else {
      this.filteredJobs = this.jobs.filter((project) => this.selectedCategoryIds.includes(project.category._id));
    }
  }

  clearFilters() {
    this.jobCategories.forEach((el) => {
      el.selected = false;
      this.updateAllComplete();
    });
  }


  getCount(categoryId: string): number {
    return this.jobs.filter((job) => job.category._id == categoryId).length;;
  }

}
