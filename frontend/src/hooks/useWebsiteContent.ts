import { useState, useEffect } from 'react';
import { adminApi } from '../api/client';
import { initialWebsiteSections } from '../services/adminDataService';

export function useWebsiteContent(pageKey: string) {
  const [sections, setSections] = useState<any[]>(() => {
    const cached = localStorage.getItem('firmitas_admin_website-sections');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed[pageKey]) return parsed[pageKey];
      } catch {}
    }
    return initialWebsiteSections[pageKey] || [];
  });

  const [isPreview, setIsPreview] = useState(false);

  const fetchSections = async () => {
    try {
      const data = await adminApi.getSectionsByPage(pageKey);
      if (data && data.length > 0) {
        setSections(data);
      }
    } catch {
      // Fallback already in place
    }
  };

  useEffect(() => {
    fetchSections();

    // Check if in iframe preview mode
    const params = new URLSearchParams(window.location.search);
    if (params.get('preview') === 'true') {
      setIsPreview(true);
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'REFRESH_PREVIEW') {
        fetchSections();
      }
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('storage', fetchSections);

    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('storage', fetchSections);
    };
  }, [pageKey]);

  /**
   * Get value of a specific field from a section, with automatic published/draft fallback
   */
  const getField = (sectionKey: string, fieldKey: string, defaultValue: string = ''): string => {
    const sec = sections.find((s: any) => s.key === sectionKey);
    if (!sec || !sec.content) return defaultValue;

    const data = isPreview ? (sec.content.draftData || sec.content.publishedData) : (sec.content.publishedData || sec.content.draftData);
    if (!data) return defaultValue;

    return data[fieldKey] !== undefined && data[fieldKey] !== '' ? data[fieldKey] : defaultValue;
  };

  /**
   * Get the whole section data object
   */
  const getSectionData = (sectionKey: string, defaultData: Record<string, any> = {}): Record<string, any> => {
    const sec = sections.find((s: any) => s.key === sectionKey);
    if (!sec || !sec.content) return defaultData;

    const data = isPreview ? (sec.content.draftData || sec.content.publishedData) : (sec.content.publishedData || sec.content.draftData);
    return data ? { ...defaultData, ...data } : defaultData;
  };

  return {
    sections,
    getField,
    getSectionData,
    isPreview,
    refresh: fetchSections
  };
}
