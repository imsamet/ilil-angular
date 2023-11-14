import { APP_ID, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { JobsListComponent } from './jobs-list/jobs-list.component';
import { JobsSinglePageComponent } from './jobs-list/jobs-single-page/jobs-single-page.component';
import { MyCvsComponent } from './jobs-list/cvs/cvs.component';
import { CvsSinglePageComponent } from './jobs-list/cvs/cvs-single-page/cvs-single-page.component';
import { BlogComponent } from './blog/blog.component';
import { TendersComponent } from './tenders/tenders.component';
import { ProjectsComponent } from './projects/projects.component';
import { MyProfileComponent } from './auth/my-profile/my-profile.component';
import { LoginComponent } from './auth/login/login.component';
import { SginupComponent } from './auth/sginup/sginup.component';
import { ResetpassComponent } from './auth/resetpass/resetpass.component';
import { ForgetpassComponent } from './auth/forgetpass/forgetpass.component';
import { FooterComponent } from './Layouts/footer/footer.component';
import { HeaderComponent } from './Layouts/header/header.component';
import { TeamComponent } from './team/team.component';
import { FaqComponent } from './faq/faq.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';
import { FileUploaderService } from './services/file-uploader.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthModule } from './core/auth/auth.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ApiService } from './services/api.service';
import { BlogSingleComponent } from './blog/blog-single/blog-single.component';
import { ProjectComponent } from './projects/project/project.component';
import { TenderComponent } from './tenders/tender/tender.component';
import { MyProjectsComponent } from './my-projects/my-projects.component';
import { MyTendersComponent } from './my-tenders/my-tenders.component';
import { FilesUploaderComponent } from './files-uploader/files-uploader.component';
import { DragDropDirectiveModule } from './directives/drag-drop/drag-drop.module';
import { VideoUploaderComponent } from './video-uploader/video-uploader.component';
import { CoverImageUploaderComponent } from './cover-image-uploader/cover-image-uploader.component';
import { CountUpModule } from 'ngx-countup';
import { IconsModule } from './core/icons/icons.module';
import { MatLuxonDateModule } from '@angular/material-luxon-adapter';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { JobsComponent } from './jobs/jobs.component';
import { JobDetailsComponent, PostJobDialog } from './jobs/job-details/job-details.component';
import { LottieModule } from "ngx-lottie";
import { CvsComponent } from './cvs/cvs.component';
import { CvDetailsComponent } from './cvs/cv-details/cv-details.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { OrganizationsComponent } from './organizations/organizations.component';
import { OrganizationDetailsComponent } from './organizations/organization-details/organization-details.component';
import { TechnocitiesComponent } from './technocities/technocities.component';
import { TechnocityDetailsComponent } from './technocities/technocity-details/technocity-details.component';
import { SwiperComponent } from './swiper/swiper.component';
import { TranslocoRootModule } from './transloco-root.module';
import { TranslateModalComponent } from './translate-modal/translate-modal.component';

export const MY_FORMATS = {
  parse: {
    dateInput: 'dd.MM.yyyy',
  },
  display: {
    dateInput: 'dd.MM.yyyy',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM-yyyy',
  },
};

const mat = [
  MatIconModule,
  MatTooltipModule,
  MatSnackBarModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatButtonModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatNativeDateModule,
  MatDatepickerModule,
  MatRadioModule,
  MatSelectModule,
  MatStepperModule,
  MatDividerModule,
  MatMenuModule,
  MatDialogModule,
  MatSidenavModule,
  MatLuxonDateModule,
  MatAutocompleteModule,
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    JobsListComponent,
    JobsSinglePageComponent,
    MyCvsComponent,
    CvsSinglePageComponent,
    BlogComponent,
    TendersComponent,
    ProjectsComponent,
    MyProfileComponent,
    LoginComponent,
    SginupComponent,
    ResetpassComponent,
    ForgetpassComponent,
    FooterComponent,
    HeaderComponent,
    TeamComponent,
    FaqComponent,
    FileUploaderComponent,
    BlogSingleComponent,
    ProjectComponent,
    TenderComponent,
    MyProjectsComponent,
    MyTendersComponent,
    FilesUploaderComponent,
    VideoUploaderComponent,
    CoverImageUploaderComponent,
    JobsComponent,
    JobDetailsComponent,
    PostJobDialog,
    CvsComponent,
    CvDetailsComponent,
    OrganizationsComponent,
    OrganizationDetailsComponent,
    TechnocitiesComponent,
    TechnocityDetailsComponent,
    SwiperComponent,
    TranslateModalComponent
  ],
  imports: [
    ...mat,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AuthModule,
    DragDropDirectiveModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CountUpModule,
    IconsModule,
    LottieModule.forRoot({ player: playerFactory }),
    TranslocoRootModule,

  ],
  providers: [
    FileUploaderService,
    ApiService,
    {
      provide: MAT_DATE_FORMATS,
      useValue: MY_FORMATS
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }

export function playerFactory() {
  return import("lottie-web");
}