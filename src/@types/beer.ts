import { type } from "os"

export interface IBeer {
    id: string,
    name: string,
    tagline: string,
    first_brewed: string,
    description: string,
    image_url: string,
    ingredients?: IIngredients
    food_pairing?: [string]

}

export interface IIngredients {
    malt?: IMalt
    hops?: IHops
    yeast?: [string] | string
}

export interface IMalt {
    name: string,
    amount: { value: number, unit: string }
}

export interface IHops {
    name: string,
    amount: { value: number, unit: string },
    add: string,
    attribute: string
}