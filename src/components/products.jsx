import { useParams, Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { FaHeart, FaShare, FaTruck } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cart";
import { fetchOneProduct, fetchProducts } from "../services/api";

const ProductPage = () => {
  const { id: slug } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [liked, setLiked] = useState({});
  const [burst, setBurst] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await fetchOneProduct(slug);
        setProduct(data?.data);
        if (data?.data?.images?.length > 0) {
          const primary = data.data.images.find(img => img.is_primary);
          setActiveImage(primary ? primary.image_url : data.data.images[0].image_url);
        }

        const relatedData = await fetchProducts();
        setRelatedProducts(relatedData?.data?.filter(p => p.id !== data?.data?.id).slice(0, 5) || []);
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [slug]);

  const displayImage = (item) => {
    if (item.images && item.images.length > 0) {
      return item.images.find(img => img.is_primary)?.image_url || item.images[0].image_url;
    }
    return 'https://via.placeholder.com/500?text=No+Image';
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading product...</p>
      </main>
    );
  }

  /* ------------------ */
  /* Quantity Handlers  */
  /* ------------------ */
  const handleMinusQuantity = () => {
    setQuantity(prev => (prev - 1 < 1 ? 1 : prev - 1));
  };

  const handlePlusQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  /* ------------------ */
  /* Add To Cart        */
  /* ------------------ */
  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    // Find the variant ID for the selected size (and color if applicable)
    // For now we just match size
    const variant = product.variants.find(v => v.size === selectedSize);

    dispatch(
      addToCart({
        productId: product.id,
        variantId: variant?.id,
        size: selectedSize,
        color: variant?.color,
        name: product.name,
        price: product.discount_percent > 0 
          ? parseFloat(product.price * (1 - product.discount_percent)) 
          : parseFloat(product.price),
        originalPrice: parseFloat(product.price),
        image: activeImage,
        quantity: quantity
      })
    );
  };

  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="flex gap-4">
            <div className="flex flex-col gap-3">
              {product.images?.map((img, index) => (
                <img
                  key={index}
                  src={img.image_url}
                  alt={product.name}
                  onClick={() => setActiveImage(img.image_url)}
                  className={`w-20 h-20 object-cover cursor-pointer border hover:border-black ${activeImage === img.image_url ? 'border-black' : ''}`}
                />
              ))}
            </div>

            <div className="flex-1 bg-gray-100 self-start">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="flex flex-col gap-6">

            <div className="flex items-center gap-4">
              <p className="text-xl text-gray-600">
                {product.name}
              </p>
              <FaShare className="text-xl cursor-pointer hover:text-gray-700 transition" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {product.discount_percent > 0 ? (
                  <>
                    <p className="text-2xl font-semibold text-red-600 line-through">
                      KSH {parseFloat(product.price).toLocaleString()}
                    </p>

                    <p className="text-2xl font-semibold">
                      KSH {parseFloat(product.price * (1 - product.discount_percent)).toLocaleString()}
                    </p>
                  </>
                ) : (
                  <p className="text-2xl font-semibold">
                    KSH {parseFloat(product.price).toLocaleString()}
                  </p>
                )}
              </div>
              {product.discount_percent > 0 && (
                <div className="inline-flex items-center text-xs px-3 py-2 bg-blue-100 text-blue-700 rounded">
                  {product.discount_percent * 100}% Discount Applied
                </div>
              )}
            </div>

            {product.variants && (
              <div className="space-y-4">
                {/* Colors */}
                {(() => {
                  const uniqueColors = [...new Set(product.variants.filter(v => v.color).map(v => v.color))];
                  if (uniqueColors.length === 0) return null;
                  return (
                    <div className="flex gap-3 items-center">
                      <p className="text-sm font-extrabold">Colour :</p>
                      {uniqueColors.map((color, index) => (
                        <p key={index} className="px-3 py-1 uppercase text-lg font-medium text-gray-600">{color}</p>
                      ))}
                    </div>
                  );
                })()}

                {/* Sizes */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <label htmlFor="size">Size</label>
                    <a href="#" className="underline">Size Guide</a>
                  </div>

                  <select
                    id="size"
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full border px-3 py-2"
                  >
                    <option value="">Select size</option>
                    {[...new Set(product.variants.filter(v => v.size).map(v => v.size))].map(size => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            <div className="flex items-center gap-4 mt-4">
              <p className="text-sm font-medium">Quantity</p>

              <div className="flex items-center border">
                <button
                  onClick={handleMinusQuantity}
                  className="px-4 py-2 text-lg font-bold hover:bg-gray-100"
                >
                  -
                </button>

                <span className="px-4">{quantity}</span>

                <button
                  onClick={handlePlusQuantity}
                  className="px-4 py-2 text-lg font-bold hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>


            <div className="flex gap-4 mt-6">
              <button
                disabled={!selectedSize}
                onClick={handleAddToCart}
                className={`flex-1 py-4 text-sm font-medium uppercase tracking-wide transition
                  ${selectedSize
                    ? "bg-blue-800 text-white hover:bg-orange-600 hover:cursor-pointer"
                    : "bg-gray-300 text-gray-500 hover:cursor-not-allowed"
                  }`}
              >
                Add to Bag
              </button>

              <button
                className="w-14 flex items-center justify-center border border-gray-300 hover:border-black hover:cursor-pointer transition"
              >
                <FaHeart />
              </button>
            </div>
            <div className="flex items-start gap-3 mt-6 text-sm border p-4">
              <FaTruck className="mt-1" />
              <div className="space-y-1">
                <p>Free delivery on qualifying orders.</p>
                <div className="flex flex-col gap-2">
                  <a href="#" className="underline">
                    Please read our return and refund policies
                  </a>
                  <a href="#" className="underline text-sm">
                    Shipping restrictions
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-8 border-t divide-y">

              <details className="group py-4">
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <span className="text-sm font-medium transition-colors duration-200 group-open:text-orange-500">
                    Size & Fit
                  </span>
                  <span className="transition group-open:rotate-45">+</span>
                </summary>

                {product.sizeFit && product.sizeFit.length > 0 ? (
                  <ul className="mt-3 text-xl text-gray-600 leading-relaxed list-disc list-inside">
                    {product.sizeFit.map((item, index) => {
                      const key = Object.keys(item)[0];
                      const value = item[key];
                      return (
                        <li key={index}>
                          <span className="font-semibold">{key}:</span> {value}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                    Details coming soon.
                  </p>
                )}
              </details>


              <details className="group py-4 pb-16">
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <span className="text-sm font-medium transition-colors duration-200 group-open:text-orange-500">

                    Product Details
                  </span>
                  <span className="transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </details>
            </div>
          </div>
        </div>
        <div className="mt-20 mb-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="border-t border-gray-200"></div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 mb-4">
          <h2 className="text-xl md:text-2xl font-semibold tracking-wide uppercase">
            You may also like
          </h2>
        </div>
        <div className=" grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 px-8 py-6 mb:px-16 mb:py-12">
          {relatedProducts.map((relProduct) => {
            return (
              <div key={relProduct.id} className='flex flex-col group'>
                <div className="relative w-full h-[250px] bg-gray-100 overflow-hidden">

                  <a
                    href={`/shop/${relProduct.slug}`}
                    target="_parent"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={displayImage(relProduct)}
                      alt={relProduct.name}
                      className="w-full h-full object-cover transition duration-500 hover:scale-105"
                    />
                  </a>
                  <button
                    onClick={() => {
                      setLiked(prev => ({
                        ...prev,
                        [relProduct.id]: !prev[relProduct.id]
                      }));
                      setBurst(relProduct.id);
                      setTimeout(() => setBurst(null), 600);
                    }}
                    className="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-2 rounded-full shadow hover:scale-110 transition"
                  >
                    {liked[relProduct.id] ? (
                      <FaHeart className="text-red-500 text-xl animate-ping-once" />
                    ) : (
                      <FiHeart className="text-gray-800 text-xl" />
                    )}
                  </button>
                  {burst === relProduct.id && (
                    <FaHeart className="absolute bottom-10 right-5 text-red-500 text-xl animate-float" />
                  )}
                </div>
                <div className="mt-4 space-y-1">
                  <Link to={`/shop/${relProduct.slug}`}>
                    <h3 className="text-sm font-bold font-zentry hover:underline">
                      {relProduct.name}
                    </h3>
                  </Link>

                  <p className="text-sm text-gray-600">
                    KSH {parseFloat(relProduct.price).toLocaleString()}
                  </p>
                </div>

              </div>)
          })}
        </div>
      </section>
    </main>
  );
};

export default ProductPage;
