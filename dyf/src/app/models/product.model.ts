/**
 * Interfaz que representa un producto.
 * @description Define la estructura de datos para un producto con sus propiedades principales.
 */

export interface Product{
    /** Precio del producto */
    precio: number;
    /** ID único del producto */
    id: number;
    /** Categoría a la que pertenece el producto */
    categoria: string;
     /** Marca del producto */
    marca: string;
    /** Título o nombre del producto */
    title: string;
    /** Descripción detallada del producto */
    descripcion: string;
    /** URL de la imagen miniatura del producto */
    thumbnailUrl: string;
}