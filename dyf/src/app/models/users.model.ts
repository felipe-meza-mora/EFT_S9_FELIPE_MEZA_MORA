/**
 * Interfaz que representa un usuario.
 * @description Define la estructura de datos para un usuario con sus propiedades principales.
 */
export interface User {
    /**
     * ID único del usuario.
     */
    id?: string;
  
    /**
     * Rut del usuario.
     */
    rut: string;
  
    /**
     * Nombre completo del usuario.
     */
    nombre: string;
  
    /**
     * Correo electrónico del usuario.
     */
    correo: string;
  
    /**
     * Contraseña del usuario.
     */
    password: string;
  
    /**
     * Permisos o roles asignados al usuario.
     */
    permisos?: string;
  
    /**
     * Número de teléfono del usuario.
     */
    telefono?: string;

    /**
     * Dirección del usuario.
     */
    direccionEnvio: string
  }