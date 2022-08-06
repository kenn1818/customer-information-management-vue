import DashboardLayout from 'src/pages/Dashboard/Layout/DashboardLayout.vue';

// GeneralViews
import NotFound from 'src/pages/GeneralViews/NotFoundPage.vue';

import DefaultHeader from 'src/pages/Dashboard/DefaultHeader'

// Customer pages
const AddCustomer = () => import('src/pages/Dashboard/Customer/AddCustomer.vue')
const EditCustomer = () => import('src/pages/Dashboard/Customer/EditCustomer.vue')
const Customer = () => import('src/pages/Dashboard/Customer/Customer.vue')

const routes = [
  {
    path: '/',
    redirect: '/customer',
    name: 'Home'
  },
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/customer',
    name: 'Dashboard',
    children: [
      {
        path: '/customer',
        name: `Customer`,
        components: { default: Customer, header: DefaultHeader }
      },
      {
        path: '/customer/add-customer',
        name: `Add Customer`,
        components: { default: AddCustomer, header: DefaultHeader }
      },
      {
        path: '/customer/edit-customer/:id',
        name: `Edit Customer`,
        components: { default: EditCustomer, header: DefaultHeader }
      },
    ]
  },
  { path: '*', component: NotFound }
];

export default routes;
