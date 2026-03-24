import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchOneFeature } from '../services/api';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ArrowLeft, Pencil, Calendar } from 'lucide-react';

const Article = () => {
  const { id } = useParams();
  const [feature, setFeature] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeature = async () => {
      try {
        const response = await fetchOneFeature(id);
        if (response && response.data) {
          setFeature(response.data);
        }
      } catch (err) {
        console.error('Failed to load the article', err);
      } finally {
        setLoading(false);
      }
    };
    loadFeature();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <p className="text-xl font-semibold">Loading article...</p>
      </div>
    );
  }

  if (!feature) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 space-y-4">
        <h2 className="text-2xl font-bold">Article not found</h2>
        <Link to="/blog" className="text-blue-600 hover:underline flex items-center gap-2 font-medium">
          <ArrowLeft size={16} /> Back to Blog
        </Link>
      </div>
    );
  }

  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (!url.startsWith('http')) return null; // Likely a file path

    // YouTube
    const ytMatch = url.match(/(?:\?v=|&v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[3]}`;

    return null;
  };

  const embedUrl = getEmbedUrl(feature.video);

  return (
    <article className="min-h-screen bg-white pb-20">
      {/* Hero section */}
      <div className="w-full h-[50vh] relative">
        <img 
          src={feature.image || 'https://via.placeholder.com/1200x800'} 
          alt={feature.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-12">
          <div className="max-w-4xl mx-auto w-full">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4 tracking-tight">
              {feature.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-200 text-sm font-medium">
              <span>By {feature.author}</span>
              <span className="text-gray-500">•</span>
              <span>{new Date(feature.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-12">
        {/* Content section */}
        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
          <ReactMarkdown
            components={{
              code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    {...props}
                    children={String(children).replace(/\n$/, '')}
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    className="rounded-lg my-8 text-sm"
                  />
                ) : (
                  <code {...props} className="bg-gray-100 text-orange-600 px-1.5 py-0.5 rounded text-sm font-semibold">
                    {children}
                  </code>
                );
              }
            }}
          >
            {feature.content}
          </ReactMarkdown>
        </div>
        
        {/* Dynamic Video: File or URL */}
        {feature.video && (
          <div className="mt-12 pt-12 border-t border-gray-100">
            <h3 className="text-xl font-bold mb-6 text-gray-900">Featured Video</h3>
            <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-black">
              {embedUrl ? (
                <iframe
                  className="w-full h-full"
                  src={embedUrl}
                  title="Video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <video controls className="w-full h-full" src={feature.video} />
              )}
            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="mt-16">
          <Link to="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-orange-600 font-bold uppercase tracking-wider transition-colors text-sm">
            <ArrowLeft size={16} /> Back to stories
          </Link>
        </div>
      </div>
    </article>
  );
};

export default Article;
