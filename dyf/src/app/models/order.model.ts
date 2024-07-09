export interface Order {
    id: string;
    nombre: string;
    direccion: string;
    correo: string;
    telefono: string;
    total: number;
    detalle: {
      img: string;
      producto: string;
      cantidad: number;
      precio: number;
      subtotal: number;
    }[];
    estado: string;
  }