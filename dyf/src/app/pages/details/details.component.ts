import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../service/product.service';
import { Product } from '../../models/product.model';

declare var bootstrap: any; 

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})

/**
 * Componente que muestra los detalles de un producto específico.
 * @description Este componente obtiene el ID del producto desde la URL, carga el producto correspondiente utilizando el servicio ProductService,
 * y muestra los detalles del producto en la interfaz.
 */

export class DetailsComponent implements OnInit {

  /**
   * Producto específico que se muestra en los detalles.
   * @type {Product | undefined} Objeto de tipo Product o undefined si no se ha cargado ningún producto.
   */
  product: Product | undefined;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Obtiene el ID del producto desde la URL utilizando ActivatedRoute y carga el producto correspondiente desde ProductService.
   */
  
  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProductById(productId).subscribe(product => {
        this.product = product;
      });
    }
  }

   /**
   * Método que añade un producto al carrito de compras.
   * Utiliza el servicio ProductService para añadir el producto al carrito.
   * Muestra un mensaje de notificación utilizando Bootstrap Toast para indicar que el producto ha sido agregado.
   * @param {Product} product Producto que se va a añadir al carrito.
   */

  addToCart(product: Product): void {
    this.productService.addToCart(product);
    this.showToast(`${product.title} ha sido agregado al carrito`);
  }

   /**
   * Método privado que muestra un Toast de Bootstrap con un mensaje específico.
   * Utiliza la librería de Bootstrap para crear y mostrar un mensaje de notificación en la interfaz.
   * @param {string} message Mensaje que se mostrará en el Toast.
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
