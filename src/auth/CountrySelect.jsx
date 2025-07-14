import React, { useEffect, useState } from 'react';
import { fetchCountries } from '../lib/api/countries';

export const CountrySelect = ({ onSelect, value }) => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCountries = async () => {
      const data = await fetchCountries();
      setCountries(data);
      setLoading(false);
    };
    getCountries();
  }, []);

  if (loading) return <div>Loading countries...</div>;

  return (
    <select value={value} onChange={(e) => onSelect(e.target.value)} className="p-2 border rounded-md w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white">
      {countries.map((country) => (
        <option key={country.code} value={country.dialCode}>
          {country.name} ({country.dialCode})
        </option>
      ))}
    </select>
  );
};