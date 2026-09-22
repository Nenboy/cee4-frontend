import { supabase } from './supabaseClient'

function generateOrderNumber() {
  const stamp = Date.now().toString().slice(-8)
  const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `C4-${stamp}-${rand}`
}

export async function createOrder(orderData) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not logged in')

  const { data, error } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      order_number: generateOrderNumber(),
      total: orderData.total,
      status: 'pending',
      payment_method: orderData.payment_method,
      payment_status: orderData.payment_status || 'unpaid',
      delivery_area: orderData.delivery_area,
      delivery_address: orderData.delivery_address,
      items: orderData.items,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getMyOrders() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not logged in')

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getOrderById(id) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function getAllOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function updateOrderStatus(id, status) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateOrderPaymentStatus(id, payment_status) {
  const { data, error } = await supabase
    .from('orders')
    .update({ payment_status })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}