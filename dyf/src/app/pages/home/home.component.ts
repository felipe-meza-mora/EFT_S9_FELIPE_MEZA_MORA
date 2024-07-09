import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { ProductService } from '../../service/product.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../../models/product.model';

declare var bootstrap: any; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

/**
 * Componente principal que muestra la página de inicio de la aplicación.
 * @description Este componente carga productos desde el servicio ProductService y muestra la vista de inicio de la aplicación.
 */

export class HomeComponent implements OnInit, OnDestroy {

  /**
   * Arreglo que contiene todos los productos disponibles para mostrar en la página de inicio.
   * @type {Product[]} Arreglo de objetos de tipo Product.
   */
  products: Product[] = [];

  /**
 * FormGroup para el formulario de agregar producto.
 * Se utiliza para gestionar y validar los campos del formulario de nuevo producto.
 */

  productForm: FormGroup;

  /**
 * Objeto que representa un nuevo producto.
 * Contiene los campos necesarios para crear un nuevo producto.
 */

  newProduct: Product = {
    id: 0,
    categoria: '',
    descripcion: '',
    marca: '',
    precio: 0,
    thumbnailUrl: '',
    title: '',
  };

  /**
 * Producto seleccionado para operaciones de edición o eliminación.
 * Puede ser undefined si ningún producto está seleccionado.
 */

  selectedProduct: Product | undefined;
 
  /**
 * FormGroup para el formulario de edición de producto.
 * Se utiliza para gestionar y validar los campos del formulario de edición de producto.
 */

  editProductForm: FormGroup | undefined;

  /**
   * Suscripción al evento de navegación del Router para recargar la lista de productos al cambiar de ruta.
   * @type {Subscription | undefined} Suscripción al evento de navegación del Router.
   */
  private routerSubscription: Subscription | undefined;

  /**
   * Variable que indica si el usuario actual tiene permisos de administrador.
   * @type {boolean} True si el usuario tiene permisos de administrador, false en caso contrario.
   */
  isAdmin: boolean = false;

  /**
   * Arreglo que representa el carrito de compras del usuario.
   * Cada elemento del arreglo contiene un producto y la cantidad seleccionada.
   * @type {{ product: Product, quantity: number }[]} Arreglo de objetos que contienen productos y cantidades.
   */
  cart: { product: Product, quantity: number }[] = [];

  /**
   * Total acumulado del valor de los productos en el carrito de compras.
   * @type {number} Valor total de los productos en el carrito.
   */
  total: number = 0;
  errorMessage: string | undefined;

  constructor(private productService: ProductService, private router: Router,private formBuilder: FormBuilder) {
    this.productForm = this.formBuilder.group({
      id: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_-]+$')]],
      categoria: ['', Validators.required],
      descripcion: ['', Validators.required],
      marca: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
      thumbnailUrl: ['', [Validators.required]],
      title: ['', Validators.required]
    });

    this.editProductForm = this.formBuilder.group({
      categoria: ['', Validators.required],
      descripcion: ['', Validators.required],
      marca: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
      thumbnailUrl: ['', [Validators.required]],
      title: ['', Validators.required]
    });
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Verifica los permisos de administrador del usuario y carga la lista de productos inicial.
   * También se suscribe al evento de navegación del Router para recargar la lista de productos al cambiar de ruta.
   */

