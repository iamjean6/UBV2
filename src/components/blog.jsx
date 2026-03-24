import { useState, useEffect } from 'react';
import { fetchFeatures } from '../services/api';
import FeatureCard from '../UI/featurecard';

const Blog = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatures = async () => {
      try {
        const result = await fetchFeatures(1, 3);
        setFeatures(result.data);
      } catch (error) {
        console.error("Error loading home blog:", error);
      } finally {
        setLoading(false);
      }
    };
    loadFeatures();
  }, []);

  if (loading) return <div className="py-20 text-center">Loading latest stories...</div>;

  return (
    <div className='min-h-screen w-full bg-gray-100 py-16'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='text-center mb-16 '>
            <h2 className='text-3xl md:text-4xl uppercase font-extrabold mb-4'>
                Our Blog
            </h2>
            <p className='text-lg text-gray-400 pb-16 '>
                Read about recent team activities
            </p>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10 text-left'>
                {features.map((feature, idx) => (
                    <FeatureCard key={feature._id || idx} article={feature} idx={idx} />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;