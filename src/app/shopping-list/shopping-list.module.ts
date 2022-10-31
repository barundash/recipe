import { NgModule } from '@angular/core';
import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
//import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingEditComponent
  ],
  imports: [
    RouterModule.forChild([{path: '', component: ShoppingListComponent}]),
    FormsModule,
    SharedModule /*its not useful here as shared module exports quite a few modules. But we need it only for
                 replacing common module */
    //CommonModule
  ]
})
export class ShoppingListModule {}
