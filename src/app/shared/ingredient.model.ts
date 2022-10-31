/* Ingredient model is used in recipe component as well as in shopping list component. So it is defined in
the shared folder */

export class Ingredient {
  constructor(public name: string, public amount: number) {

  }
}
