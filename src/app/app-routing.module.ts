import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'page/home',
    pathMatch: 'full',
  },
  {
    path: '',
    children: [
      // {
      //   path: 'todo',
      //   loadChildren: () => import("./modules/vehicle/vehicle.module").then(m => m.VehicleModule)
      // },
      {
        path: 'page',
        loadChildren: () => import('./modules/pages/pages.module').then(m => m.PagesModule)
      }
    ]
  },
  {
    path: "**",
    redirectTo: 'page/home', 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
