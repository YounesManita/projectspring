import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Image } from '../../../interfaces/BlogPost';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit {
  @Input() images: {file: File, preview: string, description: string}[] = [];
  @Output() imagesChange = new EventEmitter<{file: File, preview: string, description: string}[]>();
  
  selectedFiles: FileList | null = null;
  currentImageIndex = 0;
  
  constructor() { }

  ngOnInit(): void {
  }

  onFileSelected(event: any): void {
    this.selectedFiles = event.target.files;
  }

  addImages(): void {
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      const filesToProcess = this.selectedFiles.length;
      let processedFiles = 0;
      
      for (let i = 0; i < this.selectedFiles.length; i++) {
        const file = this.selectedFiles[i];
        const reader = new FileReader();
        
        reader.onload = (e: any) => {
          this.images.push({
            file: file,
            preview: e.target.result,
            description: ''
          });
          
          processedFiles++;
          if (processedFiles === filesToProcess) {
            this.emitChanges();
          }
        };
        
        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(index: number): void {
    this.images.splice(index, 1);
    if (this.currentImageIndex >= this.images.length) {
      this.currentImageIndex = Math.max(0, this.images.length - 1);
    }
    this.emitChanges();
  }

  updateDescription(index: number, description: string): void {
    if (this.images[index]) {
      this.images[index].description = description;
      this.emitChanges();
    }
  }

  nextImage(): void {
    if (this.images.length > 0) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    }
  }

  prevImage(): void {
    if (this.images.length > 0) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
    }
  }

  private emitChanges(): void {
    this.imagesChange.emit([...this.images]);
  }
}