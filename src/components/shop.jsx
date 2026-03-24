import { useState, useEffect } from 'react';
import { fetchProducts } from '../services/api';
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { Link } from 'react-router-dom';


const Shop = () => {
  const [isActive, setIsActive] = useState(null)
  const [liked, setLiked] = useState({});
  const [burst, setBurst] = useState(null);
  const [merch, setMerch] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMerch = async () => {
      try {
        const data = await fetchProducts();
        setMerch(data?.data || []);
      } catch (err) {
        console.error("Failed to load merch", err);
      } finally {
        setLoading(false);
      }
    };
    loadMerch();
  }, []);

  const displayImage = (item) => {
    if (item.images && item.images.length > 0) {
      return item.images.find(img => img.is_primary)?.image_url || item.images[0].image_url;
    }
    return 'https://via.placeholder.com/500?text=No+Image';
  };


  return (
    <div className='min-h-screen  w-full py-16 '>
      <div className='mx-auto mb-6 text-left px-4 py-16'>
        <h1 className='text-4xl lg:text-5xl mb-4 font-bold '>
          Get Our Merch
        </h1>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-2  px-4'>
        {loading ? (
             <div className="col-span-full py-20 text-center text-gray-500">Loading products...</div>
        ) : merch.length === 0 ? (
             <div className="col-span-full py-20 text-center text-gray-500">No products available.</div>
        ) : merch.map((product) => {
          return (<div key={product.id} className='flex flex-col'>
            <div className='relative w-full h-[500px] bg-gray-100 overflow-hidden self-start'>
              <img
                src={displayImage(product)}
                alt={product.name}
                className='w-full h-full object-cover'
              />
              <button
                onClick={() => {
                  setLiked(prev => ({
                    ...prev,
                    [product.id]: !prev[product.id]
                  }))
                  setBurst(product.id);
                  setTimeout(() => setBurst(null), 600);
                }
                }
                className="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-2 rounded-full shadow hover:scale-110 transition"
              >
                {liked[product.id] ? (
                  <FaHeart className="text-red-500 text-2xl animate-ping-once" />
                ) : (
                  <FiHeart className="text-gray-800 text-2xl" />
                )}
              </button>
              {burst === product.id && (
                <FaHeart className="absolute bottom-10 right-5 text-red-500 text-xl animate-float" />
              )}


            </div>
            <div className='mt-4 space-y-1'>
              <h3 className='text-sm font-medium'>
                {product.name}
              </h3>
              <p className='text-sm text-gray-600'>
                KSH {parseFloat(product.price).toLocaleString()}
              </p>
            </div>
            <Link to={`/shop/${product.slug}`}>
              <button className="mt-4 w-full border border-gray-900 py-3 text-sm uppercase tracking-wide hover:bg-gray-900 hover:text-white transition">
                Choose options
              </button>
            </Link>

          </div>)
        })}


      </div>
    </div>
  );
};

export default Shop;