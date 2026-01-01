'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getContactDetails, getSocialMediaLinks, getFaqs } from '@/services/api.services';

// 1. Create the context
const CompanyInfoContext = createContext(null);

// 2. Create the provider component
export const CompanyInfoProvider = ({ children }) => {
    const [companyInfo, setCompanyInfo] = useState({
        contact: null,
        socials: null,
        faqs: null,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCompanyInfo = async () => {
            try {
                // Fetch all sets of data concurrently
                const [contactRes, socialRes, faqsRes] = await Promise.all([
                    getContactDetails(),
                    getSocialMediaLinks(),
                    getFaqs()
                ]);

                setCompanyInfo({
                    contact: contactRes.data,
                    socials: socialRes.data,
                    faqs: faqsRes.data,
                });
            } catch (error) {
                console.error("Failed to fetch company info:", error);
                // Set to empty objects to prevent app crash on destructuring
                setCompanyInfo({ contact: {}, socials: {}, faqs: {} });
            } finally {
                setIsLoading(false);
            }
        };

        fetchCompanyInfo();
    }, []); // Empty dependency array ensures this runs only once

    const value = { ...companyInfo, isLoading };

    return (
        <CompanyInfoContext.Provider value={value}>
            {children}
        </CompanyInfoContext.Provider>
    );
};

// 3. Create a custom hook for easy consumption
export const useCompanyInfo = () => {
    const context = useContext(CompanyInfoContext);
    if (context === null) {
        throw new Error('useCompanyInfo must be used within a CompanyInfoProvider');
    }
    return context;
};
