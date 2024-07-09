import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { UsersComponent } from './users.component';
import { UsersService } from '../../service/users.service';
import { appConfig } from '../../app.config'; // Importa appConfig
import { of } from 'rxjs'

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let usersService: UsersService;

  beforeEach(async () => {
    const usersServiceMock = {
      insertUser: jasmine.createSpy('insertUser').and.returnValue(of({ success: true })),
      getUsers: jasmine.createSpy('getUsers').and.returnValue(of([])),
      deleteUsers: jasmine.createSpy('deleteUsers').and.returnValue(Promise.resolve()),
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

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    usersService = TestBed.inject(UsersService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
