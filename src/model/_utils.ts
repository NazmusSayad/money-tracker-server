export function emailSchema() {
  return {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address',
    ] as any,
  }
}

export function createdAtSchema(required = true) {
  return {
    required,
    type: Date,
    default: Date.now,
  }
}
