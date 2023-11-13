import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ApiService } from "app/services/api.service";
import { UserService } from 'app/core/user/user.service';
import { Subject, takeUntil } from 'rxjs';
import { User } from "app/core/user/user.types";
import { TranslocoService } from "@ngneat/transloco";

@Component({
    selector: "app-my-cvs",
    templateUrl: "./cvs.component.html",
    styleUrls: ["./cvs.component.scss"],
})
export class MyCvsComponent implements OnInit {

    cvs: any[] = [];
    user: User;
    singleCVData: any;
    mode: string = 'list';
    activeLang: string;

    private _unsubscribeAll: Subject<any> = new Subject<any>();


    constructor(
        private _apiService: ApiService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _userService: UserService,
        private _translocoService: TranslocoService,
    ) { }

    ngOnInit(): void {
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: any) => {
                this.user = user;
                this.getCvs();
                this._changeDetectorRef.markForCheck();
            });

        this._translocoService.langChanges$.subscribe((activeLang) => {
            this.activeLang = activeLang;
        });
    }

    getCvs() {
        this._apiService.getCvs(this.user._id).subscribe((cvs) => {
            this.cvs = cvs;
        });
    }

    sendData(data) {
        this.mode = 'edit';
        this.singleCVData = data;
    }
}
