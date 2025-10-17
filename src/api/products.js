import axios from 'axios'

const api = axios.create({ baseURL: 'https://dummyjson.com' })

// Получить список товаров с параметрами
export async function fetchProducts({ limit = 12, skip = 0, search = '', category = '', sort = '' } = {}) {
  let url = '/products'
  if (search) url = '/products/search'
  else if (category) url = `/products/category/${encodeURIComponent(category)}`

  // собираем параметры query
  const params = { limit, skip }
  if (search) params.q = search

  // сортировка через сервер
  if (sort === 'price') {
    params.sortBy = 'price'
    params.order = 'asc'     // по возрастанию
  } 
  else if (sort === 'price-desc') {
    params.sortBy = 'price'
    params.order = 'desc'     // по убыванию
  } else if (sort === 'date') {
    // сортировка по дате через id
    params.sortBy = 'id'
    params.order = 'asc'
  } else if (sort === 'date-desc') {
    // сортировка по дате через id
    params.sortBy = 'id'
    params.order = 'desc'
  }

  const res = await api.get(url, { params })
  // тут массив уже отсортирован сервером
  return { products: res.data.products, total: res.data.total }
}

// Получить категории
export async function fetchCategories() {
  const res = await api.get('/products/category-list') // в новых доках путь может быть /products/categories или /products/category-list — используйте тот, что у вас работает
  return res.data
}

// Один продукт
export async function fetchProductById(id) {
  const res = await api.get(`/products/${id}`)
  return res.data
}