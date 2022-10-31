import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipesComponent } from './recipes.component';
import { AuthGuardService } from '../auth-component/auth.guard.service';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeResolverService } from './recipe-resolver.service';

const routes: Routes = [
  /* We use the canActivate guard key here which takes an array of all the guards present. */
  {path: '', component: RecipesComponent, canActivate: [AuthGuardService] , children: [
    /* Child routes are the routes to be used for executing child components inside Recipes component.
    The moment recipe component is triggerred, it should trigger the recipeStart component. :id is a dynamic
    segment after /recipes which is used for the selection of recipes based on ids. Now how do we trigger
    the recipe through id in recipe-detail component. So the id should be passed into the recipe-detail
    component through the router. This is achieved through ActivatedRoute in the reciep-detail component. */
    {path: '', component: RecipeStartComponent },
    { path: 'new', component: RecipeEditComponent },
    /* Once :id has been assigned to the route, the upcoming routes will consider the paths to be ids. So
    if 'new' was declared after ':id', 'new' would also be treated as an id and would throw an error as it is not
    actually an id. So in short, any hardcoded path should be assigned befor the dynamic paths. */
    /* The recipe resolver is used in both id and edit route to load the recipes whenever the routing location
    is reloaded. */
    {path: ':id', component: RecipeDetailComponent, resolve: [RecipeResolverService] },
    { path: ':id/edit', component: RecipeEditComponent, resolve: [RecipeResolverService] }
  ]},
];

@NgModule({
  imports: [
    RouterModule.forChild(routes) /* for child is used as recipe component works as a child for app
    component and is imported to recipes module */
  ],
  exports: [RouterModule]
})
export class RecipesRoutingModule {}
