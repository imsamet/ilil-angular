import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/auth/auth.service';
import { TranslocoService } from '@ngneat/transloco';
import { OpenaiService } from './services/openai.service';
import { ChatGPTAPI } from 'chatgpt';
import { Buffer } from 'buffer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private _authService: AuthService, private _translocoService: TranslocoService, private _openaiService: OpenaiService) {

  }

  ngOnInit(): void {
    var token: string = localStorage.getItem('accessToken');
    var lang: string = localStorage.getItem('language');
    if (token) {
      this._authService.check().subscribe()
    }
    if (lang) {
      this._translocoService.setActiveLang(lang);
    }
  }
}
