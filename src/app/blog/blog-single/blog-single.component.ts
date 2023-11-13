import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TranslocoService } from "@ngneat/transloco";
import { ApiService } from "app/services/api.service";

@Component({
    selector: "app-blog-single",
    templateUrl: "./blog-single.component.html",
    styleUrls: ["./blog-single.component.scss"],
})
export class BlogSingleComponent implements OnInit {

    blog: any;
    blogId: any;
    loading: boolean = false;
    blogs: any[] = [];
    activeLang: string;

    constructor(
        private _apiServecies: ApiService,
        private route: ActivatedRoute,
        private _translocoService: TranslocoService) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {
            this.blogId = params.get("id");
            this.getBlog();
            window.scrollTo(0, 0);
        });

        this._translocoService.langChanges$.subscribe((activeLang) => {
            this.activeLang = activeLang;
        });
    }

    getBlog() {
        this._apiServecies.getBlogId(this.blogId).subscribe((blog) => {
            this.blog = blog;
            this.loading = true;
            this.getBlogs();
        });
    }

    getBlogs() {
        this._apiServecies.getBlogs().subscribe((blogs) => {
            this.blogs = blogs;
            this.blogs.splice(
                this.blogs.findIndex((blog) => blog._id == this.blogId),
                1
            );
        });
    }
}
