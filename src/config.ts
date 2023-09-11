export const USER_PUBLIC_DATA_KEYS = ['name', 'avatar'] as const
export const USER_SAFE_DATA_KEYS = [
  ...USER_PUBLIC_DATA_KEYS,
  'email',
  'createdAt',
  'isVerified',
] as const
