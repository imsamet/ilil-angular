import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AuthService } from './core/auth/auth.service';
import { TranslocoService } from '@ngneat/transloco';
import { OpenaiService } from './services/openai.service';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { LocalstorageService } from './services/localstorage.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  static isBrowser = new BehaviorSubject<boolean>(null);

  constructor(
    private _authService: AuthService,
    private _translocoService: TranslocoService,
    private _openaiService: OpenaiService,
    @Inject(PLATFORM_ID) private platformId: any,
    private _localstorageService: LocalstorageService) {
    AppComponent.isBrowser.next(isPlatformBrowser(platformId));
  }

  ngOnInit(): void {
    var token: string = this._localstorageService.getItem('accessToken');
    var lang: string = this._localstorageService.getItem('language');
    if (token) {
      this._authService.check().subscribe()
    }
    if (lang) {
      this._translocoService.setActiveLang(lang);
    }
  }
}
