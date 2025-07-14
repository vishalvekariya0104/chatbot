import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { phoneNumberSchema, otpSchema } from '../lib/zod-schemas';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../lib/toast';
import { useNavigate } from 'react-router-dom';
import { CountrySelect } from '../auth/CountrySelect';

export const LoginPage = () => {
    const [step, setStep] = useState('phone');
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const {
        register: phoneRegister,
        handleSubmit: handlePhoneSubmit,
        formState: { errors: phoneErrors },
        setValue: setPhoneValue,
        watch: watchPhone,
    } = useForm({
        resolver: zodResolver(phoneNumberSchema),
        defaultValues: {
        dialCode: '+91',
        phoneNumber: '',
        },
    });

    const {
        register: otpRegister,
        handleSubmit: handleOtpSubmit,
        formState: { errors: otpErrors },
    } = useForm({
        resolver: zodResolver(otpSchema),
    });

    const currentDialCode = watchPhone('dialCode');

    const onSendOtp = async (data) => {
        setIsSendingOtp(true);
        showToast('info', 'Sending OTP...');

        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSendingOtp(false);
        setStep('otp');
        showToast('success', 'OTP sent to your number!');
    };

    const onVerifyOtp = async (data) => {
        setIsVerifyingOtp(true);
        showToast('info', 'Verifying OTP...');

        await new Promise(resolve => setTimeout(resolve, 1500));

        login({ userId: 'user123', name: 'Test User' });
        showToast('success', 'Login successful!');
        navigate('/dashboard');

        setIsVerifyingOtp(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 dark:from-gray-800 dark:to-black">
            <div className="max-w-md w-full mx-auto p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
                {step === 'phone' ? 'Login' : 'Verify OTP'}
                </h2>

                {step === 'phone' && (
                    <form onSubmit={handlePhoneSubmit(onSendOtp)} className="space-y-6">
                        <div>
                            <label htmlFor="dialCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Country Code
                            </label>
                            <CountrySelect
                                value={currentDialCode}
                                onSelect={(val) => setPhoneValue('dialCode', val)}
                            />
                            {phoneErrors.dialCode && (
                                <p className="mt-2 text-sm text-red-600">{phoneErrors.dialCode.message}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                id="phoneNumber"
                                {...phoneRegister('phoneNumber')}
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="e.g., 9876543210"
                            />
                            {phoneErrors.phoneNumber && (
                                <p className="mt-2 text-sm text-red-600">{phoneErrors.phoneNumber.message}</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
                            disabled={isSendingOtp}
                        >
                            {isSendingOtp ? 'Sending OTP...' : 'Send OTP'}
                        </button>
                    </form>
                )}

                {step === 'otp' && (
                    <form onSubmit={handleOtpSubmit(onVerifyOtp)} className="space-y-6">
                        <div>
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Enter 6-digit OTP
                            </label>
                            <input
                                type="text"
                                id="otp"
                                {...otpRegister('otp')}
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                maxLength={6}
                                placeholder="e.g., 123456"
                            />
                            {otpErrors.otp && (
                                <p className="mt-2 text-sm text-red-600">{otpErrors.otp.message}</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
                            disabled={isVerifyingOtp}
                        >
                            {isVerifyingOtp ? 'Verifying...' : 'Verify OTP'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep('phone')}
                            className="w-full mt-4 text-sm text-blue-600 hover:underline dark:text-blue-400"
                        >
                            Edit phone number
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};