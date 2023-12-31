import { createBrowserRouter, RouterProvider } from "react-router-dom"
import MainLayout from "./components/layouts/MainLayout"
import RequireAuth  from "./features/auth/RequireAuth"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"

const router = createBrowserRouter([
  {
    element: (<MainLayout />),
    children: [
      {
        path: "/",
        element: <RequireAuth />,
        children: [
          {
            index: true,
            element: <Home />,
          },
        ]
      },
      {
        path: "/login",
        element: <Login />,

      },
      {
        path: "/register",
        element: <Register />,
      }
    ],
  },
])

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
