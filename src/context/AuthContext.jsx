import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch a user's profile row (which contains their role)
  async function fetchProfile(authUser) {
    if (!authUser) return null

    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, role, full_name, phone, address, area, banned')
      .eq('id', authUser.id)
      .single()

    if (error) {
      console.error('Profile fetch error:', error)
      // Fallback so the app doesn't break
      return {
        id: authUser.id,
        email: authUser.email,
        role: 'user',
        banned: false,
      }
    }
    return data
  }

  // On app load: restore session if one exists, and listen for auth changes
  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return
      const profile = await fetchProfile(session?.user)
      setUser(profile)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const profile = await fetchProfile(session?.user)
      setUser(profile)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  // LOGIN
  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw new Error(error.message)

    const profile = await fetchProfile(data.user)
    setUser(profile)
    return profile
  }

  // REGISTER
  // Expects form = { name, email, password, phone, address, area }
  async function register(form) {
    const { email, password, name, phone, address, area } = form

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          phone,
          address,
          area,
        },
      },
    })
    if (error) throw new Error(error.message)

    const profile = await fetchProfile(data.user)
    setUser(profile)
    return profile
  }

  // LOGOUT
  async function logout() {
    await supabase.auth.signOut()
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}