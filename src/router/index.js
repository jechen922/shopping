import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Dashboard from '@/components/Dashboard'
import Login from '@/components/pages/Login'
import Shopping from '@/components/pages/shopping/Shopping'
import ShoppingProducts from '@/components/pages/shopping/Products'
import ShoppingProduct from '@/components/pages/shopping/Product'
import ShoppingOrder from '@/components/pages/shopping/Order'
import ShoppingOrderCheck from '@/components/pages/shopping/OrderCheck'
import Products from '@/components/pages/Products'
import Orders from '@/components/pages/Orders'
import Coupons from '@/components/pages/Coupons'
import CustomerOrders from '@/components/pages/CustomerOrders'
import CustomerCheckout from '@/components/pages/CustomerCheckout'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: 'login'
    },
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld,
    //   meta: {
    //     requiresAuth: true
    //   }
    // },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      // name: 'Shopping',
      redirect: '/products',
      component: Shopping,
      children: [
        {
          path: 'products',
          name: 'ShoppingProducts',
          component: ShoppingProducts
        },
        {
          path: 'products/:productId',
          name: 'ShoppingProduct',
          component: ShoppingProduct
        },
        {
          path: 'orders',
          name: 'ShoppingOrder',
          component: ShoppingOrder
        },
        {
          path: 'orders/:orderId',
          name: 'ShoppingOrderCheck',
          component: ShoppingOrderCheck
        }
      ]
    },
    {
      path: '/admin',
      name: 'Dashboard',
      component: Dashboard,
      children: [
        {
          path: 'products',
          name: 'Products',
          component: Products,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'orders',
          name: 'Orders',
          component: Orders,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'coupons',
          name: 'Coupons',
          component: Coupons,
          meta: {
            requiresAuth: true
          }
        }
      ]
    },
    {
      path: '/',
      name: 'Customer',
      component: Dashboard,
      children: [
        {
          path: 'customer_order',
          name: 'CustomerOrder',
          component: CustomerOrders
        },
        {
          path: 'customer_checkout/:orderId',
          name: 'CustomerCheckout',
          component: CustomerCheckout
        }
      ]
    }
  ]
})
