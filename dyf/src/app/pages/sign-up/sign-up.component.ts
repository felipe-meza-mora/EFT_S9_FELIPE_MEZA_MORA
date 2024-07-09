import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { UsersService } from '../../service/users.service';
import { User } from '../../models/users.model';
import { validarRut } from '../../validators/rut.validator';

/**
 * @description Componente para el formulario de registro de usuarios.
 * Este componente permite a los usuarios registrarse ingresando sus datos personales.
 */

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {

  formulario(formulario: any) {
    throw new Error('Method not implemented.');
  }

    /**
   * @description FormGroup que contiene los campos del formulario de registro.
   * @type {FormGroup}
   * @description Mensaje de éxito mostrado después de enviar el formulario de registro.
   * @type {string | null}
   */

  formRegistro!: FormGroup;
  mensajeExito: string | null = null;
  mensajeError: string | null = null;

  constructor(private f : FormBuilder, private usersService: UsersService) {}

  /**
   * @description Inicializa el formulario de registro con validadores personalizados.
   * Se llama al inicio del ciclo de vida del componente.
   * @usageNotes Llama este método en ngOnInit para configurar el formulario de registro.
   */

  ngOnInit(): void {
    this.formRegistro = this.f.group({
      rut: ['', [Validators.required,validarRut]],
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        this.passwordStrengthValidator
        
      ]],
      confirmPassword: ['', Validators.required],
      telefono: ['', Validators.required],
      direccionEnvio: ['',Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  /**
   * @description Validador personalizado para verificar que las contraseñas coincidan.
   * @param {AbstractControl} group Grupo de AbstractControl que contiene los campos password y confirmPassword.
   * @return {ValidationErrors | null} Objeto con errores si las contraseñas no coinciden, o null si coinciden.
   */

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

    /**
   * @description Validador personalizado para verificar la fuerza de la contraseña.
   * @param {AbstractControl} control AbstractControl que representa el campo de contraseña.
   * @return {ValidationErrors | null} Objeto con errores específicos si la contraseña no cumple con los requisitos, o null si es válida.
   */

  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    const errors: any = {};

     // Validación de requisitos de contraseña

    if (!/[A-Z]/.test(value)) {
      errors.missingUppercase = 'La contraseña debe contener al menos una letra mayúscula';
    }

    if (!/[a-z]/.test(value)) {
      errors.missingLowercase = 'La contraseña debe contener al menos una letra minúscula';
    }

    if (!/[0-9]/.test(value)) {
      errors.missingNumber = 'La contraseña debe contener al menos un número';
    }

    if (!/[@$!%*?&]/.test(value)) {
      errors.missingSpecial = 'La contraseña debe contener al menos un carácter especial (@$!%*?&)';
    }

    return Object.keys(errors).length ? errors : null;
  }

   /**
   * @description Maneja el envío del formulario de registro.
   * Guarda los datos del usuario en localStorage si el formulario es válido.
   * Muestra un mensaje de éxito y limpia el formulario después de 3 segundos.
   * @usageNotes Llama este método al hacer clic en el botón de enviar formulario en el template.
   */
   async submitForm():  Promise<void> {
    if (this.formRegistro.valid) {
      const rut = this.formRegistro.get('rut')?.value;

      try {
        const rutRegistered = await this.usersService.isRutRegistered(rut);

        if (rutRegistered) {
          this.mensajeError = 'El RUT ingresado ya está registrado.';
          setTimeout(() => {
            this.formRegistro.reset();
            this.mensajeError = null;
          }, 3000);
          return;
        }

        const nuevoUsuario: User = {
          rut: this.formRegistro.get('rut')?.value,
          nombre: this.formRegistro.get('nombre')?.value,
          correo: this.formRegistro.get('email')?.value,
          password: this.formRegistro.get('password')?.value,
          telefono: this.formRegistro.get('telefono')?.value,
          direccionEnvio: this.formRegistro.get('direccionEnvio')?.value,
          permisos: 'cliente'
        };

        await this.usersService.addUser(nuevoUsuario);

        const nombreUsuario = this.formRegistro.get('nombre')?.value;
        this.mensajeExito = `¡${nombreUsuario}, tu información ha sido guardada exitosamente!`;

        setTimeout(() => {
          this.formRegistro.reset();
          this.mensajeExito = null;
        }, 3000);

      } catch (error) {
        console.error("Error al registrar el usuario: ", error);
      }
    }
  }



   /**
   * @description Limpia el formulario de registro.
   * Restablece todos los campos del formulario a su estado inicial.
   * @usageNotes Llama este método al hacer clic en el botón de limpiar formulario en el template.
   */

  limpiarFormulario() {
    this.formRegistro.reset();
  }


}
