import { Injectable } from '@angular/core';
import { User } from '../models/users.model';
import { Firestore,collection,addDoc,doc,query,deleteDoc,getDocs,where,updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsersService{
 
   /**
     * Servicio para la gestión de usuarios.
     * Proporciona métodos para agregar, actualizar, y eliminar usuarios en Firestore.
     */
  
  private usersCollection = collection(this.firestore, 'users');
  constructor(private firestore : Firestore) { }

  /**
     * Añade un nuevo usuario a la colección de usuarios en Firestore.
     * @param usuario El usuario que se añadirá a Firestore.
     * @returns Una promesa que se resuelve cuando se completa la operación de añadir el usuario.
     */
  
  addUser(user: User): Promise<void> {
    return addDoc(this.usersCollection, user).then(() => {});
  }

   /**
   * Verifica si existe un usuario con el RUT proporcionado en Firestore.
   * @param rut RUT del usuario a verificar.
   * @returns Una promesa que se resuelve con true si el RUT está registrado, de lo contrario false.
   */

  async isRutRegistered(rut: string): Promise<boolean> {
    const q = query(this.usersCollection, where('rut', '==', rut));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }

  /**
   * Verifica si existe un usuario con el correo electrónico proporcionado en Firestore.
   * @param email Correo electrónico del usuario a verificar.
   * @returns Una promesa que se resuelve con true si el correo electrónico está registrado, de lo contrario false.
   */

  async isEmailRegistered(email: string): Promise<boolean> {
    const q = query(this.usersCollection, where('correo', '==', email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }

    /**
   * Valida las credenciales de inicio de sesión de un usuario en Firestore.
   * @param email Correo electrónico del usuario.
   * @param password Contraseña del usuario.
   * @returns Una promesa que se resuelve con los datos del usuario si las credenciales son válidas, de lo contrario null.
   */

  async validateUser(email: string, password: string): Promise<User | null> {
    const q = query(this.usersCollection, where('correo', '==', email), where('password', '==', password));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return userDoc.data() as User;
    }
    return null;
  }
  
    /**
   * Actualiza la contraseña de un usuario en Firestore.
   * @param email Correo electrónico del usuario cuya contraseña se actualizará.
   * @param newPassword Nueva contraseña del usuario.
   * @returns Una promesa que se resuelve cuando se completa la actualización de la contraseña.
   */

  async updatePassword(email: string, newPassword: string): Promise<void> {
    const q = query(this.usersCollection, where('correo', '==', email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userRef = doc(this.firestore, 'users', userDoc.id);
      await updateDoc(userRef, { password: newPassword });
    }
  }

   /**
   * Actualiza los datos de un usuario en Firestore.
   * @param user Objeto parcial del usuario con los campos a actualizar.
   * @returns Una promesa que se resuelve cuando se completa la actualización de los datos del usuario.
   * @throws Error si el correo electrónico del usuario no está definido.
   */

 async updateUser(user: Partial<User>): Promise<void> {
    if (!user.correo) {
      throw new Error('Email is required to update user');
    }

    const q = query(this.usersCollection, where('correo', '==', user.correo));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userRef = doc(this.firestore, 'users', userDoc.id);

      // Filtrar los campos undefined y conservar el tipo Partial<User>
      const userData: Partial<User> = Object.fromEntries(
        Object.entries(user).filter(([_, v]) => v !== undefined)
      ) as Partial<User>;

      await updateDoc(userRef, userData);
    }
  }

   /**
   * Obtiene todos los usuarios de la colección en Firestore.
   * @returns Una promesa que se resuelve con un arreglo de usuarios.
   * @throws Error si ocurre un problema al obtener los usuarios.
   */

  async getUsers(): Promise<User[]> {
    try {
      const querySnapshot = await getDocs(collection(this.firestore, 'users'));
      const users: User[] = [];
      querySnapshot.forEach(doc => {
        const userData = doc.data() as User;
        const user: User = { ...userData, id: doc.id };
        users.push(user);
      });
      return users;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  }

   /**
   * Elimina un usuario de Firestore según su ID.
   * @param id ID del usuario que se eliminará.
   * @returns Una promesa que se resuelve cuando se completa la eliminación del usuario.
   */

  deleteUser(id: string): Promise<void> {
    const userDoc = doc(this.firestore, `users/${id}`);
    return deleteDoc(userDoc);
  }

}