  ngOnInit(): void {
    this.checkAdmin(); 
    this.loadProducts();

    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadProducts();
    });
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Desuscribe la suscripción al evento de navegación del Router para evitar memory leaks.
   */

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  /**
   * Método privado que carga la lista de productos desde el servicio ProductService.
   * Actualiza el arreglo `products` con los productos obtenidos.
   */

  private loadProducts(): void {
    this.productService.getProducts().subscribe((products: Product[]) => {
      this.products = products;
      console.log(this.products);
    });
  }

  /**
   * Método privado que verifica si el usuario actual tiene permisos de administrador.
   * Obtiene esta información del localStorage basado en la sesión del usuario.
   * Actualiza la propiedad `isAdmin` en consecuencia.
   */

  private checkAdmin(): void {
    const sesionUsuario = localStorage.getItem('sesionUsuario');
    if (sesionUsuario) {
      const userData = JSON.parse(sesionUsuario);
      this.isAdmin = userData.permisos === 'admin';
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

  /**
 * Método que añade un nuevo producto a la colección de productos en Firestore.
 * Utiliza el servicio ProductService para realizar la inserción del nuevo producto.
 * Cierra el modal después de agregar el producto y muestra un mensaje de confirmación.
 * @returns {void}
 */
  addProduct(): void {
    if (this.productForm.valid) {
      const newProduct: Product = this.productForm.value;
      this.productService.checkProductIdExists(newProduct.id.toString())
        .then(exists => {
          if (exists) {
            this.errorMessage = 'El ID del producto ya existe. Por favor, elija otro ID.';
          } else {
            this.productService.addProduct(newProduct)
              .then(() => {
                console.log('Producto agregado con éxito');
                this.productForm.reset();
                this.errorMessage = ''; // Limpiar el mensaje de error en caso de éxito
                
                // Cerrar el modal
                const modalElement = document.getElementById('productModal');
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                modalInstance.hide();

                // Mostrar mensaje de confirmación
                this.showToast('Producto agregado con éxito');
              })
              .catch(error => {
                console.error('Error al agregar producto: ', error);
              });
          }
        })
        .catch(error => {
          console.error('Error al verificar ID del producto: ', error);
        });
    }
  }

  openDeleteModal(product: Product): void {
    this.selectedProduct = product;
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteProductModal'));
    deleteModal.show();
  }

  deleteProduct(): void {
    if (this.selectedProduct) {
      this.productService.deleteProduct(this.selectedProduct.id.toString())
        .then(() => {
          console.log('Producto eliminado con éxito');
          this.showToast(`${this.selectedProduct?.title} ha sido eliminado.`);
          this.loadProducts();
          bootstrap.Modal.getInstance(document.getElementById('deleteProductModal')).hide();
        })
        .catch(error => {
          console.error('Error al eliminar el producto:', error);
        });
    }
  }

  /**
 * Método que abre el modal de edición de productos y carga los datos del producto seleccionado en el formulario.
 * Utiliza el formulario editProductForm para cargar los datos del producto seleccionado.
 * Abre el modal utilizando Bootstrap Modal y muestra los datos del producto para su edición.
 * @param {Product} product - El producto seleccionado para editar.
 * @returns {void}
 */

  openEditProductModal(product: Product): void {
    // Cargar los datos del producto seleccionado en el formulario de edición
    this.selectedProduct = product;
    this.editProductForm?.patchValue({
      categoria: product.categoria,
      descripcion: product.descripcion,
      marca: product.marca,
      precio: product.precio,
      thumbnailUrl: product.thumbnailUrl,
      title: product.title
    });
    
    // Abrir el modal de edición de productos
    const editProductModal = document.getElementById('editProductModal');
    if (editProductModal) {
      const modal = new bootstrap.Modal(editProductModal);
      modal.show();
    }
  }

  /**
 * Método que actualiza los datos de un producto seleccionado en Firestore.
 * Utiliza el formulario editProductForm para obtener los datos actualizados del producto.
 * Llama al servicio ProductService para actualizar el producto en la base de datos.
 * Cierra el modal después de la actualización y muestra un mensaje de confirmación.
 * Maneja errores en caso de fallo en la actualización.
 * @returns {void}
 */

  updateProduct(): void {
    // Verificar si el formulario de edición es válido
    if (this.editProductForm?.invalid) {
      return;
    }
    
     // Obtener los datos actualizados del formulario de edición
    const updatedProduct: Partial<Product> = {
      categoria: this.editProductForm?.value.categoria,
      descripcion: this.editProductForm?.value.descripcion,
      marca: this.editProductForm?.value.marca,
      precio: this.editProductForm?.value.precio,
      thumbnailUrl: this.editProductForm?.value.thumbnailUrl,
      title: this.editProductForm?.value.title
    };
    
    // Verificar si el producto seleccionado tiene un ID válido
    if (this.selectedProduct?.id) {
      // Llamar al servicio para actualizar el producto en Firestore
      this.productService.updateProduct(this.selectedProduct.id.toString(), updatedProduct)
        .then(() => {
            // Cerrar el modal
            const modalElement = document.getElementById('editProductModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance.hide();

            // Mostrar mensaje de confirmación de la actualización
            this.showToast(`${this.selectedProduct?.title} Modificado con existo.`);
        })
        .catch(error => {
           // Manejo del error en caso de fallo en la actualización
          console.error('Error al actualizar el producto:', error);
        });
    } else {
      console.error('Producto seleccionado no tiene un ID válido');
    }
  }
}