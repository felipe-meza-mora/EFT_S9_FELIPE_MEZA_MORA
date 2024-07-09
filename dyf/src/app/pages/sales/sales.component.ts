import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../service/order.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css'
})

/**
 * Componente para la gestión de ventas y pedidos.
 * @description Este componente muestra la lista de pedidos y permite actualizar su estado.
 */

export class SalesComponent implements OnInit {

 /**
   * Arreglo que contiene todos los pedidos.
   * @type {Order[]} Arreglo de objetos que representan los pedidos almacenados.
   */
 pedidos: Order[] = [];

  /**
   * Objeto que representa al usuario actual.
   * @type {any} Objeto que contiene la información del usuario actualmente autenticado.
   */
  usuario: any = null;

  /**
   * String que indica los permisos del usuario.
   * @type {string} String que describe los permisos del usuario actual.
   */
  permisos: string = '';

  /**
   * Constructor del componente.
   * @param {OrderService} orderService - Servicio para gestionar los pedidos.
   */
  constructor(private orderService: OrderService) {}

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Obtiene los datos del usuario y los pedidos del almacenamiento local.
   */

  ngOnInit() {
    // Obtener el usuario del local storage
    const usuarioStorage = localStorage.getItem('usuario');
    if (usuarioStorage) {
      this.usuario = JSON.parse(usuarioStorage);
      this.permisos = this.usuario.permisos;
    }

     // Obtener los pedidos de Firestore
     this.orderService.getAllOrders().subscribe((orders: Order[]) => {
      this.pedidos = orders;
    });
  }

  /**
   * Método para actualizar el estado de un pedido.
   * @param {Order} pedido - El pedido que se desea actualizar.
   * @param {string} nuevoEstado - El nuevo estado que se asignará al pedido.
   */
  actualizarEstado(pedido: Order, nuevoEstado: string) {
    pedido.estado = nuevoEstado;
    this.orderService.updateOrder(pedido.id, pedido).then(() => {
      console.log('Pedido actualizado con éxito');
    }).catch(error => {
      console.error('Error actualizando el pedido:', error);
    });
  }
}