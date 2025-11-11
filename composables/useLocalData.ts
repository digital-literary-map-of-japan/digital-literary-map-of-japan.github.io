/**
 * ローカルJSONデータを読み込むためのcomposable
 * CMSとのAPI通信の代わりにローカルのJSONファイルからデータを取得する
 */

import fs from 'fs';
import path from 'path';

export const useLocalData = () => {
  /**
   * ローカルJSONデータを読み込む汎用関数
   */
  const fetchLocalData = async (filePath: string) => {
    try {
      // サーバーサイド（プリレンダリング、SSR）の場合
      if (import.meta.server) {
        const fullPath = path.resolve(process.cwd(), 'public/data', filePath);
        if (fs.existsSync(fullPath)) {
          const data = fs.readFileSync(fullPath, 'utf-8');
          return JSON.parse(data);
        } else {
          console.error(`File not found: ${fullPath}`);
          return null;
        }
      }

      // クライアントサイドの場合
      const response = await fetch(`/data/${filePath}`);
      if (!response.ok) {
        console.error(`Failed to load local data: ${filePath}`);
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error(`Error loading local data from ${filePath}:`, error);
      return null;
    }
  };

  /**
   * スポット一覧を取得
   */
  const fetchSpots = async (lang: string = 'ja') => {
    const langPath = lang === 'en' ? 'en/' : '';
    return await fetchLocalData(`${langPath}jsonapi/node/spots.json`);
  };

  /**
   * 特定のスポットを取得
   */
  const fetchSpot = async (fieldId: string, lang: string = 'ja') => {
    const spotsData = await fetchSpots(lang);
    if (!spotsData || !spotsData.data) return null;

    return spotsData.data.find(
      (spot: any) => spot.attributes.field_id === fieldId
    );
  };

  /**
   * スポットの詳細データ（index/data）を取得
   */
  const fetchSpotDetails = async (fieldId: string) => {
    return await fetchLocalData(`jsonapi/index/data/${fieldId}.json`);
  };

  /**
   * ドキュメント一覧を取得
   */
  const fetchDocuments = async (fieldId?: string, lang: string = 'ja') => {
    const langPath = lang === 'en' ? 'en/' : '';
    const documentsData = await fetchLocalData(`${langPath}jsonapi/node/documents.json`);

    if (!documentsData || !documentsData.data) return null;

    // fieldIdが指定されている場合はフィルタリング
    if (fieldId) {
      return {
        ...documentsData,
        data: documentsData.data.filter(
          (doc: any) => doc.attributes.field_id === fieldId
        )
      };
    }

    return documentsData;
  };

  /**
   * 詩一覧を取得
   */
  const fetchPoems = async (lang: string = 'ja') => {
    const langPath = lang === 'en' ? 'en/' : '';
    return await fetchLocalData(`${langPath}jsonapi/node/poems.json`);
  };

  /**
   * 散文一覧を取得
   */
  const fetchSanbuns = async (lang: string = 'ja') => {
    const langPath = lang === 'en' ? 'en/' : '';
    return await fetchLocalData(`${langPath}jsonapi/node/sanbuns.json`);
  };

  /**
   * 謡曲一覧を取得
   */
  const fetchYokyokus = async (lang: string = 'ja') => {
    const langPath = lang === 'en' ? 'en/' : '';
    return await fetchLocalData(`${langPath}jsonapi/node/yokyokus.json`);
  };

  /**
   * 画像一覧を取得
   */
  const fetchImages = async (lang: string = 'ja') => {
    const langPath = lang === 'en' ? 'en/' : '';
    return await fetchLocalData(`${langPath}jsonapi/node/images.json`);
  };

  /**
   * 詩の翻訳を取得
   */
  const fetchPoemsTranslations = async (lang: string = 'ja') => {
    const langPath = lang === 'en' ? 'en/' : '';
    return await fetchLocalData(`${langPath}jsonapi/node/poems_translations.json`);
  };

  /**
   * 散文の翻訳を取得
   */
  const fetchSanbunsTranslations = async (lang: string = 'ja') => {
    const langPath = lang === 'en' ? 'en/' : '';
    return await fetchLocalData(`${langPath}jsonapi/node/sanbuns_translations.json`);
  };

  /**
   * 固定ページを取得
   */
  const fetchPage = async (pageId: string, lang: string = 'ja') => {
    const langPath = lang === 'en' ? 'en/' : '';
    return await fetchLocalData(`${langPath}jsonapi/node/page/${pageId}.json`);
  };

  /**
   * field_idで固定ページを検索
   */
  const fetchPageByFieldId = async (fieldId: string, lang: string = 'ja') => {
    const langPath = lang === 'en' ? 'en/' : '';
    const pagesData = await fetchLocalData(`${langPath}jsonapi/node/page.json`);

    if (!pagesData || !pagesData.data) return null;

    const page = pagesData.data.find(
      (item: any) => item.attributes?.field_id === fieldId
    );

    return page ? { data: page } : null;
  };

  /**
   * コンテンツタイプに応じてデータを取得する汎用関数
   */
  const fetchContentType = async (contentType: string, lang: string = 'ja') => {
    const langPath = lang === 'en' ? 'en/' : '';
    return await fetchLocalData(`${langPath}jsonapi/node/${contentType}.json`);
  };

  /**
   * APIエンドポイントからデータを取得
   * /api/poems, /api/sanbuns, /api/yokyokus など
   */
  const fetchApiData = async (endpoint: string) => {
    return await fetchLocalData(`api/${endpoint}.json`);
  };

  /**
   * 翻訳データをIDリストでフィルタリングして取得
   */
  const fetchTranslationsByIds = async (
    valueIds: string[],
    type: string,
    lang: string = 'ja'
  ) => {
    const langPath = lang === 'en' ? 'en/' : '';
    const translationsData = await fetchLocalData(
      `${langPath}jsonapi/node/${type}_translations.json`
    );

    if (!translationsData || !translationsData.data) return { data: [] };

    // IDリストに基づいてフィルタリング
    const typeSingle = type.substring(0, type.length - 1);
    const filteredData = translationsData.data.filter((item: any) => {
      const refId = item.relationships?.[`field_${typeSingle}`]?.data?.id;
      return valueIds.includes(refId);
    });

    return {
      data: filteredData,
      included: translationsData.included
    };
  };

  /**
   * ドキュメントをIDリストでフィルタリングして取得
   */
  const fetchDocumentsByIds = async (
    documentIds: string[],
    lang: string = 'ja'
  ) => {
    const langPath = lang === 'en' ? 'en/' : '';
    const documentsData = await fetchLocalData(
      `${langPath}jsonapi/node/documents.json`
    );

    if (!documentsData || !documentsData.data) return { data: [] };

    // IDリストに基づいてフィルタリング
    const filteredData = documentsData.data.filter((item: any) =>
      documentIds.includes(item.id)
    );

    return {
      data: filteredData,
      included: documentsData.included
    };
  };

  return {
    fetchLocalData,
    fetchSpots,
    fetchSpot,
    fetchSpotDetails,
    fetchDocuments,
    fetchPoems,
    fetchSanbuns,
    fetchYokyokus,
    fetchImages,
    fetchPoemsTranslations,
    fetchSanbunsTranslations,
    fetchPage,
    fetchPageByFieldId,
    fetchContentType,
    fetchApiData,
    fetchTranslationsByIds,
    fetchDocumentsByIds,
  };
};
