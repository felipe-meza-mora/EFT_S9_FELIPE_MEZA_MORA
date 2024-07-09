import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';
import { UsersService } from '../../service/users.service';
import { appConfig } from '../../app.config'; // Importa appConfig
import { of } from 'rxjs'

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let usersService: UsersService;

  beforeEach(async () => {
    const usersServiceMock = {
      getUsers: jasmine.createSpy('getUsers').and.returnValue(of([])),
      updateUsers: jasmine.createSpy('updateUsers').and.returnValue(Promise.resolve())
    };

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: usersService, useValue: usersServiceMock },
        ...appConfig.providers, // Usa todos los proveedores de appConfig
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    usersService = TestBed.inject(UsersService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
