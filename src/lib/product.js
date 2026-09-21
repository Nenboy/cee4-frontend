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

// Bonus helpers you'll likely need next:
export async function getMyProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function deleteProduct(id) {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}