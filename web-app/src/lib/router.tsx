import { createBrowserRouter } from "react-router-dom"
import Login from "@/pages/Login"
import ProductList from "@/pages/ProductList"
import ProductRegistration from "@/pages/ProductRegistration"
import ProductDetails from "@/pages/ProductDetails"
import NotFound from "@/pages/NotFound"

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProductList />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/products",
    element: <ProductList />
  },
  {
    path: "/products/:id",
    element: <ProductDetails />
  },
  {
    path: "/products/new",
    element: <ProductRegistration />
  },
  {
    path: "*",
    element: <NotFound />
  }
])

export default router
