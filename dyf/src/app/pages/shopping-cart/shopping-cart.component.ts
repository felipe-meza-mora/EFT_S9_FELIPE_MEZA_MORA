import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import{ ProductService } from '../../service/product.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup,ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../service/order.service';
import { Order } from '../../models/order.model';

declare var bootstrap: any; 

/**
 * Componente que gestiona el carrito de compras y el proceso de checkout.
 */


@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})

export class ShoppingCartComponent implements OnInit {

  /** Lista de productos en el carrito con sus cantidades */
  cart: { product: Product, quantity: number }[] = [];

  /** Total acumulado del carrito */
  total: number = 0;

  /** Indica si el usuario ha iniciado sesión */
  userLoggedIn: boolean = false;

  /** Formulario para la información del usuario */
  userInfoForm: FormGroup;

   /**
   * Constructor del componente ShoppingCartComponent.
   * @param {ProductService} productService - Servicio para gestionar los productos.
   * @param {FormBuilder} fb - Constructor de formularios reactivos para construir el formulario userInfoForm.
   * @param {Router} router - Router de Angular para la navegación.
   */
  constructor(private productService: ProductService, private fb: FormBuilder, private router: Router,private orderService: OrderService) {
    this.userInfoForm = this.fb.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
    });
  }

  /**
   * Método de ciclo de vida OnInit. Carga el carrito y verifica la sesión del usuario al inicializar el componente.
   * @return {void}
   */

  ngOnInit(): void {
    this.loadCart();
    this.checkUserSession();
  }

  /**
   * Carga los productos en el carrito desde el servicio ProductService.
   * Calcula el total del carrito.
   * @return {void}
   */

  private loadCart(): void {
    this.cart = this.productService.getCart();
    this.calculateTotal();
  }

   /**
   * Calcula el total del carrito sumando el precio de cada producto por su cantidad.
   * @return {void}
   */

  private calculateTotal(): void {
    this.total = this.cart.reduce((sum, item) => sum + item.product.precio * item.quantity, 0);
  }

  /**
   * Verifica si hay una sesión de usuario activa almacenada en localStorage.
   * Si hay sesión activa, carga la información del usuario en el formulario userInfoForm.
   * @return {void}
   */

  private checkUserSession(): void {
    const sesionUsuario = localStorage.getItem('sesionUsuario');
    this.userLoggedIn = !!sesionUsuario;
    if (this.userLoggedIn && sesionUsuario) {
      const userData = JSON.parse(sesionUsuario);
      this.userInfoForm.patchValue({
        nombre: userData.nombre,
        direccion: userData.direccionEnvio,
        correo: userData.email,
        telefono: userData.telefono,
      });
    }
  }

   /**
   * Incrementa la cantidad de un producto en el carrito.
   * @param {number} productId - ID del producto que se quiere incrementar.
   * @return {void}
   */

  incrementQuantity(productId: number): void {
    this.productService.incrementQuantity(productId);
    this.loadCart();
  }

   /**
   * Decrementa la cantidad de un producto en el carrito.
   * @param {number} productId - ID del producto que se quiere decrementar.
   * @return {void}
   */

  decrementQuantity(productId: number): void {
    this.productService.decrementQuantity(productId);
    this.loadCart();
  }

  /**
   * Vacía completamente el carrito de compras.
   * @return {void}
   */

  clearCart(): void {
    this.productService.clearCart();
    this.loadCart();
  }

  /**
   * Procede con el proceso de checkout, almacenando el pedido en localStorage.
   * Si el usuario está autenticado, utiliza su información almacenada.
   * Si no, utiliza la información ingresada en el formulario userInfoForm.
   * @return {void}
   */
  
  proceedToCheckout(): void {
    const pedido: Omit<Order, 'id'> = {
      nombre: '',
      direccion: '',
      correo: '',
      telefono: '',
      total: this.total,
      detalle: this.cart.map(item => ({
        img: item.product.thumbnailUrl,
        producto: item.product.title,
        cantidad: item.quantity,
        precio: item.product.precio,
        subtotal: item.product.precio * item.quantity
      })),
      estado: 'Procesado'
    };

    if (this.userLoggedIn) {
      const sesionUsuario = JSON.parse(localStorage.getItem('sesionUsuario') || '{}');
      pedido.nombre = sesionUsuario.nombre;
      pedido.direccion = sesionUsuario.direccionEnvio;
      pedido.correo = sesionUsuario.email;
      pedido.telefono = sesionUsuario.telefono;
    } else {
      if (this.userInfoForm.valid) {
        pedido.nombre = this.userInfoForm.value.nombre;
        pedido.direccion = this.userInfoForm.value.direccion;
        pedido.correo = this.userInfoForm.value.correo;
        pedido.telefono = this.userInfoForm.value.telefono;
      } else {
        // Si el formulario no es válido, no proceder con el checkout
        return;
      }
    }

    this.orderService.saveOrder(pedido).then(() => {
      if (!this.userLoggedIn) {
        localStorage.removeItem('sesionUsuario');
      }
      this.clearCart();
      this.showToast(`¡Pedido realizado con éxito! Redirigiendo a la página de inicio...`);
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 4000);
    }).catch(error => {
      console.error("Error al crear el pedido: ", error);
      this.showToast(`Error al realizar el pedido. Por favor, inténtelo de nuevo.`);
    });
  }

  /**
   * Muestra un mensaje de toast utilizando Bootstrap Toast.
   * @param {string} message - El mensaje que se desea mostrar en el toast.
   * @return {void}
   */

  private showToast(message: string): void {
    const toastElement = document.getElementById('liveToast');
    const toastBodyElement = document.getElementById('toast-body');

    if (toastBodyElement) {
      toastBodyElement.innerText = message;
    }

    if (toastElement) {
      const toast = new bootstrap.Toast(toastElement);
      toast.show();
    }
  }
}