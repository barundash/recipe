import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appPlaceholder]'
})
export class PlaceholderDirective {

  /* View container Ref will give access to the place where this directive is used and has methods
   to create components in the place where its used. */
  constructor(public viewcontainerRef: ViewContainerRef) { }

}
