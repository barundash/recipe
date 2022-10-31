/* This module will bundle all the routing functionalities. */

import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';


/* routes is an array of JS objects where each object represents a route. */
const routes: Routes = [
  /* Use of pathMatch: If we configure redirecting without pathmatch, we will always redirect the router
  because default matching strategy of the router is that, for the path it will see if its a prefix of the
  current path. So it will check that '' path is the part of the total path and actually it is a part of
  every path. If it was not '' but rather a text like 'something', this is not a part of every route. But
  empty path is a part of every route. Now pathMatch: 'full' overwrites the default match of prefix and would
  only redirect is the full path is empty i.e. ''. So no other path will be redirected. */
  {path: '', redirectTo: '/recipes', pathMatch: 'full'},

  /* --------------------------- lazy loading ------------------------------------------------------- */
  /* So RecipeModule, Shopping list module and auth module are the lazily loaded modules and app module
  is the eagerly loaded module */
  {path: 'recipes', loadChildren: './recipes/recipes.module#RecipesModule'},
  {path: 'shopping-list', loadChildren: './shopping-list/shopping-list.module#ShoppingListModule'},
  {path: 'auth', loadChildren: './auth-component/auth.module#AuthModule'}
  /* ------------------------------------------------------------------------------------------------ */
];

/* @NgModule decorator will convert a normal typescript class to a module. */
@NgModule({
  imports: [
    RouterModule.forRoot(routes,
      {preloadingStrategy: PreloadAllModules} /* Preloading lazy loaded code to avoid the delay due to lazy
      loading, so that the code bundles are available whenever we need them and they preloaded. We can see
      those files in the network tab of console. There we can see that all the files are pre loaded.*/
    )
  ],
  exports: [RouterModule] // This app routing module is exported so that it can be imported into app module.
})
export class AppRoutingModule { }
