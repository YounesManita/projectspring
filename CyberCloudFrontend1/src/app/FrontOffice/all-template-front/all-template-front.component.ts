import { Component } from '@angular/core';

@Component({
  selector: 'app-all-template-front',
  templateUrl: './all-template-front.component.html',
  styleUrls: ['./all-template-front.component.css']
})
export class AllTemplateFrontComponent {
// Fonction pour charger les scripts JavaScript dynamiquement
loadScript(path: string) {
  const script = document.createElement('script');
  script.src = path;
  script.async = true;
  script.onload = () => {
    console.log(`${path} has been loaded successfully!`);
  };
  script.onerror = (error) => {
    console.error(`Error loading script: ${path}`, error);
  };
  document.body.appendChild(script);
}

ngAfterViewInit(): void {
  // Charger les scripts nécessaires
  this.loadScript('https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js');
  this.loadScript('https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js');
  this.loadScript('assets/FrontOffice/daycare-website-template/lib/wow/wow.min.js');
  this.loadScript('assets/FrontOffice/daycare-website-template/lib/easing/easing.min.js');
  this.loadScript('assets/FrontOffice/daycare-website-template/lib/waypoints/waypoints.min.js');
  this.loadScript('assets/FrontOffice/daycare-website-template/lib/lightbox/js/lightbox.min.js');
  this.loadScript('assets/FrontOffice/daycare-website-template/lib/owlcarousel/owl.carousel.min.js');
  this.loadScript('assets/FrontOffice/daycare-website-template/js/main.js');
}
}
