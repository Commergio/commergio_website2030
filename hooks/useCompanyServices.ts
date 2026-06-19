'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { CompanyService } from '@/lib/types';
import { FALLBACK_COMPANY_SERVICES, normalizeCompanyService } from '@/lib/services-fallback';

type Options = {
  homepageOnly?: boolean;
  publishedOnly?: boolean;
};

export function useCompanyServices(options: Options = {}) {
  const { homepageOnly = false, publishedOnly = true } = options;
  const [services, setServices] = useState<CompanyService[]>(FALLBACK_COMPANY_SERVICES);
  const [loading, setLoading] = useState(true);
  const [fromDatabase, setFromDatabase] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      let query = supabase.from('company_services').select('*').order('display_order', { ascending: true });

      if (publishedOnly) {
        query = query.eq('is_published', true);
      }
      if (homepageOnly) {
        query = query.eq('show_on_homepage', true);
      }

      const { data, error } = await query;

      if (!error && data) {
        setServices(data.map((row) => normalizeCompanyService(row as Record<string, unknown>)));
        setFromDatabase(true);
      } else {
        let fallback = [...FALLBACK_COMPANY_SERVICES];
        if (publishedOnly) fallback = fallback.filter((s) => s.is_published);
        if (homepageOnly) fallback = fallback.filter((s) => s.show_on_homepage);
        setServices(fallback);
        setFromDatabase(false);
      }
      setLoading(false);
    };

    load();
  }, [homepageOnly, publishedOnly]);

  return { services, loading, fromDatabase };
}
