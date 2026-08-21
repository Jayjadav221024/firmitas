import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../api/client';

/**
 * Reads CMS section content for a page from the Firmitas backend.
 *
 * When the API is unreachable or a section has no saved content, `getField`
 * returns the caller's own default. Every call site already passes the copy the
 * page should show, so the public site renders correctly against an empty CMS —
 * no placeholder store required.
 */
export function useWebsiteContent(pageKey: string) {
  const [sections, setSections] = useState<any[]>([]);
  const [isPreview, setIsPreview] = useState(false);

  const fetchSections = useCallback(async () => {
    try {
      const data = await adminApi.getSectionsByPage(pageKey);
      setSections(Array.isArray(data) ? data : []);
    } catch {
      // Leave whatever we have; getField falls through to caller defaults.
    }
  }, [pageKey]);

  useEffect(() => {
    fetchSections();

    // Website Editor renders the site in an iframe with ?preview=true to show
    // unpublished drafts.
    const params = new URLSearchParams(window.location.search);
    setIsPreview(params.get('preview') === 'true');

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'REFRESH_PREVIEW') {
        fetchSections();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [pageKey, fetchSections]);

  /** Value of one field, preferring draft copy while previewing. */
  const getField = (sectionKey: string, fieldKey: string, defaultValue: string = ''): string => {
    const sec = sections.find((s: any) => s.key === sectionKey);
    if (!sec || !sec.content) return defaultValue;

    const data = isPreview
      ? (sec.content.draftData || sec.content.publishedData)
      : (sec.content.publishedData || sec.content.draftData);
    if (!data) return defaultValue;

    return data[fieldKey] !== undefined && data[fieldKey] !== '' ? data[fieldKey] : defaultValue;
  };

  /** The whole section object, merged over the caller's defaults. */
  const getSectionData = (sectionKey: string, defaultData: Record<string, any> = {}): Record<string, any> => {
    const sec = sections.find((s: any) => s.key === sectionKey);
    if (!sec || !sec.content) return defaultData;

    const data = isPreview
      ? (sec.content.draftData || sec.content.publishedData)
      : (sec.content.publishedData || sec.content.draftData);
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
