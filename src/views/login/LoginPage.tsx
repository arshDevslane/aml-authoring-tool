/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button } from '@/shared-resources/ui/button';
import { Input } from '@/shared-resources/ui/input';
import { useDispatch } from 'react-redux';
import { authLoginAction } from '@/store/actions/auth.action';

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: yup.object().shape({
      email: yup.string().required('email is required'),
      password: yup.string().required('Password is required'),
    }),

    onSubmit: (values: { email: string; password: string }) => {
      const loginValues = {
        password: values.password,
        email: values.email,
      };
      dispatch(authLoginAction(loginValues));
    },
  });

  return (
    <div className='min-h-screen relative flex items-center justify-center'>
      {/* Login Card */}
      <div className='relative z-10 max-w-md w-full bg-white rounded-lg shadow-lg p-8'>
        <h1 className='text-3xl font-semibold text-gray-800 text-center mb-4'>
          AML Authoring Tool
        </h1>
        <p className='text-gray-600 text-center text-base mb-6'>
          Welcome! Please log in to continue.
        </p>
        <form onSubmit={formik.handleSubmit}>
          <div className='space-y-6'>
            {/* email */}
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700'
              >
                Email
              </label>
              <Input
                id='email'
                name='email'
                value={formik.values.email}
                className='block w-full h-12 px-4 mt-2 border border-gray-300 rounded-lg shadow-sm text-gray-700 focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all'
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
              {formik.touched.email && formik.errors.email && (
                <div className='text-red-500 text-sm mt-1'>
                  {formik.errors.email}
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700'
              >
                Password
              </label>
              <Input
                id='password'
                name='password'
                type='password'
                value={formik.values.password}
                className='block w-full h-12 px-4 mt-2 border border-gray-300 rounded-lg shadow-sm text-gray-700 focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all'
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
              {formik.touched.password && formik.errors.password && (
                <div className='text-red-500 text-sm mt-1'>
                  {formik.errors.password}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className='flex justify-center'>
              <Button
                type='submit'
                className='w-full py-3 text-lg font-medium text-white bg-gray-700 rounded-lg shadow-md hover:bg-gray-800 focus:ring-4 focus:ring-gray-400 transition-transform transform hover:scale-105'
              >
                Login
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
