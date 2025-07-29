import React, { useState, useEffect, useRef } from 'react';
import { MetAPI } from '../services/metAPI';
import type { Department, SearchParams } from '../types/artwork';

interface SearchBarProps {
  onSearch: (searchParams: SearchParams) => void;
  isLoading?: boolean;
  onClear?: () => void;
}

export default function SearchBar({ onSearch, isLoading = false, onClear }: SearchBarProps) {
  const [searchParams, setSearchParams] = useState({
    q: '',
    artistName: '',
    dateBegin: '',
    dateEnd: '',
    medium: '',
    departmentId: '',
  });

  const [departments, setDepartments] = useState<Department[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const departmentsLoaded = useRef(false);

  useEffect(() => {
    if (!departmentsLoaded.current) {
      departmentsLoaded.current = true;
      loadDepartments();
    }
  }, []);

  const loadDepartments = async () => {
    try {
      setLoadingDepartments(true);
      const response = await MetAPI.getDepartments();
      setDepartments(response.departments || []);
    } catch (error) {
      console.error('Error loading departments:', error);
    } finally {
      setLoadingDepartments(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params: SearchParams = {
      hasImages: true,
    };

    if (searchParams.q.trim()) {
      params.q = searchParams.q.trim();
    }

    if (searchParams.artistName.trim()) {
      params.artistOrCulture = true;
      params.q = searchParams.artistName.trim();
    }

    if (searchParams.dateBegin) {
      params.dateBegin = parseInt(searchParams.dateBegin);
    }

    if (searchParams.dateEnd) {
      params.dateEnd = parseInt(searchParams.dateEnd);
    }

    if (searchParams.medium.trim()) {
      params.medium = searchParams.medium.trim();
    }

    if (searchParams.departmentId) {
      params.departmentId = parseInt(searchParams.departmentId);
    }

    onSearch(params);
  };

  const handleClear = () => {
    setSearchParams({
      q: '',
      artistName: '',
      dateBegin: '',
      dateEnd: '',
      medium: '',
      departmentId: '',
    });
    if (onClear) {
      onClear();
    } else {
      onSearch({ hasImages: true, q: 'painting' });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-8">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search by title or description
            </label>
            <input
              type="text"
              id="search"
              value={searchParams.q}
              onChange={(e) => handleInputChange('q', e.target.value)}
              placeholder="Ex: Mona Lisa, impressionism, landscape..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="artist" className="block text-sm font-medium text-gray-700 mb-2">
              Artist
            </label>
            <input
              type="text"
              id="artist"
              value={searchParams.artistName}
              onChange={(e) => handleInputChange('artistName', e.target.value)}
              placeholder="Ex: Vincent van Gogh, Picasso..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium self-start"
          >
            {showAdvanced ? 'Hide' : 'Show'} advanced search
          </button>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label htmlFor="dateBegin" className="block text-sm font-medium text-gray-700 mb-2">
                Initial date
              </label>
              <input
                type="number"
                id="dateBegin"
                value={searchParams.dateBegin}
                onChange={(e) => handleInputChange('dateBegin', e.target.value)}
                placeholder="Ex: 1800"
                min="0"
                max="2024"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="dateEnd" className="block text-sm font-medium text-gray-700 mb-2">
                Final date
              </label>
              <input
                type="number"
                id="dateEnd"
                value={searchParams.dateEnd}
                onChange={(e) => handleInputChange('dateEnd', e.target.value)}
                placeholder="Ex: 1900"
                min="0"
                max="2024"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <label htmlFor="medium" className="block text-sm font-medium text-gray-700 mb-2">
                Technique
              </label>
              <input
                type="text"
                id="medium"
                value={searchParams.medium}
                onChange={(e) => handleInputChange('medium', e.target.value)}
                placeholder="Ex: Oil on canvas, Bronze..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                id="department"
                value={searchParams.departmentId}
                onChange={(e) => handleInputChange('departmentId', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loadingDepartments}
              >
                <option value="">All departments</option>
                {departments.map((dept) => (
                  <option key={dept.departmentId} value={dept.departmentId}>
                    {dept.displayName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
