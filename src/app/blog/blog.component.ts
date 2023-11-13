import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { TranslocoService } from "@ngneat/transloco";
import { ApiService } from "app/services/api.service";
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: "app-blog",
    templateUrl: "./blog.component.html",
    styleUrls: ["./blog.component.scss"],
})
export class BlogComponent implements OnInit {

    blogs: any[];
    filteredBlogs: any[] = [];
    categories: any[] = [];
    blogCategories: any[] = [];
    selectedCategoryIds: string[] = [];
    activeLang: string;


    private _unsubscribeAll: Subject<any> = new Subject<any>();


    constructor(
        private _apiService: ApiService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _translocoService: TranslocoService
    ) { }

    ngOnInit(): void {
        this.getBlog();
        this._translocoService.langChanges$.subscribe((activeLang) => {
            this.activeLang = activeLang;
        });
    }

    getBlog() {
        this._apiService.blogs$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((blogs: any[]) => {
                this.blogs = blogs;
                this.getCategories();
                this._changeDetectorRef.markForCheck();
            });
    }


    getCategories() {
        this._apiService.getCategories([]).subscribe((categories) => {
            this.categories = categories;
            this.blogCategories = this.categories.filter((el) => el.types.some((type) => ["Blogs"].includes(type)));
            this.blogCategories.forEach((el) => {
                el.selected = false;
            });
            this.updateAllComplete();
        })
    }

    updateAllComplete() {
        const selectedCategories = this.blogCategories.filter((el) => el.selected == true);
        this.selectedCategoryIds = selectedCategories.map((el) => el._id);
        if (this.selectedCategoryIds.length == 0) {
            this.filteredBlogs = this.blogs;
        }
        else {
            this.filteredBlogs = this.blogs.filter((blog) => this.selectedCategoryIds.includes(blog.category._id));
        }
    }

    clearFilters() {
        this.blogCategories.forEach((el) => {
            el.selected = false;
            this.updateAllComplete();
        });
    }


    getCount(categoryId: string): number {
        return this.blogs.filter((project) => project.category._id == categoryId).length;;
    }
}
