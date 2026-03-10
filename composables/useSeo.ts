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

  const currentUrl = computed(() => `${appURL}${route.path}`);
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
    const listItems = items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.title,
      ...(item.to ? { item: `${appURL}${item.to}` } : {}),
    }));

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

  return {
    setPageMeta,
    setBreadcrumbJsonLd,
    setOrganizationJsonLd,
    appURL,
    siteName,
    currentUrl,
    ogLocale,
  };
};
