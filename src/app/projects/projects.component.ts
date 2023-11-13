import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { ApiService } from 'app/services/api.service';
import { ProjectService } from 'app/services/project.service';
import { Project } from 'app/types/project.types';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  projects: Project[] = [];
  filteredProjects: Project[] = [];
  categories: any[] = [];
  projectCategories: any[] = [];
  selectedCategoryIds: string[] = [];
  activeLang: string;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _projectService: ProjectService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _activatedRoute: ActivatedRoute,
    private _apiService: ApiService,
    private _translocoService: TranslocoService
  ) {

  }

  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe((query) => {
      this._projectService.projects$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((projects: Project[]) => {
          this.projects = projects;
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
      this.projectCategories = this.categories.filter((el) => el.types.some((type) => ["Projects"].includes(type)));
      this.projectCategories.forEach((el) => {
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
    const selectedCategories = this.projectCategories.filter((el) => el.selected == true);
    this.selectedCategoryIds = selectedCategories.map((el) => el._id);
    if (this.selectedCategoryIds.length == 0) {
      this.filteredProjects = this.projects;
    }
    else {
      this.filteredProjects = this.projects.filter((project) => this.selectedCategoryIds.includes(project.category._id));
    }
  }

  clearFilters() {
    this.projectCategories.forEach((el) => {
      el.selected = false;
      this.updateAllComplete();
    });
  }


  getCount(categoryId: string): number {
    return this.projects.filter((project) => project.category._id == categoryId).length;;
  }
}
