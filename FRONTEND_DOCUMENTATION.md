# Frontend Documentation - E-Commerce Application
## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Application Architecture](#application-architecture)
5. [Core Concepts](#core-concepts)
6. [State Management](#state-management)
7. [Authentication Flow](#authentication-flow)
8. [Routing System](#routing-system)
9. [Component Architecture](#component-architecture)
10. [API Integration](#api-integration)
11. [Key Features](#key-features)
12. [How Things Work](#how-things-work)

---

## Project Overview

This is a modern e-commerce frontend application built with React, featuring user authentication, product browsing, shopping cart, admin dashboard, and payment integration. The application uses a component-based architecture with state management through Zustand stores.

---

## Technology Stack

- **React 19.2.0** - UI library
- **React Router DOM 7.12.0** - Client-side routing
- **Vite 7.2.4** - Build tool and dev server
- **Zustand 5.0.10** - Lightweight state management
- **Axios 1.13.2** - HTTP client for API calls
- **Tailwind CSS 3.4.19** - Utility-first CSS framework
- **Framer Motion 12.26.2** - Animation library
- **React Hot Toast 2.6.0** - Toast notifications
- **Lucide React 0.562.0** - Icon library

---

## Project Structure

```
fronend/
├── src/
│   ├── Component/          # Reusable UI components
│   │   ├── AnalyticsTab.jsx
│   │   ├── CartItem.jsx
│   │   ├── CategoryItem.jsx
│   │   ├── CreateProductForm.jsx
│   │   ├── FeaturedProducts.jsx
│   │   ├── GiftCouponCard.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Navbar.jsx
│   │   ├── OrderSummary.jsx
│   │   ├── PeopleAlsoBought.jsx
│   │   ├── ProductCard.jsx
│   │   └── ProductsList.jsx
│   ├── pages/              # Page components (routes)
│   │   ├── Admin.jsx
│   │   ├── CartPage.jsx
│   │   ├── CategoryPage.jsx
│   │   ├── Homepage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── PurchaseCancelPahe.jsx
│   │   ├── PurchaseSuccessPage.jsxc
│   │   └── SignUpPage.jsx
│   ├── stores/             # Zustand state stores
│   │   ├── useCartStore.js
│   │   ├── useProductStore.js
│   │   └── useUserStore.js
│   ├── lib/                # Utility libraries
│   │   └── axios.js        # Axios instance configuration
│   ├── assets/             # Static assets
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # Application entry point
│   └── index.css           # Global styles
├── public/                 # Public assets
├── index.html              # HTML template
├── package.json            # Dependencies
└── vite.config.js          # Vite configuration
```

---

## Application Architecture

### Entry Point (`main.jsx`)

```javascript
// Application starts here
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>      // Enables client-side routing
      <App />            // Main application component
    </BrowserRouter>
  </StrictMode>
)
```

**Key Points:**
- `BrowserRouter` wraps the entire app to enable React Router functionality
- `StrictMode` enables additional React development checks
- The root element is injected into the DOM with id="root"

---

## Core Concepts

### 1. Component-Based Architecture

The application follows React's component-based architecture where:
- **Pages** = Full screen views (routes)
- **Components** = Reusable UI pieces
- **Stores** = Global state management
- **Lib** = Shared utilities

### 2. Single Page Application (SPA)

All navigation happens client-side using React Router. No full page reloads - only the content area updates.

---

## State Management

The application uses **Zustand** for state management. There are three main stores:

### 1. User Store (`useUserStore.js`)

**Purpose:** Manages user authentication and profile data

**State:**
```javascript
{
  user: null,              // Current user object
  loading: false,          // Loading state for async operations
  checkingAuth: true       // Initial auth check status
}
```

**Key Methods:**
- `signup({ name, email, password, confirmPassword })` - User registration
- `login(email, password)` - User login
- `logout()` - User logout
- `checkAuth()` - Verify user session on app load
- `refreshToken()` - Refresh expired access tokens

**How it works:**
1. On app load, `checkAuth()` is called in `App.jsx`
2. Makes GET request to `/auth/profile`
3. If successful, user object is stored in state
4. If failed, user is set to null

**Token Refresh Interceptor:**
- Automatically intercepts 401 (Unauthorized) responses
- Attempts to refresh the access token using refresh token
- Retries the original request after successful refresh
- Prevents multiple simultaneous refresh attempts

### 2. Product Store (`useProductStore.js`)

**Purpose:** Manages product data and operations

**State:**
```javascript
{
  products: [],    // Array of products
  loading: false   // Loading state
}
```

**Key Methods:**
- `fetchAllProducts()` - Get all products (admin)
- `fetchProductsByCategory(category)` - Get products by category
- `fetchFeaturedProducts()` - Get featured products
- `createProduct(productData)` - Create new product (admin)
- `deleteProduct(productId)` - Delete product (admin)
- `toggleFeaturedProduct(productId)` - Toggle featured status (admin)

**How it works:**
1. Products are fetched from `/products` endpoints
2. State is updated with fetched products
3. Components subscribe to products array
4. UI updates reactively when products change

### 3. Cart Store (`useCartStore.js`)

**Purpose:** Manages shopping cart state and operations

**State:**
```javascript
{
  cart: [],              // Array of cart items
  coupon: null,          // Applied coupon object
  total: 0,              // Total after discount
  subtotal: 0,           // Subtotal before discount
  isCouponApplied: false // Coupon status
}
```

**Key Methods:**
- `getCartItems()` - Fetch user's cart from server
- `addToCart(product)` - Add product to cart
- `removeFromCart(productId)` - Remove product from cart
- `updateQuantity(productId, quantity)` - Update item quantity
- `applyCoupon(code)` - Apply discount coupon
- `removeCoupon()` - Remove applied coupon
- `calculateTotals()` - Recalculate cart totals
- `clearCart()` - Clear all cart items

**How it works:**
1. Cart is fetched from server on user login
2. Local state is synced with server
3. Totals are recalculated automatically on any change
4. Coupon discounts are applied to final total

---

## Authentication Flow

### 1. User Registration Flow

```
User fills SignUpPage form
    ↓
Submit triggers signup() from useUserStore
    ↓
POST /auth/signup with { name, email, password }
    ↓
Server creates user, sets httpOnly cookies (access + refresh tokens)
    ↓
User object returned and stored in state
    ↓
User redirected to homepage (automatic via route guard)
```

### 2. User Login Flow

```
User fills LoginPage form
    ↓
Submit triggers login(email, password)
    ↓
POST /auth/login with credentials
    ↓
Server validates credentials, sets httpOnly cookies
    ↓
User object stored in state
    ↓
Cart items fetched automatically
    ↓
User can now access protected routes
```

### 3. Session Persistence

```
App loads → checkAuth() called automatically
    ↓
GET /auth/profile (sends cookies automatically)
    ↓
If valid: User object stored, access granted
    ↓
If invalid: User set to null, redirected to login
```

### 4. Token Refresh Flow

```
Any API request returns 401 (token expired)
    ↓
Axios interceptor catches the error
    ↓
Calls refreshToken() → POST /auth/refresh-token
    ↓
New access token stored in httpOnly cookie
    ↓
Original request retried with new token
    ↓
If refresh fails: User logged out
```

### 5. Protected Routes

Routes are protected using conditional rendering:

```javascript
// In App.jsx
<Route 
  path='/cart' 
  element={user ? <CartPage /> : <Navigate to='/login' />} 
/>
```

**How it works:**
- If `user` exists → Show the page
- If `user` is null → Redirect to login

---

## Routing System

### Route Configuration (`App.jsx`)

| Route | Component | Access |
|-------|-----------|--------|
| `/` | `Homepage` | Public |
| `/signup` | `SignUpPage` | Public (redirects if logged in) |
| `/login` | `LoginPage` | Public (redirects if logged in) |
| `/secret-dashboard` | `AdminPage` | Admin only |
| `/category/:category` | `CategoryPage` | Public |
| `/cart` | `CartPage` | Authenticated |
| `/purchase-success` | `PurchaseSuccessPage` | Authenticated |
| `/purchase-cancel` | `PurchaseCancelPage` | Authenticated |

### Route Guards

**Public routes that redirect logged-in users:**
```javascript
<Route 
  path='/login' 
  element={!user ? <LoginPage /> : <Navigate to='/' />} 
/>
```

**Protected routes (require authentication):**
```javascript
<Route 
  path='/cart' 
  element={user ? <CartPage /> : <Navigate to='/login' />} 
/>
```

**Admin-only routes:**
```javascript
<Route 
  path='/secret-dashboard' 
  element={user?.role === "admin" ? <AdminPage /> : <Navigate to='/login' />} 
/>
```

### Dynamic Routes

Category page uses URL parameters:
```javascript
// URL: /category/electronics
const { category } = useParams(); // "electronics"
fetchProductsByCategory(category);
```

---

## Component Architecture

### Page Components

#### 1. **Homepage** (`Homepage.jsx`)
- Landing page of the application
- Displays featured products and categories
- Entry point for browsing

#### 2. **LoginPage** (`LoginPage.jsx`)
**State:**
- `email` - User email input
- `password` - User password input

**Functionality:**
- Form validation (HTML5 required)
- Calls `login()` from useUserStore
- Shows loading state during authentication
- Redirects to home on success (via route guard)

#### 3. **SignUpPage** (`SignUpPage.jsx`)
**State:**
- `formData` object with: name, email, password, confirmPassword

**Functionality:**
- Password confirmation validation
- Calls `signup()` from useUserStore
- Client-side validation (password matching)
- Server-side validation handled by backend

#### 4. **CategoryPage** (`CategoryPage.jsx`)
**How it works:**
1. Extracts category from URL params
2. Fetches products for that category
3. Displays products in a grid using ProductCard components
4. Updates when category changes in URL

#### 5. **CartPage** (`CartPage.jsx`)
**Features:**
- Displays all cart items
- Shows empty state if cart is empty
- Displays order summary
- Shows "People Also Bought" recommendations
- Gift coupon section

**Layout:**
- Left: Cart items list
- Right: Order summary + coupons

#### 6. **AdminPage** (`Admin.jsx`)
**Features:**
- Tab-based navigation (Create, Products, Analytics)
- Product creation form
- Product management list
- Analytics dashboard

**Tabs:**
- **Create**: Add new products
- **Products**: View/edit/delete existing products
- **Analytics**: View sales/product statistics

### Reusable Components

#### 1. **Navbar** (`Navbar.jsx`)
**Features:**
- Fixed header at top
- Logo/Home link
- Navigation links
- Cart icon with item count badge
- User authentication status
- Admin dashboard link (admin only)
- Logout button

**State:**
- Reads `user` from useUserStore
- Reads `cart` from useCartStore
- Dynamically shows/hides elements based on auth state

#### 2. **ProductCard** (`ProductCard.jsx`)
**Displays:**
- Product image
- Product name
- Product price
- "Add to Cart" button

**Functionality:**
- Checks if user is logged in before adding to cart
- Calls `addToCart()` from useCartStore
- Shows toast notification on action

#### 3. **CartItem** (`CartItem.jsx`)
**Displays:**
- Product details
- Quantity controls (increase/decrease)
- Item total price
- Remove button

**Functionality:**
- Updates quantity via `updateQuantity()`
- Removes item via `removeFromCart()`
- Quantity changes trigger total recalculation

#### 4. **OrderSummary** (`OrderSummary.jsx`)
**Displays:**
- Subtotal
- Discount (if coupon applied)
- Total
- Checkout button (Stripe integration)

#### 5. **LoadingSpinner** (`LoadingSpinner.jsx`)
- Reusable loading indicator
- Shown during async operations
- Used during initial auth check

---

## API Integration

### Axios Configuration (`lib/axios.js`)

```javascript
const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" 
    ? "http://localhost:5000/api" 
    : "/api",
  withCredentials: true  // Sends cookies with requests
});
```

**Key Features:**
- Base URL changes based on environment
- `withCredentials: true` ensures cookies (tokens) are sent
- All API calls use this instance

### API Endpoints Used

#### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get current user
- `POST /auth/refresh-token` - Refresh access token

#### Products
- `GET /products` - Get all products (admin)
- `GET /products/category/:category` - Get by category
- `GET /products/featured` - Get featured products
- `POST /products` - Create product (admin)
- `DELETE /products/:id` - Delete product (admin)
- `PATCH /products/:id` - Update product (admin)

#### Cart
- `GET /cart` - Get user's cart
- `POST /cart` - Add item to cart
- `PUT /cart/:productId` - Update quantity
- `DELETE /cart` - Remove item from cart

#### Coupons
- `GET /coupons` - Get user's coupon
- `POST /coupons/validate` - Validate and apply coupon

### Error Handling

**Global Error Handling:**
- Axios interceptors handle 401 errors (token refresh)
- Toast notifications for user-facing errors
- Console logging for debugging

**Component-Level Error Handling:**
```javascript
try {
  const response = await axios.get("/api/endpoint");
  // Handle success
} catch (error) {
  toast.error(error.response?.data?.message || "An error occurred");
}
```

---

## Key Features

### 1. **User Authentication**
- Secure JWT-based authentication
- HttpOnly cookies for token storage
- Automatic token refresh
- Session persistence
- Protected routes

### 2. **Shopping Cart**
- Add/remove items
- Quantity management
- Real-time total calculation
- Coupon/discount support
- Server-synced cart

### 3. **Product Management (Admin)**
- Create products with images
- Edit/delete products
- Featured product toggle
- Category-based organization

### 4. **User Experience**
- Smooth animations (Framer Motion)
- Loading states
- Toast notifications
- Responsive design (Tailwind CSS)
- Empty states
- Error handling

### 5. **Payment Integration**
- Stripe checkout
- Success/cancel pages
- Order confirmation

---

## How Things Work

### Application Initialization Flow

```
1. Browser loads index.html
   ↓
2. main.jsx executes
   ↓
3. React app mounts to #root
   ↓
4. BrowserRouter initializes
   ↓
5. App.jsx renders
   ↓
6. useEffect in App.jsx runs:
   - checkAuth() called → GET /auth/profile
   - If user exists → cart items fetched
   ↓
7. Routes render based on current URL
   ↓
8. Components fetch data as needed
```

### Adding Product to Cart Flow

```
1. User clicks "Add to Cart" on ProductCard
   ↓
2. handleAddToCart() checks if user is logged in
   ↓
3. If not logged in → Toast error, return
   ↓
4. If logged in → addToCart(product) called
   ↓
5. POST /cart with productId
   ↓
6. Server adds item to cart
   ↓
7. Local state updated optimistically
   ↓
8. calculateTotals() called
   ↓
9. UI updates with new cart count and total
   ↓
10. Toast success notification shown
```

### Category Navigation Flow

```
1. User clicks category link
   ↓
2. React Router navigates to /category/:category
   ↓
3. CategoryPage component mounts
   ↓
4. useParams() extracts category from URL
   ↓
5. useEffect triggers fetchProductsByCategory(category)
   ↓
6. GET /products/category/:category
   ↓
7. Products array updated in store
   ↓
8. Component re-renders with new products
   ↓
9. ProductCard components render for each product
```

### Admin Product Creation Flow

```
1. Admin navigates to /secret-dashboard
   ↓
2. AdminPage renders with "Create" tab active
   ↓
3. CreateProductForm component displays
   ↓
4. Admin fills form (name, price, image, category, etc.)
   ↓
5. Form submission triggers createProduct(productData)
   ↓
6. POST /products with form data (multipart/form-data for image)
   ↓
7. Server creates product, uploads image to Cloudinary
   ↓
8. New product added to products array
   ↓
9. Form resets
   ↓
10. Toast success notification
```

### Checkout Flow

```
1. User clicks "Checkout" in OrderSummary
   ↓
2. POST /payments/create-checkout-session
   ↓
3. Server creates Stripe session, returns session URL
   ↓
4. User redirected to Stripe checkout page
   ↓
5. User completes payment on Stripe
   ↓
6. Stripe redirects to /purchase-success?session_id=xxx
   ↓
7. PurchaseSuccessPage component mounts
   ↓
8. Extracts session_id from URL
   ↓
9. POST /payments/checkout-success with session_id
   ↓
10. Server verifies payment, creates order
    ↓
11. Cart cleared via clearCart()
    ↓
12. Confetti animation plays
    ↓
13. Success message displayed
```

### Token Refresh Flow (Automatic)

```
1. User makes any API request
   ↓
2. Server responds with 401 (token expired)
   ↓
3. Axios response interceptor catches error
   ↓
4. Checks if request already retried (prevents loops)
   ↓
5. Calls refreshToken() → POST /auth/refresh-token
   ↓
6. Server validates refresh token, issues new access token
   ↓
7. New token stored in httpOnly cookie automatically
   ↓
8. Original request retried with new token
   ↓
9. Response returned to component
   ↓
10. If refresh fails → User logged out
```

### State Synchronization

**Cart State Sync:**
- Local state is optimistic (updated immediately)
- Server is source of truth
- Cart fetched on login
- Cart synced on every add/remove/update

**Product State Sync:**
- Products fetched when needed (category change, admin load)
- Admin changes immediately reflected
- No polling - on-demand fetching

---

## Development Workflow

### Running the Application

```bash
cd fronend
npm install
npm run dev
```

### Building for Production

```bash
npm run build
```

### Code Structure Best Practices

1. **Components**: Keep components focused and reusable
2. **Pages**: One page per route, compose from components
3. **Stores**: Global state only, not component-level state
4. **API Calls**: Centralized in stores, not in components
5. **Styling**: Tailwind CSS utility classes, consistent design system

---

## Common Patterns

### Protected Component Pattern
```javascript
{user && <ProtectedComponent />}
```

### Loading State Pattern
```javascript
if (loading) return <LoadingSpinner />;
```

### Error Handling Pattern
```javascript
try {
  await someAsyncOperation();
  toast.success("Success!");
} catch (error) {
  toast.error(error.response?.data?.message || "Error occurred");
}
```

### Conditional Rendering Pattern
```javascript
{cart.length === 0 ? (
  <EmptyState />
) : (
  <CartItems />
)}
```

---

## Security Considerations

1. **Tokens**: Stored in httpOnly cookies (XSS protection)
2. **CSRF**: SameSite cookie attribute
3. **API**: All requests require authentication (except public endpoints)
4. **Validation**: Both client and server-side validation
5. **Route Protection**: Client-side checks + server-side enforcement

---

## Future Enhancements

- Search functionality
- Product filters and sorting
- User profile management
- Order history
- Wishlist feature
- Product reviews and ratings
- Real-time notifications
- Dark/light theme toggle

---

## Troubleshooting

### Common Issues

**1. Routes not working**
- Ensure BrowserRouter wraps App in main.jsx

**2. Authentication not persisting**
- Check cookies are enabled
- Verify withCredentials: true in axios config

**3. CORS errors**
- Check backend CORS configuration
- Verify API base URL matches backend

**4. State not updating**
- Ensure you're using store methods, not direct mutations
- Check store subscriptions in components

---

## Conclusion

This frontend application follows modern React best practices with a clear separation of concerns, centralized state management, and a component-based architecture. The codebase is maintainable, scalable, and follows industry standards for security and user experience.

For questions or issues, refer to the component code and store implementations for detailed understanding of each feature.
