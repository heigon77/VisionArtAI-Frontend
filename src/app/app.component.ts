import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DetectionService, Detection, DetectResponse } from './detection.service';

type State = 'idle' | 'loading' | 'done' | 'error';

// Palette for bounding boxes (cycles through classes)
const COLORS = [
  '#C9A84C', '#E07B54', '#7EC8A4', '#A78BFA',
  '#F472B6', '#60A5FA', '#34D399', '#FB923C',
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('dropzone') dropzone!: ElementRef<HTMLDivElement>;

  state: State = 'idle';
  dragging = false;
  previewUrl: string | null = null;
  annotatedUrl: string | null = null;
  detections: Detection[] = [];
  showAnnotated = true;
  errorMsg = '';

  constructor(private svc: DetectionService) {}

  // ── Drag & Drop ───────────────────────────────────────────────
  onDragOver(e: DragEvent) { e.preventDefault(); this.dragging = true; }
  onDragLeave()             { this.dragging = false; }
  onDrop(e: DragEvent) {
    e.preventDefault();
    this.dragging = false;
    const file = e.dataTransfer?.files[0];
    if (file) this.processFile(file);
  }
  onFileInput(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) this.processFile(file);
  }

  // ── Core ──────────────────────────────────────────────────────
  processFile(file: File) {
    if (!file.type.startsWith('image/')) return;

    this.state = 'loading';
    this.detections = [];
    this.annotatedUrl = null;

    // Show original preview immediately
    const reader = new FileReader();
    reader.onload = ev => this.previewUrl = ev.target?.result as string;
    reader.readAsDataURL(file);

    this.svc.detect(file).subscribe({
      next: (res: DetectResponse) => {
        this.detections = res.detections
          .sort((a, b) => b.confidence - a.confidence);
        this.annotatedUrl = `data:image/jpeg;base64,${res.annotated_image}`;
        this.state = 'done';
      },
      error: () => {
        this.errorMsg = 'Erro ao conectar com o backend. Verifique se está rodando.';
        this.state = 'error';
      },
    });
  }

  reset() {
    this.state = 'idle';
    this.previewUrl = null;
    this.annotatedUrl = null;
    this.detections = [];
  }

  // ── Helpers ───────────────────────────────────────────────────
  colorFor(id: number): string { return COLORS[id % COLORS.length]; }

  confidenceBar(conf: number): string { return `${Math.round(conf * 100)}%`; }

  uniqueClasses(): { name: string; count: number; color: string }[] {
    const map = new Map<string, { count: number; id: number }>();
    for (const d of this.detections) {
      const cur = map.get(d.class_name) ?? { count: 0, id: d.class_id };
      map.set(d.class_name, { count: cur.count + 1, id: d.class_id });
    }
    return Array.from(map.entries())
      .map(([name, v]) => ({ name, count: v.count, color: this.colorFor(v.id) }))
      .sort((a, b) => b.count - a.count);
  }
}
