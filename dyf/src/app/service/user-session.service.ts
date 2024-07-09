import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Servicio para manejar la sesión del usuario en la aplicación.
 * Proporciona un observable para notificar cambios en la información del usuario.
 */

@Injectable({
  providedIn: 'root'
})
export class UserSessionService {

 /**
   * BehaviorSubject para almacenar y emitir la información del usuario.
   * Inicialmente, se establece en null.
   * @private
  */
  private userSubject = new BehaviorSubject<any>(null);
  
  /**
   * Observable que expone la información del usuario.
   * Se puede suscribir a este observable para recibir notificaciones de cambios en la información del usuario.
   */
  user$ = this.userSubject.asObservable();

   /**
   * Establece la información del usuario y emite el nuevo valor a los suscriptores.
   * @param user - Información del usuario a establecer.
   */

  setUser(user: any) {
    this.userSubject.next(user);
  }

   /**
   * Limpia la información del usuario y emite null a los suscriptores.
   */
  clearUser() {
    this.userSubject.next(null);
  }
}
