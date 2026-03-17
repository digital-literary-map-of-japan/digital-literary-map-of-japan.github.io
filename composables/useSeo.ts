interface BreadcrumbItem {
  title: string;
  to?: string;
}

export const useSeo = () => {
  const { locale } = useI18n();
  const publicRuntimeConfig = useRuntimeConfig().public;
  const route = useRoute();

  const appURL = publicRuntimeConfig.appURL as string || '';
  const siteName = publicRuntimeConfig.siteName as string || '';

  const currentUrl = computed(() => {
    let path = route.path;
    if (!path.endsWith('/')) {
      path += '/';
    }
    return `${appURL}${path}`;
  });
  const ogLocale = computed(() => locale.value === 'ja' ? 'ja_JP' : 'en_US');
  const altLocale = computed(() => locale.value === 'ja' ? 'en_US' : 'ja_JP');

  const setPageMeta = (options: {
    title: string;
    description?: string;
    image?: string;
    noindex?: boolean;
  }) => {
    const fullTitle = `${options.title} - ${siteName}`;
    const description = options.description || '';
    const image = options.image || `${appURL}/home.jpg`;

    const meta: any[] = [
      { property: 'og:title', content: fullTitle },
      { property: 'og:url', content: currentUrl.value },
      { property: 'og:locale', content: ogLocale.value },
      { property: 'og:locale:alternate', content: altLocale.value },
    ];

    if (description) {
      meta.push({ name: 'description', content: description });
      meta.push({ property: 'og:description', content: description });
      meta.push({ name: 'twitter:description', content: description });
    }

    if (image) {
      meta.push({ property: 'og:image', content: image });
      meta.push({ name: 'twitter:image', content: image });
    }

    if (options.noindex) {
      meta.push({ name: 'robots', content: 'noindex, nofollow' });
    }

    useHead({
      title: fullTitle,
      meta,
      link: [
        { rel: 'canonical', href: currentUrl.value },
      ],
    });
  };

  const setBreadcrumbJsonLd = (items: BreadcrumbItem[]) => {
    const listItems = items.map((item, index) => {
      let itemUrl = item.to ? `${appURL}${item.to}` : undefined;
      if (itemUrl && !itemUrl.endsWith('/')) {
        itemUrl += '/';
      }
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: item.title,
        ...(itemUrl ? { item: itemUrl } : {}),
      };
    });

    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: listItems,
          }),
        },
      ],
    });
  };

  const setOrganizationJsonLd = () => {
    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: siteName,
            url: appURL,
            description: '歌枕・名所アノテーションツール / An annotation tool for Japanese literary places',
            inLanguage: ['ja', 'en'],
            publisher: {
              '@type': 'Organization',
              name: siteName,
              url: appURL,
              logo: {
                '@type': 'ImageObject',
                url: `${appURL}/home.jpg`,
              },
            },
          }),
        },
      ],
    });
  };

  const setPlaceJsonLd = (options: {
    name: string;
    alternateName?: string;
    description?: string;
    latitude?: number;
    longitude?: number;
    addressRegion?: string;
    addressLocality?: string;
    url?: string;
    keywords?: string[];
  }) => {
    const jsonLd: Record<string, any> = {
      '@context': 'https://schema.org',
      '@type': 'Place',
      name: options.name,
      url: options.url || currentUrl.value,
    };

    if (options.alternateName) {
      jsonLd.alternateName = options.alternateName;
    }

    if (options.description) {
      jsonLd.description = options.description;
    }

    if (options.latitude && options.longitude) {
      jsonLd.geo = {
        '@type': 'GeoCoordinates',
        latitude: options.latitude,
        longitude: options.longitude,
      };
    }

    if (options.addressRegion || options.addressLocality) {
      jsonLd.address = {
        '@type': 'PostalAddress',
        ...(options.addressRegion ? { addressRegion: options.addressRegion } : {}),
        ...(options.addressLocality ? { addressLocality: options.addressLocality } : {}),
        addressCountry: 'JP',
      };
    }

    if (options.keywords && options.keywords.length > 0) {
      jsonLd.keywords = options.keywords.join(', ');
    }

    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(jsonLd),
        },
      ],
    });
  };

  return {
    setPageMeta,
    setBreadcrumbJsonLd,
    setOrganizationJsonLd,
    setPlaceJsonLd,
    appURL,
    siteName,
    currentUrl,
    ogLocale,
  };
};
