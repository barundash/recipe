/* This dropdown directive would add a CSS class to the element where it is used once that element is
 clicked and removes the class when it is clicked again. The open CSS class will help in opening the
 dropdown menu. This open CSS class can be used directly inside a div element to work. But this directive
 will help in the toggle functionality while clicking. To listen to the click Host listener is added
 and it listens to a click event and a toggleOpen function is defined to perform a toggle operation during
 each click.
 To dynamically attach or dettach the CSS class (open) depending on isOpen variable, HostBinding is used.
 HostBinding allows us to bind to the properties of the element the directive is placed on. Here we are
 binding to the class property(array of all the classes) of that element and access open class within this
 array. So whenever isOpen is true, this CSS class is attached and dropdown is opened and whenever isOpen
 is false, this CSS class is dettached and dropdown closes.
 This directive is declared in the app module. This directive is used in recipe-detail component and header
 component.
 */

import { Directive, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[appDropdown] ' // to be used in the html code
})
export class DropdownDirective {

  @HostBinding('class.open') isOpen = false;

  constructor() { }

  @HostListener('click') toggleOpen() {
    this.isOpen = !this.isOpen;
  }

}


/*
If you want that a dropdown can also be closed by a click anywhere outside (which also means that a click
on one dropdown closes any other one, btw.), replace the code of dropdown.directive.ts by this one (placing
the listener not on the dropdown, but on the document):

import {Directive, ElementRef, HostBinding, HostListener} from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  @HostBinding('class.open') isOpen = false;
  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
  }
  constructor(private elRef: ElementRef) {}
}
*/

