/* Core Module is being created to import all the services present in the app module here and export this
module into the app module. This is one of the cleanup processes in the app module.*/

import { NgModule } from '@angular/core';
import { RecipeService } from './recipes/recipes.service';
import { ShoppingListService } from './shopping-list/shopping-list.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './auth-component/auth.interceptor.service';

@NgModule({
  providers: [
    ShoppingListService,
    RecipeService,
    {
      /* Auth interceptor is added here using provide keyword, useclass and multi=true to allow multiple
      interceptors. */
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ]
})
export class CoreModule {}
