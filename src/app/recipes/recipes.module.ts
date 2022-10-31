/* This is a feature module to be exported to app module */

import { NgModule } from '@angular/core';
import { RecipesComponent } from './recipes.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeItemComponent } from './recipe-list/recipe-item/recipe-item.component';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RouterModule } from '@angular/router';
//import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RecipesRoutingModule } from './recipes-routing.module';
import { SharedModule } from '../shared/shared.module';

/*Although we are exporting this module to the app module we wont have access to the dectlared or imported
modules and components in app module. So we need to import or declare the required modules or components
here, except for services, for ex: HTTPClientModule which provides only the services.*/

@NgModule({
  declarations: [
    RecipesComponent,
    RecipeListComponent,
    RecipeDetailComponent,
    RecipeItemComponent,
    RecipeStartComponent,
    RecipeEditComponent
  ],
  imports: [
    RouterModule,
    //CommonModule, /* Gives access to *ngif and *ngfor just like Browser Module */
    SharedModule, /*its not useful here as shared module exports quite a few modules. But we need it only for
                   replacing common module */
    ReactiveFormsModule,
    RecipesRoutingModule,
  ], /*We can't access the components or modules outside this file. So we need to
  import the module if we want ot use it. Otherwise we will have compilation error.*/
})
export class RecipesModule {}
