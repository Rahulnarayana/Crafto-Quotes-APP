// src/pages/index.js
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/authSlice';
import { login } from '../utils/api';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e) => {
    
    e.preventDefault();

    // Basic validation for empty fields
    if (!username || !otp) {
      toast.warn('Please enter both username and OTP.', {
        autoClose: 3000,
        position: 'top-center',
      });
      return;  // Prevent form submission if validation fails
    }

    try {
      // Show loading toast or info toast
      toast.info('Logging in...', {
        autoClose: 2000,  // auto close after 2 seconds
        position: 'top-center',
      });

      // Perform the login request
      const response = await login(username, otp);

      // Dispatch credentials to Redux store
      dispatch(setCredentials({ token: response.data.token, username }));

      // Show success toast after successful login
      toast.success('Login successful!', {
        position: 'top-right',
        autoClose: 3000,
      });

      // Redirect to the quotes page
      setTimeout(() => {
        router.push('/quotes');
      }, 2000); //
    } catch (error) {
      // Handle login error and show error toast
      console.error('Login failed', error);
      toast.error('Login failed. Please check your credentials.', {
        position: 'top-center',
        autoClose: 5000,
      });

      // Clear the input fields if login fails
      setUsername("");
      setOtp("");
    }
  };

  return (

    <>
      <div className="flex min-h-screen flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className='flex justify-center space-x-2 space-y-2'>
            <img
              alt="Kutumb app"
              src="data:image/jpeg;base64,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"
              className=" h-12 w-auto"
            />


            <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
              Crafto
            </h2>
          </div>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm/6 font-medium text-gray-900">
                  Username
                </label>
                <div className="mt-2">
                  <input
                    id="Username"
                    name="Username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="Username"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm/6 font-medium text-gray-900">
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={!username || !otp}
                  className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${username && otp
                      ? 'bg-blue-500 text-white hover:bg-blue-600 focus-visible:outline-blue-500'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
          <ToastContainer />

        </div>
      </div>

    </>

  );
};

export default LoginPage;
