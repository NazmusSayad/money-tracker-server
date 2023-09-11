export type Prettify<T> = {
  [Key in keyof T]: T[Key]
} & {}