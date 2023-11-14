import { Component, OnInit, ChangeDetectorRef, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { AvailableLangs, TranslocoService } from "@ngneat/transloco";
import { AuthService } from "app/core/auth/auth.service";
import { UserService } from "app/core/user/user.service";
import { User } from "app/core/user/user.types";
import { ApiService } from "app/services/api.service";
import { LocalstorageService } from "app/services/localstorage.service";
import { ProjectService } from "app/services/project.service";
import { TenderService } from "app/services/tender.service";
import { Project } from "app/types/project.types";
import { Tender } from "app/types/tender.types";
import { Subject, takeUntil } from "rxjs";
import { DOCUMENT } from '@angular/common';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {

  isDropdownOpen: boolean = false;
  isShowMoreOpened: boolean = false;
  isShowMoreOpened1: boolean = false;
  isShowMoreOpened2: boolean = false;

  user: User;
  categories: any[] = [];
  projects: Project[] = [];
  tenders: Tender[] = [];
  blogs: any[] = [];

  projectCategories: any[] = [];
  tenderCategories: any[] = [];
  jobCategories: any[] = [];
  blogCategories: any[] = [];

  availableLangs: AvailableLangs;
  activeLang: string;
  flagCodes: any;

  private _unsubscribeAll: Subject<any> = new Subject<any>();


  constructor(
    private _userService: UserService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _authService: AuthService,
    private _apiService: ApiService,
    private _projectService: ProjectService,
    private _tenderService: TenderService,
    private _translocoService: TranslocoService,
    private _localstorageService: LocalstorageService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {

    const projects = this.document.querySelector("#projects");
    const tenders = this.document.querySelector("#tenders");
    const blogs = this.document.querySelector("#blogs");

    this.availableLangs = this._translocoService.getAvailableLangs();
    this._translocoService.langChanges$.subscribe((activeLang) => {
      this.activeLang = activeLang;
    });

    // Set the country iso codes for languages for flags
    this.flagCodes = {
      'en': 'us',
      'tr': 'tr'
    };

    projects.addEventListener("mouseover", (e) => {
      this.isShowMoreOpened2 = true;
      this.isShowMoreOpened = false;
      this.isShowMoreOpened1 = false;
      this._changeDetectorRef.markForCheck();
    });


    tenders.addEventListener("mouseover", (e) => {
      this.isShowMoreOpened1 = true;
      this.isShowMoreOpened = false;
      this.isShowMoreOpened2 = false;
      this._changeDetectorRef.markForCheck();
    });


    blogs.addEventListener("mouseover", (e) => {
      this.isShowMoreOpened = true;
      this.isShowMoreOpened2 = false;
      this.isShowMoreOpened1 = false;
      this._changeDetectorRef.markForCheck();
    });


    projects.addEventListener("mouseout", (e) => {
      this.isShowMoreOpened2 = false;
      this._changeDetectorRef.markForCheck();
    });


    tenders.addEventListener("mouseout", (e) => {
      this.isShowMoreOpened1 = false;
      this._changeDetectorRef.markForCheck();
    });


    blogs.addEventListener("mouseout", (e) => {
      this.isShowMoreOpened = false;
      this._changeDetectorRef.markForCheck();
    });

    this._userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((user: any) => {
      this.user = user;
      this._changeDetectorRef.markForCheck();
    });

    this.getCategories();
    this.getProjects();
    this.getTenders()
    this.getBlog()
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  signOut(): void {
    this._authService.signOut();
  }

  profile(): void {
    this._router.navigate(["/profile"]);
  }


  getCategories() {
    this._apiService.getCategories([]).subscribe((categories) => {
      this.categories = categories;
      this.projectCategories = this.shuffleArray(this.categories.filter((el) => el.types.some((type) => ["Projects"].includes(type))));
      this.tenderCategories = this.shuffleArray(this.categories.filter((el) => el.types.some((type) => ["Tenders"].includes(type))));
      this.jobCategories = this.shuffleArray(this.categories.filter((el) => el.types.some((type) => ["Jobs"].includes(type))));
      this.blogCategories = this.shuffleArray(this.categories.filter((el) => el.types.some((type) => ["Blogs"].includes(type))));
    })
  }

  setActiveLang(lang: string): void {
    this._translocoService.setActiveLang(lang);
    this._localstorageService.setItem('language', lang);
  }

  getProjects() {
    this._projectService.getProjects()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((projects: Project[]) => {
        this.projects = this.shuffleArray(projects);
        this._changeDetectorRef.markForCheck();
      });
  }

  getTenders() {
    this._tenderService.getTenders()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((tenders: Tender[]) => {
        this.tenders = this.shuffleArray(tenders);;
        this._changeDetectorRef.markForCheck();
      });
  }

  getBlog() {
    this._apiService.getBlogs().subscribe((blogs) => {
      this.blogs = this.shuffleArray(blogs);;
    });
  }

  showProjects() {
    this.isShowMoreOpened2 = false;
    this.isShowMoreOpened = false;
    this.isShowMoreOpened1 = false;
    this._router.navigate(["/projects"]);
    this._changeDetectorRef.markForCheck();
  }

  showTenders() {
    this.isShowMoreOpened1 = false;
    this.isShowMoreOpened = false;
    this.isShowMoreOpened2 = false;
    this._router.navigate(["/tenders"]);
    this._changeDetectorRef.markForCheck();
  }

  showBlogs() {
    this.isShowMoreOpened = false;
    this.isShowMoreOpened2 = false;
    this.isShowMoreOpened1 = false;
    this._router.navigate(["/blog"]);
    this._changeDetectorRef.markForCheck();
  }

  shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  closeAll() {
    this.isShowMoreOpened = false;
    this.isShowMoreOpened2 = false;
    this.isShowMoreOpened1 = false;
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}