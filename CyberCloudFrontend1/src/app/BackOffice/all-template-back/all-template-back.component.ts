import { Component } from '@angular/core';

@Component({
  selector: 'app-all-template-back',
  templateUrl: './all-template-back.component.html',
  styleUrls: ['./all-template-back.component.css']
})
export class AllTemplateBackComponent {
  loadScript(path: string) {
    const script = document.createElement('script');
    script.src = path;
    script.async = true;
    document.body.appendChild(script);
  }
  
  ngAfterViewInit(): void {
    this.loadScript('assets/BackOffice/purple-free/src/assets/js/dashboard.js');
    this.loadScript('assets/BackOffice/purple-free/src/assets/js/off-canvas.js');
    this.loadScript('assets/BackOffice/purple-free/src/assets/js/todolist.js');
  }
  
  
}
