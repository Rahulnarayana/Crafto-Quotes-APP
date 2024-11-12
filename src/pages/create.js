import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { uploadImage, createQuote } from '../utils/api';
import { useRouter } from 'next/router';
import { PaperClipIcon } from '@heroicons/react/20/solid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from '@/components/MenuBar';
import Footer from '@/components/Footer';

const CreateQuotePage = () => {
  const token = useSelector((state) => state.auth.token);
  const [text, setText] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [imageError, setImageError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!token) {
      router.push('/');
    }
  }, [token, router]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type !== 'image/jpeg') {
      setImageError('Only .jpg files are allowed.');
      setMediaUrl('');
      toast.error('Only .jpg files are allowed.');
      return;
    }

    setImageError('');
    const formData = new FormData();
    formData.append('file', file);
    setImageLoading(true);

    try {
      const response = await uploadImage(formData);
      setMediaUrl(response.data[0].url);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Image upload failed. Please try again.');
    } finally {
      setImageLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createQuote(token, text, mediaUrl);
      toast.success('Quote created successfully!');
      setTimeout(() => {
        setLoading(true); // Ensures overlay loader persists until navigation
        router.push('/quotes');
      }, 1000);
    } catch (error) {
      toast.error('Quote creation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <ToastContainer />
      {(loading || imageLoading) && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      )}
      <main className="flex-grow flex flex-col items-center p-4">
        <div className="w-full max-w-2xl">
          <h1 className="text-2xl font-bold mb-4">Create Quote</h1>
          <form onSubmit={handleSubmit} className="relative">
            <div className="rounded-lg border border-gray-300 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
              <input
                type="text"
                placeholder="Quote text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="block w-full border-0 pt-2.5 text-lg font-medium placeholder-gray-400 focus:ring-0"
                required
              />
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 px-2 py-2 sm:px-3">
              <button
                type="button"
                onClick={() => document.getElementById('fileInput').click()}
                className="group inline-flex items-center text-left text-gray-400"
              >
                <input
                  type="file"
                  id="fileInput"
                  accept=".jpg"
                  onChange={handleImageUpload}
                  className="hidden"
                  required
                />
                <PaperClipIcon className="h-5 w-5 mr-2 text-gray-500" />
                <span className="text-sm italic text-gray-500">Attach a .jpg file</span>
              </button>
              {imageLoading && <p>Uploading image...</p>}
              {imageError && <p className="text-red-500">{imageError}</p>}

              <button
                type="submit"
                disabled={text && mediaUrl? false :true}
                className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm ${
                  text && mediaUrl ?  'bg-blue-500 text-white hover:bg-blue-600 focus-visible:outline-blue-500'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateQuotePage;
