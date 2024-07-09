import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../service/users.service';
import { CommonModule } from '@angular/common';
import { User } from '../../models/users.model';

// Declaramos la variable bootstrap para acceder a los componentes de Bootstrap
declare var bootstrap: any; 

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: User[] = []; // Arreglo que almacenará la lista de usuarios
  isAdmin: boolean = false; // Indica si el usuario actual es administrador

  selectedUser: User | undefined; // Usuario seleccionado para operaciones como eliminación

 /**
   * Constructor del componente UsersComponent.
   * @param usersService Servicio que maneja las operaciones relacionadas con los usuarios.
   */

  constructor(private usersService: UsersService) {}

   /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Carga la lista de usuarios al iniciar el componente y establece isAdmin en true (simulado para demostración).
   */

  ngOnInit(): void {
    this.loadUsers();
    this.isAdmin = true;
  }

  /**
   * Carga la lista de usuarios desde el servicio.
   * Maneja cualquier error que ocurra durante la carga.
   */

  async loadUsers(): Promise<void> {
    try {
      this.users = await this.usersService.getUsers();
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  }

   /**
   * Abre el modal de confirmación para eliminar un usuario.
   * @param user Usuario seleccionado para eliminar.
   */

  openDeleteModal(user: User): void {
    this.selectedUser = user;
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteUserModal'));
    deleteModal.show();
  }

   /**
   * Elimina un usuario seleccionado.
   * Realiza la operación de eliminación a través del servicio y maneja la respuesta.
   * Muestra un toast de confirmación al eliminar con éxito.
   */

  deleteUser(): void {
    if (this.selectedUser && this.selectedUser.id) {
      this.usersService.deleteUser(this.selectedUser.id.toString())
        .then(() => {
          console.log('Usuario eliminado con éxito');
          this.showToast(`${this.selectedUser?.nombre} ha sido eliminado.`);
          this.loadUsers();
          
          const modalElement = document.getElementById('deleteUserModal');
          if (modalElement) {
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
              modalInstance.hide(); // Oculta el modal después de eliminar el usuario
            } else {
              console.warn('No se encontró una instancia de la modal.');
            }
          } else {
            console.warn('No se encontró el elemento de la modal en el DOM.');
          }
        })
        .catch(error => {
          console.error('Error al eliminar Usuario', error);  // Manejo de errores al eliminar usuario
        });
    } else {
      console.warn('No se puede eliminar usuario porque selectedUser o su ID son undefined.');
    }
  }

   /**
   * Muestra un toast de Bootstrap con el mensaje proporcionado.
   * @param message Mensaje a mostrar en el toast.
   */
  private showToast(message: string): void {
    const toastElement = document.getElementById('liveToast');
    const toastBodyElement = document.getElementById('toast-body');

    if (toastBodyElement) {
      toastBodyElement.innerText = message;
    }

    if (toastElement) {
      const toast = new bootstrap.Toast(toastElement);
      toast.show();
    }
  }

}