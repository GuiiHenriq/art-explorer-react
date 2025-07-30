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

    if (searchParams.artistName.trim() && !searchParams.departmentId) {
      params.artistOrCulture = true;
      params.q = searchParams.artistName.trim();
    } else if (searchParams.artistName.trim() && searchParams.departmentId) {
      const artistQuery = searchParams.artistName.trim();
      const baseQuery = searchParams.q.trim() || 'painting';
      params.q = `${baseQuery} ${artistQuery}`;
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
      if (!params.q) {
        params.q = 'portrait';
      }
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
    <div className="bg-gradient-to-r from-slate-50 to-amber-50/50 border-2 border-slate-200 shadow-lg p-6 sm:p-8 mb-12 backdrop-blur-sm">
      <form onSubmit={handleSearch} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-serif font-medium text-slate-700 mb-3 tracking-wide"
            >
              Search Collection
            </label>
            <input
              type="text"
              id="search"
              value={searchParams.q}
              onChange={(e) => handleInputChange('q', e.target.value)}
              placeholder="Mona Lisa, impressionism, landscape..."
              className="w-full px-4 py-3 border-2 border-slate-200 bg-white/80 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300 font-light tracking-wide placeholder:text-slate-400"
            />
          </div>

          <div>
            <label
              htmlFor="artist"
              className="block text-sm font-serif font-medium text-slate-700 mb-3 tracking-wide"
            >
              Artist Name
            </label>
            <input
              type="text"
              id="artist"
              value={searchParams.artistName}
              onChange={(e) => handleInputChange('artistName', e.target.value)}
              placeholder="Vincent van Gogh, Picasso..."
              className="w-full px-4 py-3 border-2 border-slate-200 bg-white/80 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300 font-light tracking-wide placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-amber-700 hover:text-amber-800 text-sm font-serif font-medium self-start transition-colors duration-300 border-b border-transparent hover:border-amber-600 pb-1"
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Search
          </button>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleClear}
              className="px-6 py-3 text-slate-600 border-2 border-slate-300 bg-white/80 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 font-serif tracking-wide"
            >
              Clear Search
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-amber-600 hover:to-amber-700 text-white border-2 border-slate-600 hover:border-amber-500 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed font-serif tracking-wide shadow-lg"
            >
              {isLoading ? 'Searching Collection...' : 'Search Gallery'}
            </button>
          </div>
        </div>

        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t-2 border-amber-200/50">
            <div>
              <label
                htmlFor="dateBegin"
                className="block text-sm font-serif font-medium text-slate-700 mb-3 tracking-wide"
              >
                Period Start
              </label>
              <input
                type="number"
                id="dateBegin"
                value={searchParams.dateBegin}
                onChange={(e) => handleInputChange('dateBegin', e.target.value)}
                placeholder="1800"
                min="0"
                max="2024"
                className="w-full px-4 py-3 border-2 border-slate-200 bg-white/80 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300 font-light tracking-wide placeholder:text-slate-400"
              />
            </div>

            <div>
              <label
                htmlFor="dateEnd"
                className="block text-sm font-serif font-medium text-slate-700 mb-3 tracking-wide"
              >
                Period End
              </label>
              <input
                type="number"
                id="dateEnd"
                value={searchParams.dateEnd}
                onChange={(e) => handleInputChange('dateEnd', e.target.value)}
                placeholder="1900"
                min="0"
                max="2024"
                className="w-full px-4 py-3 border-2 border-slate-200 bg-white/80 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300 font-light tracking-wide placeholder:text-slate-400"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <label
                htmlFor="medium"
                className="block text-sm font-serif font-medium text-slate-700 mb-3 tracking-wide"
              >
                Technique
              </label>
              <input
                type="text"
                id="medium"
                value={searchParams.medium}
                onChange={(e) => handleInputChange('medium', e.target.value)}
                placeholder="Oil on canvas, Bronze..."
                className="w-full px-4 py-3 border-2 border-slate-200 bg-white/80 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300 font-light tracking-wide placeholder:text-slate-400"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label
                htmlFor="department"
                className="block text-sm font-serif font-medium text-slate-700 mb-3 tracking-wide"
              >
                Museum Department
              </label>
              <select
                id="department"
                value={searchParams.departmentId}
                onChange={(e) => handleInputChange('departmentId', e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 bg-white/80 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300 font-light tracking-wide"
                disabled={loadingDepartments}
              >
                <option value="">All Museum Departments</option>
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
