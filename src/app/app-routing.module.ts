import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagebookComponent } from './booking/managebook/managebook.component';
import { NewbookComponent } from './booking/newbook/newbook.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'reservations/new',
    component: NewbookComponent
  },
  {
    path: 'reservations/manage',
    component: ManagebookComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
