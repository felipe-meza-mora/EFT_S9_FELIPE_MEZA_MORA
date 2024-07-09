import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../service/order.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})

/**
 * Componente para la visualización de pedidos filtrados por usuario.
 * @description Este componente muestra una lista de pedidos filtrados según el correo electrónico del usuario almacenado en el local storage.
 */

export class OrdersComponent implements OnInit {

/**
   * Arreglo que contiene los pedidos filtrados por el correo electrónico del usuario.
   * @type {Order[]} Arreglo de objetos que representan los pedidos filtrados.
   */
pedidosFiltrados: Order[] = [];

  /**
   * Objeto que representa al usuario actual.
   * @type {any} Objeto que contiene la información del usuario.
   */
  usuario: any = null;

   /**
   * Correo electrónico utilizado como filtro para los pedidos.
   * @type {string} Correo electrónico del usuario utilizado para filtrar pedidos.
   */
  correoFiltro: string = '';

  /**
   * Nombre utilizado como filtro para los pedidos.
   * @type {string} Nombre del usuario utilizado para filtrar pedidos.
   */
  nombreFiltro: string = '';
 
  /**
   * Constructor del componente OrdersComponent.
   * @param {OrderService} orderService - Servicio para gestionar los pedidos.
   */
  constructor(private orderService: OrderService) {}

 /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Obtiene el usuario actual y los pedidos desde Firestore, y luego filtra los pedidos por el correo del usuario.
   */

  ngOnInit() {
    // Obtener el usuario del local storage
    const usuarioStorage = localStorage.getItem('sesionUsuario');
    if (usuarioStorage) {
      this.usuario = JSON.parse(usuarioStorage);

      this.correoFiltro = this.usuario.email;
      this.nombreFiltro = this.usuario.nombre;

      // Obtener los pedidos desde Firestore y filtrarlos
      this.filtrarPedidos();
    }
  }

  /**
   * Método para filtrar los pedidos basado en el correo electrónico del usuario.
   * Actualiza el arreglo `pedidosFiltrados` con los pedidos que coinciden con el correo del usuario.
   */

  filtrarPedidos() {
    if (this.correoFiltro) {
      this.orderService.getOrdersByEmail(this.correoFiltro).subscribe(pedidos => {
        this.pedidosFiltrados = pedidos;
      });
    } else {
      this.pedidosFiltrados = [];
    }
  }

}