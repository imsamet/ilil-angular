import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ApiService } from "app/services/api.service";
import { UserService } from 'app/core/user/user.service';
import { Subject, takeUntil } from 'rxjs';
import { User } from "app/core/user/user.types";
import { TranslocoService } from "@ngneat/transloco";

@Component({
  selector: "app-jobs-list",
  templateUrl: "./jobs-list.component.html",
  styleUrls: ["./jobs-list.component.scss"],
})
export class JobsListComponent implements OnInit {

  jobs: any[] = [];
  user: User;
  singleJobData: any;
  mode: string = 'list';
  activeLang: string;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _apiServices: ApiService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _userService: UserService,
    private _translocoService: TranslocoService,
  ) { }

  ngOnInit(): void {
    this._userService.user$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user: any) => {
        this.user = user;
        this.getJobs();
        this._changeDetectorRef.markForCheck();
      });

    this._translocoService.langChanges$.subscribe((activeLang) => {
      this.activeLang = activeLang;
    });
  }

  getJobs() {
    this._apiServices.getJobs(this.user._id).subscribe((jobs) => {
      this.jobs = jobs;
    });
  }

  sendData(data) {
    this.mode = 'edit';
    this.singleJobData = data;
  }
}
