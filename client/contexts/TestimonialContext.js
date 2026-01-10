"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { getPublicTestimonials } from '@/services/api.services';

const TestimonialContext = createContext();

export const useTestimonials = () => {
    return useContext(TestimonialContext);
};

export const TestimonialProvider = ({ children }) => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await getPublicTestimonials();
                if (response.success) {
                    setTestimonials(response.data);
                } else {
                    setError(response.message);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTestimonials();
    }, []);

    const value = {
        testimonials,
        loading,
        error,
    };

    return (
        <TestimonialContext.Provider value={value}>
            {children}
        </TestimonialContext.Provider>
    );
};
