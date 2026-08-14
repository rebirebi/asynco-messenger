import { Directive,ElementRef,HostListener, Input,Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class Highlight {
  constructor(private renderer: Renderer2, private el: ElementRef) { }

  @Input() highlightColor: string = 'yellow';

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.highlightColor)
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight('');
  }

  private highlight(color: string) {
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', color);
    this.renderer.setStyle(this.el.nativeElement, 'color', color?'black':'white');
  }

}
