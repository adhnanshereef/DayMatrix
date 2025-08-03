import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './components/navigation.component';
import { FooterComponent } from './components/footer.component';
import { AlertContainerComponent } from './components/alert-container.component';
import { SeoService } from './services/seo.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationComponent, FooterComponent, AlertContainerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('DayMatrix');
  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    // Initialize SEO for the current route
    this.seoService.updateSEOData();
  }
}
