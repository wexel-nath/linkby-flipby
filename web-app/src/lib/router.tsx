import { createBrowserRouter } from 'react-router-dom'

import Login from '@/pages/Login'
import NotFound from '@/pages/NotFound'
import ProductDetails from '@/pages/ProductDetails'
import ProductList from '@/pages/ProductList'
import ProductRegistration from '@/pages/ProductRegistration'

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProductList />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/products',
    element: <ProductList />,
  },
  {
    path: '/products/:id',
    element: <ProductDetails />,
  },
  {
    path: '/products/new',
    element: <ProductRegistration />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

export default router
