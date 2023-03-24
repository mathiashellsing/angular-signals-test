import 'zone.js/dist/zone';
import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { signal } from './signals/signal';
import { computed } from './signals/computed';
import { effect } from './signals/effect';
import { TestArraysCmp } from './testing-arrays.component';
import { TestObjectsCmp } from './testing-objects.component';

/*
  ⚠️ Please keep in mind that this is only the signals implementation. We still depend on zone and current CD strategy to propagate change in the template which might not be the case when Angular releases signals officially!
*/

// Signals are primitives, so we can use them outside the component class
const myValue = signal(10000);

effect(() => {
  console.log('MyValue changed', myValue());
});

// Uncomment this
// setInterval(() => {
//   myValue.update((s) => s - 1);
// }, 1000);

@Component({
  selector: 'my-app',
  standalone: true,
  template: `
    <div>Count: {{ count() }}</div>
    <div>Double: {{ double() }}</div>

    <button (click)="inc()">Increase</button>
    <button (click)="reset()">Reset</button>

    <br>
    <!-- <test-arrays /> -->
    <!-- <test-objects /> -->

  `,
  imports: [TestArraysCmp, TestObjectsCmp],
})
export class App {
  count = signal(0);

  double = computed(() => this.count() * 2);

  countType = computed(() => (this.count() % 2 === 0 ? 'even' : 'odd'));

  constructor() {
    effect(() => {
      console.log('Count changed', this.count());
      console.log(this.count(), 'is', this.countType());
    });
  }

  inc() {
    this.count.update((c) => c + 1);
  }

  reset() {
    this.count.set(0);
  }
}

bootstrapApplication(App);
