import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getQuotes } from '../utils/api';
import Link from 'next/link';
import NavBar from '@/components/MenuBar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/router';

const QuotesPage = () => {
  const router = useRouter();
  const token = useSelector((state) => state.auth.token);
  const [quotes, setQuotes] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(false); // Track if there's an error

  const limit = 20;

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!token) {
      router.push('/');
      return;
    }

    const fetchQuotes = async () => {
      if (loading || !hasMore) return;

      setLoading(true);
      setError(false); // Reset error state when fetching starts

      try {
        console.log("Fetching quotes with token:", token);
        const response = await getQuotes(token, limit, offset);
        console.log("Response:", response);

        if (response.data.length > 0) {
          setQuotes((prev) => [...prev, ...response.data]);
          setOffset((prev) => prev + limit);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Failed to fetch quotes:', error.message);
        setError(true); // Set error state if fetching fails
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, [token, offset, loading, hasMore, router]);

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex-grow p-4">
        <Link href="/create" className="fixed bottom-5 right-5 bg-blue-500 text-white p-3 rounded-full">
          Create Quote
        </Link>
        <h1 className="text-2xl font-bold mb-4 flex-1 text-center">Quotes</h1>
        
        {/* Show error message if there's an error and no quotes */}
        {error && quotes.length === 0 ? (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-red-600 mb-4">Something Went Wrong!</h1>
              <p className="text-lg text-gray-700 mb-6">We encountered an unexpected error. Please try again later.</p>
              <Link href="/" className="text-blue-500 underline">Go back to Home</Link>
            </div>
          </div>
        ) : (
          <>
            <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {quotes.map((quote) => (
                <li key={quote.id} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
                  <div className="flex w-full items-center space-x-6 p-6">
                    <img alt="" src={quote.mediaUrl} className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300" />
                    <div className="flex-1 truncate">
                      <h3 className="truncate text-sm font-medium text-gray-900">{quote.text}</h3>
                      <p className="text-sm text-gray-500 mt-2">
                        {quote.username} - {new Date(quote.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {loading ? (
              <div className="flex items-center justify-center mt-4">
                <button className="bg-gray-500 text-white p-2 rounded" disabled>
                  Loading...
                </button>
              </div>
            ) : (
              hasMore && (
                <button
                  onClick={() => setOffset((prev) => prev + limit)}
                  className="mt-4 w-full bg-blue-500 text-white p-2 rounded"
                >
                  Load More Quotes
                </button>
              )
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default QuotesPage;
