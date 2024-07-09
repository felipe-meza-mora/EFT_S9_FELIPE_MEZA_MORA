import { Injectable } from "@angular/core";
import { Product} from "../models/product.model";
import { BehaviorSubject, Observable } from "rxjs";
import { Firestore,collectionData, collection,doc,docData,getDoc,setDoc,updateDoc,deleteDoc } from "@angular/fire/firestore";
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

/**
 * Servicio para la gestión de productos y carrito de compras.
 * @description Este servicio proporciona métodos para obtener productos, agregar productos al carrito, gestionar cantidades y limpiar el carrito.
 */

export class ProductService{ 

      /**
     * Servicio para la gestión de productos.
     * Proporciona métodos para agregar, actualizar, y eliminar productos en Firestore.
     */
    
    private productsCollection = collection(this.firestore, 'products');
    constructor(private firestore: Firestore) {}

    /**
     * BehaviorSubject que contiene el carrito de compras.
     * Emite un arreglo de objetos que contienen productos y cantidades.
     */

    private cart = new BehaviorSubject<{ product: Product, quantity: number }[]>(this.getCart());
    cart$ = this.cart.asObservable();
    
    /**
     * Añade un nuevo producto a la colección de productos en Firestore.
     * @param product El producto que se añadirá a Firestore.
     * @returns Una promesa que se resuelve cuando se completa la operación de añadir el producto.
     */

    addProduct(product: Product): Promise<void> {
      const productDoc = doc(this.firestore, `products/${product.id}`);
      return setDoc(productDoc, product);
    }

    /**
     * Actualiza un producto existente en Firestore.
     * @param id El ID del producto que se actualizará.
     * @param product Objeto parcial que contiene los campos actualizados del producto.
     * @returns Una promesa que se resuelve cuando se completa la operación de actualizar el producto.
     */
  
    updateProduct(id: string | number, product: Partial<Product>): Promise<void> {
      const productDoc = doc(this.firestore, `products/${id}`);
      return updateDoc(productDoc, product);
    }

    /**
     * Elimina un producto de la colección en Firestore.
     * @param id El ID del producto que se eliminará.
     * @returns Una promesa que se resuelve cuando se completa la operación de eliminar el producto.
     */
  
    deleteProduct(id: string): Promise<void> {
      const productDoc = doc(this.firestore, `products/${id}`);
      return deleteDoc(productDoc);
    }

    /**
     * Verifica si existe un producto con el ID especificado en Firestore.
     * @param id El ID del producto que se verificará.
     * @returns Una promesa que se resuelve con true si el documento existe, o false si no existe.
     */

    checkProductIdExists(id: string): Promise<boolean> {
      const productDoc = doc(this.firestore, `products/${id}`);
      return getDoc(productDoc).then(docSnapshot => docSnapshot.exists());
    }

    /**
   * Obtiene todos los productos disponibles.
   * @return Un arreglo de objetos tipo Product que representa todos los productos disponibles.
   */
    
    getProducts(): Observable<Product[]> {
      const productsCollection = collection(this.firestore, 'products');
      return collectionData(productsCollection, { idField: 'id' }) as Observable<Product[]>;
    }
  

   /**
   * Obtiene un producto por su ID.
   * @param id El ID del producto que se desea obtener.
   * @return El objeto tipo Product que corresponde al ID proporcionado, o undefined si no se encuentra.
   */
    
   getProductById(id: string): Observable<Product | undefined> {
    const productDoc = doc(this.firestore, `products/${id}`);
    return docData(productDoc, { idField: 'id' }).pipe(
      map(product => product ? (product as Product) : undefined)
    );
  }
     /**
   * Agrega un producto al carrito de compras.
   * Si el producto ya existe en el carrito, incrementa la cantidad; de lo contrario, lo agrega con cantidad 1.
   * @param product El objeto tipo Product que se desea agregar al carrito.
   */

    addToCart(product: Product): void {
        let cart = this.getCart();
        const existingProduct = cart.find(item => item.product.id === product.id);
        if (existingProduct) {
          existingProduct.quantity++;
        } else {
          cart.push({ product, quantity: 1 });
        }
        this.updateCart(cart);
      }

      /**
   * Incrementa la cantidad de un producto en el carrito.
   * @param productId El ID del producto cuya cantidad se desea incrementar.
   */
    
      incrementQuantity(productId: number): void {
        let cart = this.getCart();
        const existingProduct = cart.find(item => item.product.id === productId);
        if (existingProduct) {
          existingProduct.quantity++;
        }
        this.updateCart(cart);
      }

      /**
   * Decrementa la cantidad de un producto en el carrito.
   * Si la cantidad alcanza 0, el producto se elimina del carrito.
   * @param productId El ID del producto cuya cantidad se desea decrementar.
   */
    
      decrementQuantity(productId: number): void {
        let cart = this.getCart();
        const existingProduct = cart.find(item => item.product.id === productId);
        if (existingProduct) {
          existingProduct.quantity--;
          if (existingProduct.quantity === 0) {
            cart = cart.filter(item => item.product.id !== productId);
          }
        }
        this.updateCart(cart);
      }

      /**
   * Obtiene el contenido actual del carrito de compras almacenado en localStorage.
   * @return Un arreglo de objetos que contiene cada producto en el carrito junto con su cantidad.
   */
    
      getCart(): { product: Product, quantity: number }[] {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
      }

      /**
   * Limpia el contenido del carrito de compras.
   * Elimina todos los productos del carrito y actualiza el estado almacenado en localStorage.
   */

      clearCart(): void {
        localStorage.removeItem('cart');
        this.cart.next([]);
      }

       /**
   * Actualiza el contenido del carrito de compras y lo guarda en localStorage.
   * @param cart El nuevo estado del carrito de compras que se desea guardar.
   */
    
      private updateCart(cart: { product: Product, quantity: number }[]): void {
        localStorage.setItem('cart', JSON.stringify(cart));
        this.cart.next(cart);
      }
}