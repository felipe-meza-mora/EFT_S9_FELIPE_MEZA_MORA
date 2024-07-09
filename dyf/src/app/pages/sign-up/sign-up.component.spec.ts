import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SignUpComponent } from './sign-up.component';
import { UsersService } from '../../service/users.service';
import { appConfig } from '../../app.config'; // Importa appConfig
import { of } from 'rxjs';

/**
 * Suite de pruebas para SignUpComponent.
 */
describe('SignUpComponent', () => {

  let component:SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let usersService: UsersService;


  beforeEach(async () => {
    const usersServiceMock = {
      insertUser: jasmine.createSpy('insertUser').and.returnValue(of({ success: true })),
      getUsers: jasmine.createSpy('getUsers').and.returnValue(of([])),
      deleteUsers: jasmine.createSpy('deleteUsers').and.returnValue(Promise.resolve()),
      updateUsers: jasmine.createSpy('updateUsers').and.returnValue(Promise.resolve()),
      isRutRegistered: jasmine.createSpy('isRutRegistered').and.returnValue(of(false)),
    };

    // Configuración del entorno de pruebas de Angular
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: usersService, useValue: usersServiceMock },
        ...appConfig.providers,
      ]
    }).compileComponents();
    
     // Crea una instancia del componente y obtiene el fixture
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    usersService = TestBed.inject(UsersService);
    fixture.detectChanges();
  });


  // Prueba: Debería asegurarse de que el componente se crea correctamente
  it('Debería crear', () => {
    expect(component).toBeTruthy();
  });
 
    // Prueba: Debería inicializar el formulario de registro
  it('Debería inicializar el formulario ', () => {
    expect(component.formRegistro).toBeDefined();
    expect(component.formRegistro.get('rut')).toBeDefined();
    expect(component.formRegistro.get('nombre')).toBeDefined();
    expect(component.formRegistro.get('email')).toBeDefined();
    expect(component.formRegistro.get('password')).toBeDefined();
    expect(component.formRegistro.get('confirmPassword')).toBeDefined();
    expect(component.formRegistro.get('telefono')).toBeDefined();
    expect(component.formRegistro.get('direccionEnvio')).toBeDefined();
  });

  afterEach(() => {
    component.formRegistro.reset();
  });
  
  // Prueba: Debería requerir que las contraseñas coincidan
  it('Debería requerir que las contraseñas coincidan', () => {
    const form = component.formRegistro;
    if (form !== null && form !== undefined) {
      form.patchValue({
        password: 'Password123!',
        confirmPassword: 'DifferentPassword123!'
      });

      expect(form.valid).toBeFalsy();
      expect(form.hasError('passwordMismatch')).toBeTruthy();
    }
  });
  
  // Prueba: Debería requerir al menos una letra mayúscula en la contraseña
  it('Debería requerir al menos una letra mayúscula en la contraseña', () => {
    const form = component.formRegistro;
    if (form !== null && form !== undefined) {
      form.patchValue({
        password: 'password123!',
      });

      expect(form.valid).toBeFalsy();
      expect(form.get('password')?.hasError('missingUppercase')).toBeTruthy();
    }
  });

  // Prueba: Debería requerir al menos una letra minúscula en la contraseña
  it('Debería requerir al menos una letra minúscula en la contraseña', () => {
    const form = component.formRegistro;
    if (form !== null && form !== undefined) {
      form.patchValue({
        password: 'PASSWORD123!',
      });

      expect(form.valid).toBeFalsy();
      expect(form.get('password')?.hasError('missingLowercase')).toBeTruthy();
    }
  });
  
  // Prueba: Debería requerir al menos un número en la contraseña
  it('Debería requerir al menos un número en la contraseña', () => {
    const form = component.formRegistro;
    if (form !== null && form !== undefined) {
      form.patchValue({
        password: 'Password!',
      });

      expect(form.valid).toBeFalsy();
      expect(form.get('password')?.hasError('missingNumber')).toBeTruthy();
    }
  });

});