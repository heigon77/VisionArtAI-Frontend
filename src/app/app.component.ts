import { Component, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DetectionService, Detection, StyleResult, DetectResponse } from './detection.service';

type State = 'idle' | 'loading' | 'done' | 'error';

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
  @ViewChild('dropzone') dropzone!: ElementRef<HTMLDivElement>;

  state: State = 'idle';
  dragging = false;
  previewUrl: string | null = null;
  annotatedUrl: string | null = null;
  detections: Detection[] = [];
  styleResult: StyleResult | null = null;
  poem: string = '';
  poemLines: string[] = [];
  showAnnotated = true;
  errorMsg = '';
  loadingMessage = '';

  private readonly loadingMessages = [
    'Scanning the artwork…',
    'Detecting objects…',
    'Classifying artistic style…',
    'Composing your poem…',
    'Finalising analysis…',
  ];
  private loadingInterval: ReturnType<typeof setInterval> | null = null;

  constructor(private svc: DetectionService, private cdr: ChangeDetectorRef) {}

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

  private startLoadingCycle() {
    let i = 0;
    this.loadingMessage = this.loadingMessages[0];
    this.loadingInterval = setInterval(() => {
      i = (i + 1) % this.loadingMessages.length;
      this.loadingMessage = this.loadingMessages[i];
      this.cdr.detectChanges();
    }, 2400);
  }

  private stopLoadingCycle() {
    if (this.loadingInterval) {
      clearInterval(this.loadingInterval);
      this.loadingInterval = null;
    }
  }

  processFile(file: File) {
    if (!file.type.startsWith('image/')) return;

    this.state = 'loading';
    this.detections = [];
    this.annotatedUrl = null;
    this.styleResult = null;
    this.poem = '';
    this.poemLines = [];
    this.startLoadingCycle();
    this.cdr.detectChanges();

    const reader = new FileReader();
    reader.onload = ev => { this.previewUrl = ev.target?.result as string; this.cdr.detectChanges(); };
    reader.readAsDataURL(file);

    this.svc.detect(file).subscribe({
      next: (res: DetectResponse) => {
        this.stopLoadingCycle();
        this.detections   = res.detections.sort((a, b) => b.confidence - a.confidence);
        this.annotatedUrl = `data:image/jpeg;base64,${res.annotated_image}`;
        this.styleResult  = res.style ?? null;
        this.poem         = res.poem ?? '';
        this.poemLines    = this.poem.split('\n').map(l => l.trim());
        this.state = 'done';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.stopLoadingCycle();
        console.error('Error:', err);
        this.errorMsg = 'Could not connect to the backend. Make sure the server is running.';
        this.state = 'error';
        this.cdr.detectChanges();
      },
    });
  }

  reset() {
    this.stopLoadingCycle();
    this.state = 'idle';
    this.previewUrl = null;
    this.annotatedUrl = null;
    this.detections = [];
    this.styleResult = null;
    this.poem = '';
    this.poemLines = [];
    this.cdr.detectChanges();
  }

  colorFor(id: number): string { return COLORS[id % COLORS.length]; }
  confidenceBar(conf: number): string { return `${Math.round(conf * 100)}%`; }
  styleConfidencePct(): string {
    return this.styleResult ? `${Math.round(this.styleResult.confidence * 100)}%` : '0%';
  }

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
