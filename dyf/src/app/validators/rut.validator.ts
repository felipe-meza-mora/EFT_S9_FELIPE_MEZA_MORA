import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Función personalizada para validar un RUT chileno.
 * @description Valida el formato y el dígito verificador de un RUT chileno.
 * @param {AbstractControl} control - Control de formulario que contiene el valor del RUT.
 * @returns {ValidationErrors | null} Objeto de errores si el RUT es inválido o null si es válido.
 */


export function validarRut(control: AbstractControl): ValidationErrors | null {
  const rut = control.value;
  if (!rut) {
    return null; // No se valida si el campo está vacío.
  }

  // Eliminar puntos y guiones del RUT
  const rutSinFormato = rut.replace(/[^0-9kK]/g, '');

  // Validar formato
  if (!/^[0-9]+[kK0-9]$/.test(rutSinFormato)) {
    return { rutInvalido: true };
  }

  // Validar dígito verificador
  const rutSinDv = rutSinFormato.slice(0, -1);
  const dv = rutSinFormato.slice(-1).toLowerCase();
  let suma = 0;
  let multiplicador = 2;

  for (let i = rutSinDv.length - 1; i >= 0; i--) {
    suma += parseInt(rutSinDv[i], 10) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const dvEsperado = 11 - (suma % 11);
  const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'k' : dvEsperado.toString();

  if (dv !== dvCalculado) {
    return { rutInvalido: true };
  }

  return null;
}
