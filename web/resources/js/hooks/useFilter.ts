import { useState, useMemo } from 'react';

type FilterableValue = string | number | boolean | null | undefined;

interface UseFilterOptions<T> {
  items: T[];
  searchFields: (keyof T)[];
  getNestedValue?: (item: T, field: keyof T) => FilterableValue;
}

export function useFilter<T>({ items, searchFields, getNestedValue }: UseFilterOptions<T>) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) {
      return items;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();

    return items.filter((item) => {
      return searchFields.some((field) => {
        const value = getNestedValue ? getNestedValue(item, field) : item[field];
        if (value == null) return false;
        return String(value).toLowerCase().includes(lowerSearchTerm);
      });
    });
  }, [items, searchTerm, searchFields, getNestedValue]);

  return {
    searchTerm,
    setSearchTerm,
    filteredItems,
  };
}
