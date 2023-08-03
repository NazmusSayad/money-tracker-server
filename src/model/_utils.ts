export function emailSchema() {
  return {
    type: String,
    lowercase: true,
    trim: true,
    unique: [true, 'Username already exists'],
    required: [true, 'User must have a username'],
    // @ts-ignore
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address',
    ],
  }
}

export function createdAtSchema(required = true) {
  return {
    required,
    type: Date,
    default: Date.now,
  }
}
