import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { OrderService } from '../../service/order.service';
import { appConfig } from '../../app.config';
import { of } from 'rxjs'
import { OrdersComponent } from './orders.component';
import { or } from '@angular/fire/firestore';

describe('OrdersComponent', () => {
  let component: OrdersComponent;
  let fixture: ComponentFixture<OrdersComponent>;
  let orderService: OrderService;

  beforeEach(async () => {
    const orderServiceMock = {
      getOrders: jasmine.createSpy('getOrders').and.returnValue(of([])),
      updateOrders: jasmine.createSpy('updateOrders').and.returnValue(Promise.resolve())
    };

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: orderService, useValue: orderServiceMock },
        ...appConfig.providers, // Usa todos los proveedores de appConfig
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});
