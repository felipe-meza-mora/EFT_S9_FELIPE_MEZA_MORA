/**
 * Interfaz que representa un pedido.
 * @interface Order
 */
export interface Order {
  /**
   * Identificador único del pedido.
   * @type {string}
   */
  id: string;

  /**
   * Nombre del cliente que realiza el pedido.
   * @type {string}
   */
  nombre: string;

  /**
   * Dirección de entrega del pedido.
   * @type {string}
   */
  direccion: string;

  /**
   * Correo electrónico del cliente que realiza el pedido.
   * @type {string}
   */
  correo: string;

  /**
   * Teléfono de contacto del cliente que realiza el pedido.
   * @type {string}
   */
  telefono: string;

  /**
   * Total del costo del pedido.
   * @type {number}
   */
  total: number;

  /**
   * Detalle de los productos incluidos en el pedido.
   * @type {{
   *   img: string;
   *   producto: string;
   *   cantidad: number;
   *   precio: number;
   *   subtotal: number;
   * }[]}
   */
  detalle: {
    /**
     * URL de la imagen del producto.
     * @type {string}
     */
    img: string;

    /**
     * Nombre del producto.
     * @type {string}
     */
    producto: string;

    /**
     * Cantidad del producto en el pedido.
     * @type {number}
     */
    cantidad: number;

    /**
     * Precio unitario del producto.
     * @type {number}
     */
    precio: number;

    /**
     * Subtotal del producto (precio unitario * cantidad).
     * @type {number}
     */
    subtotal: number;
  }[];

  /**
   * Estado actual del pedido (e.g., "Procesado", "En preparación", "En despacho", "Entregado").
   * @type {string}
   */
  estado: string;
}