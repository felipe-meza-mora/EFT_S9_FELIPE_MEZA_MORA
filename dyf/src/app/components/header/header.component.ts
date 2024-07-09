import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from '../../service/product.service';
import { UserSessionService } from '../../service/user-session.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,RouterModule ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

  /**
 * Componente de cabecera para la navegación y funcionalidades del usuario.
 * @description Este componente gestiona la visualización del nombre de usuario, la cantidad de productos en el carrito,
 * y la funcionalidad de cerrar sesión. También verifica los permisos de administrador y suscribe cambios en el carrito.
 */

export class HeaderComponent {
  
   /**
   * Bandera que indica si el usuario tiene permisos de administrador.
   * @type {boolean} true si el usuario es administrador, de lo contrario false.
   */

  isAdmin: boolean = false;

   /**
   * Cantidad de productos actualmente en el carrito.
   * @type {number} Número entero que representa la cantidad de productos en el carrito.
   */
  cartQuantity: number = 0;
  
    /**
   * Nombre del usuario actualmente autenticado.
   * @type {string | null} Cadena de texto con el nombre del usuario o null si no hay usuario autenticado.
   */
  userName: string | null = null;

   /**
   * Suscripción al observable del carrito de productos para actualizar la cantidad en tiempo real.
   * @type {Subscription | undefined} Objeto Subscription para manejar la suscripción al carrito de productos.
   */
  private cartSubscription: Subscription | undefined;

  // Nueva suscripción para el usuario
  private userSubscription: Subscription | undefined;


  constructor(private productService: ProductService,private router: Router, private cdr: ChangeDetectorRef, private userSessionService: UserSessionService) {}


    /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Carga el nombre de usuario, verifica los permisos de administrador y suscribe cambios en el carrito.
   */

  ngOnInit(): void {
    this.loadUserName();
    this.checkAdminPermission();
    this.cartSubscription = this.productService.cart$.subscribe(cart => {
      this.cartQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    });
    this.userSubscription = this.userSessionService.user$.subscribe(user => {
      this.userName = user ? user.nombre : null;
      this.isAdmin = user && user.permisos === 'admin';
      this.cdr.detectChanges(); // Forzar detección de cambios
    });
  }

    /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Cancela la suscripción al observable del carrito de productos para prevenir memory leaks.
   */

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe(); // Desuscribirse del usuario
    }
  }

  /**
   * Carga el nombre del usuario desde el almacenamiento local.
   * Actualiza la propiedad `userName` con el nombre del usuario si está autenticado.
   */

  loadUserName(): void {
    const sesionUsuario = localStorage.getItem('sesionUsuario');
    if (sesionUsuario) {
      const userData = JSON.parse(sesionUsuario);
      this.userName = userData.nombre;
    }
  }

     /**
   * Verifica si hay un usuario autenticado.
   * @return {boolean} true si hay un usuario autenticado, de lo contrario false.
   */

     isLoggedIn(): boolean {
      return localStorage.getItem('sesionUsuario') !== null;
    }


  /**
   * Verifica si el usuario tiene permisos de administrador.
   * Actualiza la propiedad `isAdmin` a true si el usuario tiene permisos de administrador.
   */

  checkAdminPermission(): void {
    const sesionUsuario = localStorage.getItem('sesionUsuario');
    if (sesionUsuario) {
      const userData = JSON.parse(sesionUsuario);
      if (userData.permisos === 'admin') {
        this.isAdmin = true;
      }
    }
  }

   /**
   * Cierra la sesión del usuario actual.
   * Elimina la información de sesión del almacenamiento local y redirige a la página de inicio de sesión.
   * Realiza una detección de cambios después de la redirección.
   */

  logout(): void {
    localStorage.removeItem('sesionUsuario');
    this.userSessionService.clearUser(); // Limpia el usuario del servicio
    this.router.navigate(['/login']).then(() => {
      this.cdr.detectChanges(); // Forzar detección de cambios
    });
  }
}