import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, TrendingUp, Sparkles, ArrowRight } from 'lucide-react'
import FeaturedProducts from '../Component/FeaturedProducts'
import PeopleAlsoBought from '../Component/PeopleAlsoBought'
import axios from '../lib/axios'
import LoadingSpinner from '../Component/LoadingSpinner'
import CategoryItem from '../Component/CategoryItem'

const categories = [
	{ href: "/jeans", name: "Jeans", imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1926&q=80" },
	{ href: "/t-shirts", name: "T-shirts", imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1480&q=80" },
	{ href: "/shoes", name: "Shoes", imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" },
	{ href: "/glasses", name: "Glasses", imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=1780&q=80" },
	{ href: "/jackets", name: "Jackets", imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1548&q=80" },
	{ href: "/suits", name: "Suits", imageUrl: "https://images.unsplash.com/photo-1594938298596-70f56fb3cecb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1624&q=80" },
	{ href: "/bags", name: "Bags", imageUrl: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?ixlib=rb-4.0.3&auto=format&fit=crop&w=1548&q=80" },
];

function Homepage() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await axios.get('/products/featured')
        setFeaturedProducts(response.data)
      } catch (error) {
        console.error('Error fetching featured products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className='min-h-screen'>
      {/* Hero Section with Image */}
      <section className='relative h-[600px] sm:h-[500px] md:h-[600px] overflow-hidden'>
        <div className='absolute inset-0'>
          <img
            src='https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
            alt='Shopping background'
            className='w-full h-full object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-transparent'></div>
        </div>
        <div className='relative z-10 container mx-auto px-4 h-full flex items-center'>
          <div className='max-w-2xl'>
            <div className='flex items-center gap-2 mb-4'>
              <Sparkles className='w-8 h-8 text-emerald-400' />
              <span className='text-emerald-400 font-semibold'>Welcome to Our Store</span>
            </div>
            <h1 className='text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight'>
              Discover Amazing
              <span className='text-emerald-400 block'>Products Today</span>
            </h1>
            <p className='text-xl text-gray-300 mb-8'>
              Shop the latest trends and find everything you need in one place. Quality products at great prices.
            </p>
            <div className='flex gap-4 flex-wrap'>
              <Link
                to='/category/electronics'
                className='bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 flex items-center gap-2 group'
              >
                Shop Now
                <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
              </Link>
              <Link
                to='/category/fashion'
                className='bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 border border-white/20'
              >
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Banners Section */}
      <section className='py-16 bg-gray-900/50'>
        <div className='container mx-auto px-4'>
          <h2 className='text-4xl font-bold text-center text-emerald-400 mb-12'>Shop by Category</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {categories.map((category) => (
              <CategoryItem category={category} key={category.name} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts && featuredProducts.length > 0 && (
        <FeaturedProducts featuredProducts={featuredProducts} />
      )}

      {/* Benefits Section with Images */}
      <section className='py-16 bg-gray-900/30'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='text-center'>
              <div className='bg-emerald-600/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4'>
                <ShoppingBag className='w-10 h-10 text-emerald-400' />
              </div>
              <h3 className='text-xl font-semibold text-white mb-2'>Free Shipping</h3>
              <p className='text-gray-400'>On orders over $50</p>
            </div>
            <div className='text-center'>
              <div className='bg-emerald-600/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4'>
                <TrendingUp className='w-10 h-10 text-emerald-400' />
              </div>
              <h3 className='text-xl font-semibold text-white mb-2'>Best Prices</h3>
              <p className='text-gray-400'>Competitive pricing guaranteed</p>
            </div>
            <div className='text-center'>
              <div className='bg-emerald-600/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4'>
                <Sparkles className='w-10 h-10 text-emerald-400' />
              </div>
              <h3 className='text-xl font-semibold text-white mb-2'>Quality Assured</h3>
              <p className='text-gray-400'>Premium quality products</p>
            </div>
          </div>
        </div>
      </section>

      {/* People Also Bought Section */}
      <section className='py-12 container mx-auto px-4'>
        <PeopleAlsoBought />
      </section>
    </div>
  )
}

export default Homepage