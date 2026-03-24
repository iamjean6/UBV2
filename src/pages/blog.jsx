import { useState, useEffect } from 'react';
import { Pencil, Type, MessageCircle } from 'lucide-react';
import { fetchFeatures } from '../services/api';
import FeatureCard from '../UI/featurecard';

const Blog = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const loadFeatures = async () => {
      try {
        setLoading(true);
        const response = await fetchFeatures(page, 9);
        if (response && response.data) {
          setFeatures(prev => page === 1 ? response.data : [...prev, ...response.data]);
          setHasMore(page < response.totalPages);
        }
      } catch (err) {
        console.error('Failed to load featured stories', err);
      } finally {
        setLoading(false);
      }
    };
    loadFeatures();
  }, [page]);

  if (loading && page === 1) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
        <p className="font-semibold text-xl">Loading stories...</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen w-full bg-gray-100 py-16'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl uppercase font-extrabold mb-4'>
            Our Blog
          </h2>
          <p className='text-lg text-gray-400 pb-16'>
            Read our featured stories
          </p>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10 text-left'>
            {features.map((feature, idx) => (
              <FeatureCard key={feature._id || idx} article={feature} idx={idx} />
            ))}
          </div>

          {features.length === 0 && !loading && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 py-12 text-center text-gray-500">
              No featured stories yet. Check back soon!
            </div>
          )}

          {hasMore && (
            <div className="mt-12 text-center">
              <button 
                onClick={() => setPage(p => p + 1)}
                className="px-6 py-3 bg-blue-600 text-white font-bold rounded hover:bg-orange-600 transition"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More Stories'}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Blog;