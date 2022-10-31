import { NgModule } from '@angular/core';
import { AlertComponent } from './alert/alert.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { DropdownDirective } from './dropdown.directive';
import { CommonModule } from '@angular/common';
import { PlaceholderDirective } from './placeholder.directive';

@NgModule({
  declarations: [
    AlertComponent,
    LoadingSpinnerComponent,
    DropdownDirective,
    PlaceholderDirective
  ],
  imports: [
    CommonModule /* Used accross recipe module and in shopping list module */
  ],
  exports: [
    AlertComponent,
    LoadingSpinnerComponent,
    PlaceholderDirective,
    DropdownDirective,
    CommonModule
  ],
  entryComponents: [
    AlertComponent
  ], /* For components created without using selectors or routes. This is not needed for projects using
  version 9 or higher. This is propmpting to create Alert component in Auth comp ts file.*/
})
export class SharedModule {}
