import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { DetailsComponent } from './pages/details/details.component';
import { LoginComponent } from './pages/login/login.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { SalesComponent } from './pages/sales/sales.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ShoppingCartComponent } from './pages/shopping-cart/shopping-cart.component';
import { UsersComponent } from './pages/users/users.component';


export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: 'login', component: LoginComponent },
    { path: 'details/:id', component: DetailsComponent},
    { path: 'perfil', component: PerfilComponent},
    { path: 'change-password', component: ChangePasswordComponent},
    { path: 'shopping-cart', component: ShoppingCartComponent},
    { path: 'sales', component: SalesComponent},
    { path: 'orders', component: OrdersComponent},
    { path: 'users', component: UsersComponent},
    { path: '**', redirectTo: 'home' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }