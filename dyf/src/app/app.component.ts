import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

/**
 * Componente raíz de la aplicación Angular.
 * @description Este componente representa el contenedor principal de la aplicación.
 * Incluye los componentes de encabezado (`HeaderComponent`) y pie de página (`FooterComponent`),
 * así como el enrutador (`RouterOutlet`) para la navegación entre vistas.
 */

export class AppComponent {
  title = 'dyf';
}
