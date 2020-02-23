import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScrapComponent } from './components/scrap/scrap.component';

const routes: Routes = [
  {
    path: '',
    component: ScrapComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
