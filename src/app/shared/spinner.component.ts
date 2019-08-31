import { Component, OnDestroy } from '@angular/core';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';

@Component({
  selector: 'app-spinner',
  template: `
  <div class="preloader" *ngIf="isSpinnerVisible">
        <div class="spinner">
          <div class="double-bounce1"></div>
          <div class="double-bounce2"></div>
        </div>
    </div>
    `,
  styles: [
    `
      .preloader {
        width: 100%;
        height: 100%;
        top: 0px;
        position: absolute;
        z-index: 99999;
        background: none;
        left: 0px;
      }
    `
  ]
})
export class SpinnerComponent implements OnDestroy {
  public isSpinnerVisible = true;

  constructor(private router: Router) {
    this.router.events.subscribe(
      event => {
        if (event instanceof NavigationStart) {
          this.isSpinnerVisible = true;
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          this.isSpinnerVisible = false;
        }
      },
      () => {
        this.isSpinnerVisible = false;
      }
    );
  }

  ngOnDestroy(): void {
    this.isSpinnerVisible = false;
  }
}
