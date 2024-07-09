import { Injectable } from '@angular/core';
import { Firestore, collection, query,where,doc ,getDocs, updateDoc, addDoc,QuerySnapshot, DocumentData } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { Order } from '../models/order.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private firestore: Firestore) {}

  /**
   * Guarda un pedido en Firestore.
   * @param order - Pedido a guardar.
   * @return {Promise<void>}
   */
    saveOrder(order: Omit<Order, 'id'>): Promise<void> {
        const ordersCollection = collection(this.firestore, 'orders');
        return addDoc(ordersCollection, order).then();
    }

    /**
   * Obtiene los pedidos filtrados por el correo del usuario desde Firestore.
   * @param email - Correo del usuario.
   * @return {Observable<Order[]>}
   */
    getOrdersByEmail(email: string): Observable<Order[]> {
        const ordersCollection = collection(this.firestore, 'orders');
        const q = query(ordersCollection, where('correo', '==', email));
        return from(getDocs(q)).pipe(
          map(snapshot => {
            return snapshot.docs.map(doc => doc.data() as Order);
          })
        );
    }

    /**
   * Obtiene todos los pedidos desde Firestore.
   * @return {Observable<Order[]>}
   */
    getAllOrders(): Observable<Order[]> {
        const ordersCollection = collection(this.firestore, 'orders');
        return from(getDocs(ordersCollection)).pipe(
          map((snapshot: QuerySnapshot<DocumentData>) => {
            return snapshot.docs.map(doc => {
              const data = doc.data() as Omit<Order, 'id'>;
              const id = doc.id;
              return { id, ...data } as Order;
            });
          })
        );
      }

  /**
   * Actualiza un pedido en Firestore.
   * @param {string} orderId - ID del pedido a actualizar.
   * @param {Order} order - Pedido actualizado.
   * @return {Promise<void>}
   */
  updateOrder(orderId: string, order: Order): Promise<void> {
    const orderDoc = doc(this.firestore, `orders/${orderId}`);
    return updateDoc(orderDoc, { ...order });
  }




}