import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './home.component'; // Importa HomeComponent
import { ProductService } from '../../service/product.service';
import { appConfig } from '../../app.config'; // Importa appConfig
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let productService: ProductService;

  beforeEach(async () => {
    const productServiceMock = {
      getProducts: jasmine.createSpy('getProducts').and.returnValue(of([])),
      addToCart: jasmine.createSpy('addToCart'),
      deleteProduct: jasmine.createSpy('deleteProduct').and.returnValue(Promise.resolve()),
      updateProduct: jasmine.createSpy('updateProduct').and.returnValue(Promise.resolve())
    };

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        ...appConfig.providers, // Usa todos los proveedores de appConfig
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});