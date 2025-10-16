import axios from 'axios'

const api = axios.create({ baseURL: 'https://dummyjson.com' })

export async function fetchProducts() {
  const res = await api.get('/products?limit=20')
  return res.data
}

export async function fetchProductById(id) {
  const res = await api.get(`/products/${id}`)
  return res.data
}
