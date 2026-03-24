import { useState, useEffect } from 'react';
import { fetchProducts } from '../services/api';
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { Link } from 'react-router-dom';
import Pagination from '../UI/pagination';

const Merch = () => {
  const Images = [
    "/img/shop.jpg",
    "img/merch1.jpg",
    "img/merch2.jpg",
    "img/merch3.jpg",
    "img/merch4.jpg",
    "img/merch5.jpg",
  ];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [liked, setLiked] = useState({});
  const [burst, setBurst] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("Featured");
  const [availability, setAvailability] = useState("All");
  const [priceRange, setPriceRange] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(8);

  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = products.slice(firstPostIndex, lastPostIndex);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setAllProducts(data?.data || []);
        setProducts(data?.data || []);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const applyFiltersAndSort = () => {
    let updated = [...allProducts];

    // Availability Filter (Assuming product.in_stock exists, or skip it. Let's filter by stock if we know the schema)
    // if (availability === "In Stock") {
    //   updated = updated.filter(p => p.stock > 0);
    // }

    // Price Filter
    if (priceRange === "Under 5000") {
      updated = updated.filter(p => parseFloat(p.price) < 5000);
    }
    if (priceRange === "5000-10000") {
      updated = updated.filter(p => parseFloat(p.price) >= 5000 && parseFloat(p.price) <= 10000);
    }

    // Sort
    switch (sortBy) {
      case "Price, High to low":
        updated.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "Price, Low to High":
        updated.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "Alphabetically, A to Z":
        updated.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Alphabetically, Z to A":
        updated.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    setProducts(updated);
  };

  useEffect(() => {
    applyFiltersAndSort();
  }, [sortBy, availability, priceRange, allProducts]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === Images.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const displayImage = (item) => {
    if (item.images && item.images.length > 0) {
      return item.images.find(img => img.is_primary)?.image_url || item.images[0].image_url;
    }
    return 'https://via.placeholder.com/500?text=No+Image';
  };

  return (
    <div id="merch" className='min-h-screen w-full overflow-hidden bg-gray-100'>

      <div className="relative h-64 md:h-76 lg:h-84 overflow-hidden">

        {Images.map((img, index) => (
          <div
            key={index}
            className={`
        absolute inset-0 bg-cover bg-center
        transition-opacity duration-1000 ease-in-out
        ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}
      `}
          >
            <div
              className={`
          w-full h-full bg-cover bg-center
          ${index === currentSlide ? "animate-kenburns" : ""}
        `}
              style={{ backgroundImage: `url(${img})` }}
            />
          </div>
        ))}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 z-20"></div>

        {/* Text */}
        <div className="relative z-30 flex items-center justify-center h-full">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-zentry uppercase">
            GET OUR MERCH
          </h1>
        </div>

      </div>
      <div className="flex flex-wrap items-center justify-between px-8 py-6 bg-white border-b text-sm">

        <div className="flex items-center gap-6">

          <div className="flex items-center gap-2">
            <span className="text-gray-500">Filter:</span>

            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="bg-transparent outline-none cursor-pointer"
            >
              <option value="All">Availability</option>
              <option value="In Stock">In Stock</option>
            </select>

            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="bg-transparent outline-none cursor-pointer"
            >
              <option value="All">Price</option>
              <option value="Under 5000">Under 5000</option>
              <option value="5000-10000">5000 - 10000</option>
            </select>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-6">

          <div className="flex items-center gap-2">
            <span className="text-gray-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent outline-none cursor-pointer"
            >
              <option value="Featured">Featured</option>
              <option value="Best Selling">Best Selling</option>
              <option value="Price, High to low">Price, High to low</option>
              <option value="Price, Low to High">Price, Low to High</option>
              <option value="Alphabetically, A to Z">Alphabetically, A to Z</option>
              <option value="Alphabetically, Z to A">Alphabetically, Z to A</option>
            </select>
          </div>

          <span className="text-gray-400">
            {products.length} products
          </span>

        </div>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2  px-8 py-16'>
        {loading ? (
          <div className="col-span-full py-20 text-center text-gray-500">Loading products...</div>
        ) : currentPosts.length === 0 ? (
          <div className="col-span-full py-20 text-center text-gray-500">No products match your filters.</div>
        ) : currentPosts.map((product) => {
          return (<div key={product.id} className='flex flex-col group h-full'>
            <div className='relative w-full h-[350px] bg-gray-100 overflow-hidden'>
              <Link to={`/shop/${product.slug}`}>
                <img
                  src={displayImage(product)}
                  alt={product.name}
                  className='w-full h-full object-cover transition duration-500 hover:scale-105'
                />
              </Link>
              <button
                onClick={() => {
                  setLiked(prev => ({
                    ...prev,
                    [product.id]: !prev[product.id]
                  }))
                  setBurst(product.id);
                  setTimeout(() => setBurst(null), 600);
                }}
                className="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-2 rounded-full shadow hover:scale-110 transition z-10"
              >
                {liked[product.id] ? (
                  <FaHeart className="text-red-500 text-2xl animate-ping-once" />
                ) : (
                  <FiHeart className="text-gray-800 text-2xl" />
                )}
              </button>
              {burst === product.id && (
                <FaHeart className="absolute bottom-10 right-5 text-red-500 text-xl animate-float z-10" />
              )}
            </div>
            <div className='mt-4 flex flex-col flex-grow'>
              <h3 className='text-lg font-zentry font-bold group-hover:underline'>
                <Link to={`/shop/${product.slug}`}>{product.name}</Link>
              </h3>
              <p className='text-sm text-gray-600 mt-1'>
                KSH {parseFloat(product.price).toLocaleString()}
              </p>
              <div className="mt-auto pt-4">
                <Link to={`/shop/${product.slug}`}>
                  <button className="w-full cursor-pointer border border-gray-900 py-3 text-sm uppercase tracking-wide hover:bg-gray-900 hover:text-white transition">
                    Choose options
                  </button>
                </Link>
              </div>
            </div>
          </div>)
        })}
      </div>
      <div className="py-4 px-6 items-center justify-center">
        <Pagination
          totalPosts={products.length}
          postsPerPage={postsPerPage}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </div>

    </div>
  );
};

export default Merch;