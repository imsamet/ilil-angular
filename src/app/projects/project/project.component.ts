import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { ProjectService } from 'app/services/project.service';
import { Project } from 'app/types/project.types';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  project: Project;
  user: User;
  activeLang: string;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _projectService: ProjectService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _userService: UserService,
    private _translocoService: TranslocoService
  ) {

  }

  ngOnInit(): void {
    this._userService.user$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user: User) => {
        this.user = user;
        this._changeDetectorRef.markForCheck();
      });

    this._projectService.project$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((project: Project) => {
        this.project = project;
        this._changeDetectorRef.markForCheck();
      });

    this._translocoService.langChanges$.subscribe((activeLang) => {
      this.activeLang = activeLang;
    });
  }
}
