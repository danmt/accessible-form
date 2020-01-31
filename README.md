# Make it Accessible: Dealing with Form Errors in Angular

This article's intention is to show you how to handle errors in forms from the a11y angle. Forms are key in any web application, if we want to make truly inclusive apps it's mandatory to make sure the forms are usable by users with Screen Readers.

In one of my previous articles I talk about focus, usage of labels and more [tips to make your ReactiveForms more accessible](https://dev.to/thisdotmedia/reactiveforms-assume-the-worst-elh), but in this one we are going to talk only about error handling. We'll start with a simple form and include error handling. You can access this [repository with the base form](https://github.com/danmt/accessible-form/tree/base-form) I'll be using.

## The Problem

When doing applications for users with Screen Readers, things change a lot because we can't rely on visual cues, colors, sizes. Implementing a good error handling strategy can be challenging and on top of that, making it accessible? Sounds like a good challenge. A very common pattern is to show a text describing the error right below each input, usually in the color red. That is Okay, unless you want to make it understandable for Screen Reader users, that you would like to have a way to announce the user all the errors found.

## The Solution

The first thing is to have the errors formatted in a way that's easy for us to display the errors later. The next to figure out will be how to announce the user that there were errors. If I put it this way, it sounds quite easy, am I right?

## Implementation

Let's start by opening `src/app/app.component.ts` and get the errors from the form and format them in a way that's easier for us later.

```typescript
//...
export class AppComponent {
  errors = null;
  //...

  onSubmit() {
    //...
    if (this.form.invalid) {
      this.errors = {
        firstName: this.form.get('firstName').errors,
        lastName: this.form.get('lastName').errors,
        email: this.form.get('email').errors
      };
    } else {
      this.errors = null;
    }
  }
}
```

What I just did was simply creating a new property named `errors` and updated the `onSubmit` method, so now if the form is valid it will _clean up_ the errors, otherwise it will add all the errors found in the form to the `errors` property we just created.

Now let's go to `src/app/app.component.html` and let's show those errors to the user!

```html
<div class="form-errors" [ngClass]="{ active: submitted && errors }">
  <ng-container *ngIf="submitted && errors">
    There were errors found in the form.

    <ul class="form-errors-list" *ngIf="errors">
      <li *ngIf="errors.firstName?.required">First name is required</li>
      <li *ngIf="errors.lastName?.required">Last name is required</li>
      <li *ngIf="errors.email?.required">Email is required</li>
      <li *ngIf="errors.email?.email">Email has to be properly formatted</li>
    </ul>
  </ng-container>
</div>
```

We just created all we need to display the errors, you can put this piece of code anywhere in `src/app/app.component.html`.

That was easy, right? There's only one thing left to do, announcing it to the user. If you want to announce something to the user you can use `aria-live`. This attribute tells to Screen Readers that it has to announce to the users when its content change. For `aria-live` you can use either **pollite** or **assertive**, the difference is very simple, pollite waits until every other announce finish before announcing its content change, while assertive announces it as soon as possible.

This is all we need to do in `src/app/app.component.html`:

```html
<div
  class="form-errors"
  [ngClass]="{ active: submitted && errors }"
  aria-live="assertive"
>
  <!-- ... -->
</div>
```

There's a problem with our solution, now Screen Readers announce the errors, but is it easy to use?

Let's try to imagine we are trying to use the app without looking at it. We hear the announcement, now what? Press Tab? This will get you to the reset button. Press Shift + Tab? We could, but that means we have to remember where they were in the form. It would be better if we could navigate through the errors and when interacting with them, move focus to the input that had the error.

We can change our current solution in `src/app/app.component.html` like this:

```html
<div
  class="form-errors"
  [ngClass]="{ active: submitted && errors }"
  aria-live="assertive"
>
  <ng-container *ngIf="submitted && errors">
    There were errors found in the form.

    <ul class="form-errors-list" *ngIf="errors">
      <li *ngIf="errors.firstName?.required">
        <a href="#first-name-control">First name is required</a>
      </li>
      <li *ngIf="errors.lastName?.required">
        <a href="#last-name-control">Last name is required</a>
      </li>
      <li *ngIf="errors.email?.required">
        <a href="#email-control">Email is required</a>
      </li>
      <li *ngIf="errors.email?.email">
        <a href="#email-control">Email has to be properly formatted</a>
      </li>
    </ul>
  </ng-container>
</div>
```

If you are wondering what's the black magic behind focusing an input with an anchor, you can use the hash strategy to link to items in the current page by using its ID. That's why all the inputs in the base form have unique ids.

But there's more, after we get the announcement we still have to tab through until we get to the errors element. This could mean, in the worst case scenario, going through the whole page to get our hands on the errors links. We can improve this by making the errors element focusable but not tabbable, by using `tabindex=-1`,we cannot tab to the element but we can force the focus using Javascript. If we want to focus the element from the component, we'll need to have a reference to it, thankfully we can use a template reference variable and the `ViewChild` decorator for this.

All we need to do now is go to `src/app/app.component.ts` and do this:

```typescript
import { Component, ViewChild, ElementRef } from '@angular/core';
// ...

export class AppComponent {
  @ViewChild('errorsSection', { static: true }) errorsSection: ElementRef;
  // ...

  onSubmit() {
    // ...
    if (this.form.invalid) {
      //...
      this.errorsSection.nativeElement.focus();
    } else {
      this.errors = null;
    }
  }
}
```

And now go to `src/app/app.component.html` and do this:

```html
<div
  class="form-errors"
  #errorsSection
  tabindex="-1"
  [ngClass]="{ active: submitted && errors }"
>
  <!-- ... -->
</div>
```

NOTE: The key reason for not binding the form errors directly in the template, is to make it easier for users with Screen Readers. When things change in real time, it's harder to keep track of what's going on. By creating another errors property I can update only onSubmit, that way is easier to know what's going on.

## Conclusion

After just a few minutes we dramatically improved the user experience for Screen Reader users and also for users that rely on their keyboard. I personally love the way I can navigate through the errors to reach the respective input, making it very clear which is the input with the error. I like putting the errors at the beginning of the form, that way when I tab in the last error I get to the first input instead of out of the form.

Here's a [full working version of the code](https://github.com/danmt/accessible-form), in case you didn't follow along and you want to see it in action.
