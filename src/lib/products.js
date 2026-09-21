import { supabase } from './supabaseClient'

export async function uploadProduct(file, productData) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not logged in')

  const filePath = `${user.id}/${Date.now()}-${file.name}`
  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, file)

  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath)

  const { data, error } = await supabase
    .from('products')
    .insert({
      user_id: user.id,
      name: productData.name,
      description: productData.description,
      price: productData.price,
      category: productData.category,
      image_url: publicUrl,
      status: 'pending'
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getMyProducts() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not logged in')

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getProductForVendor(id) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not logged in')

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()
  if (error) throw error
  return data
}

export async function updateProduct(id, updates) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteProduct(id) {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}

// Admin functions
export async function getAllProducts() {
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  if (productsError) throw productsError

  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, email')
  if (profilesError) throw profilesError

  const emailById = Object.fromEntries(profiles.map((p) => [p.id, p.email]))

  return products.map((p) => ({
    ...p,
    profiles: { email: emailById[p.user_id] || 'Unknown' },
  }))
}

export async function approveProduct(id) {
  const { data, error } = await supabase
    .from('products')
    .update({ status: 'approved' })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getAllUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function updateUserRole(id, role) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function toggleBanUser(id, banned) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ banned })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

// Public shop functions
export async function getApprovedProducts({ category, search, sort } = {}) {
  let query = supabase
    .from('products')
    .select('*')
    .eq('status', 'approved')

  if (category) query = query.eq('category', category)
  if (search) query = query.ilike('name', `%${search}%`)

  if (sort === 'price_asc') query = query.order('price', { ascending: true })
  else if (sort === 'price_desc') query = query.order('price', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getProductById(id) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('status', 'approved')
    .single()
  if (error) throw error
  return data
}