import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { BlogComponent } from './blog/blog.component';
import { ContactComponent } from './contact/contact.component';
import { FaqComponent } from './faq/faq.component';
import { TeamComponent } from './team/team.component';
import { ProjectsComponent } from './projects/projects.component';
import { TendersComponent } from './tenders/tenders.component';
import { MyProfileComponent } from './auth/my-profile/my-profile.component';
import { JobsComponent } from 'app/jobs/jobs.component';
import { JobDetailsComponent } from 'app/jobs/job-details/job-details.component';
import { CvsSinglePageComponent } from './jobs-list/cvs/cvs-single-page/cvs-single-page.component';
import { JobsSinglePageComponent } from './jobs-list/jobs-single-page/jobs-single-page.component';
import { LoginComponent } from './auth/login/login.component';
import { SginupComponent } from './auth/sginup/sginup.component';
import { AuthGuard } from './core/auth/guards/auth.guard';
import { NoAuthGuard } from './core/auth/guards/noAuth.guard';
import { ProjectResolver, ProjectsResolver } from './resolvers/projects.resolver';
import { BlogSingleComponent } from './blog/blog-single/blog-single.component';
import { TenderResolver, TendersResolver } from './resolvers/tenders.resolver';
import { ProjectComponent } from './projects/project/project.component';
import { TenderComponent } from './tenders/tender/tender.component';
import { JobResolver, JobsResolver } from './resolvers/jobs.resolver';
import { CvsComponent } from './cvs/cvs.component';
import { CvResolver, CvsResolver } from './resolvers/cvs.resolver';
import { CvDetailsComponent } from './cvs/cv-details/cv-details.component';
import { OrganizationsComponent } from './organizations/organizations.component';
import { OrganizationDetailsComponent } from './organizations/organization-details/organization-details.component';
import { TechnocitiesComponent } from './technocities/technocities.component';
import { TechnocityDetailsComponent } from './technocities/technocity-details/technocity-details.component';
import { OrganizationsResolver, OrganizationResolver } from './resolvers/organizations.resolver';
import { TechnocitiesResolver, TechnocityResolver } from './resolvers/technocities.resolver';

const routes: Routes = [

  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'blog', component: BlogComponent },
  { path: "blog/:id", component: BlogSingleComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'meet', pathMatch: 'full', redirectTo: 'contact' },
  { path: 'faq', component: FaqComponent },
  { path: 'team', component: TeamComponent },

  { path: 'projects', component: ProjectsComponent, resolve: { projects: ProjectsResolver } },
  { path: 'projects/:id', component: ProjectComponent, resolve: { project: ProjectResolver } },
  { path: 'tenders', component: TendersComponent, resolve: { tenders: TendersResolver } },
  { path: 'tenders/:id', component: TenderComponent, resolve: { tender: TenderResolver } },

  { path: 'jobs', component: JobsComponent, resolve: { jobs: JobsResolver } },
  { path: 'jobs/:id', component: JobDetailsComponent, resolve: { job: JobResolver } },

  { path: 'organizations', component: OrganizationsComponent, resolve: { organizations: OrganizationsResolver } },
  { path: 'organizations/:id', component: OrganizationDetailsComponent, resolve: { organization: OrganizationResolver } },

  { path: 'technocities', component: TechnocitiesComponent, resolve: { technocities: TechnocitiesResolver } },
  { path: 'technocities/:id', component: TechnocityDetailsComponent, resolve: { technocitiy: TechnocityResolver } },

  { path: 'cvs', component: CvsComponent, resolve: { cvs: CvsResolver } },
  { path: 'cvs/:id', component: CvDetailsComponent, resolve: { cv: CvResolver } },

  { path: 'profile', canMatch: [AuthGuard], component: MyProfileComponent },
  { path: 'cvs-single', canMatch: [AuthGuard], component: CvsSinglePageComponent },
  { path: 'jobs-single', canMatch: [AuthGuard], component: JobsSinglePageComponent },


  //Auth
  { path: 'login', component: LoginComponent, canMatch: [NoAuthGuard] },
  { path: 'sign-up', component: SginupComponent, canMatch: [NoAuthGuard] },

  { path: '**', redirectTo: 'home' }

];

const routerConfig: ExtraOptions = {
  scrollPositionRestoration: 'top'
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerConfig)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
