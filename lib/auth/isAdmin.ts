// Helper to determine if an authenticated user has Admin privileges
export function isAdminUser(email?: string | null): boolean {
  if (!email) return false
  const cleanEmail = email.toLowerCase().trim()

  // 1. Default project owner
  if (cleanEmail === 'sonukr99770@gmail.com') {
    return true
  }

  // 2. Custom emails configured via ADMIN_EMAIL or NEXT_PUBLIC_ADMIN_EMAIL
  const envAdmin = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL
  if (envAdmin) {
    const allowed = envAdmin
      .split(',')
      .map((e) => e.toLowerCase().trim())
      .filter(Boolean)
    if (allowed.includes(cleanEmail)) {
      return true
    }
  }

  return false
}
