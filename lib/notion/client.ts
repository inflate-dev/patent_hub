export interface NotionArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  coverImage: string;
  publishedDate: string;
  tags: string[];
  author: string;
  language: string;
}

export async function getNotionArticles(locale?: string): Promise<NotionArticle[]> {
  const notionToken = process.env.NEXT_PUBLIC_NOTION_TOKEN;
  const databaseId = process.env.NEXT_PUBLIC_NOTION_DATABASE_ID;

  if (!notionToken || !databaseId) {
    console.warn('Notion credentials not configured. Using mock data.');
    return getMockArticles(locale);
  }

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionToken}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: locale ? {
          property: 'Language',
          select: {
            equals: locale,
          },
        } : undefined,
        sorts: [
          {
            property: 'Published Date',
            direction: 'descending',
          },
        ],
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from Notion');
    }

    const data = await response.json();
    return data.results.map((page: any) => parseNotionPage(page));
  } catch (error) {
    console.error('Error fetching from Notion:', error);
    return getMockArticles(locale);
  }
}

export async function getNotionArticle(pageId: string): Promise<NotionArticle | null> {
  const notionToken = process.env.NEXT_PUBLIC_NOTION_TOKEN;

  if (!notionToken) {
    return getMockArticles().find(a => a.id === pageId) || null;
  }

  try {
    const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
      headers: {
        'Authorization': `Bearer ${notionToken}`,
        'Notion-Version': '2022-06-28',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch page from Notion');
    }

    const page = await response.json();
    return parseNotionPage(page);
  } catch (error) {
    console.error('Error fetching page from Notion:', error);
    return null;
  }
}

function parseNotionPage(page: any): NotionArticle {
  const properties = page.properties;

  let coverImage = '';
  if (page.cover) {
    if (page.cover.type === 'external') {
      coverImage = page.cover.external.url;
    } else if (page.cover.type === 'file') {
      coverImage = page.cover.file.url;
    }
  }

  return {
    id: page.id,
    title: properties.Title?.title?.[0]?.plain_text || 'Untitled',
    description: properties.Description?.rich_text?.[0]?.plain_text || '',
    content: properties.Content?.rich_text?.[0]?.plain_text || '',
    coverImage: coverImage || 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200',
    publishedDate: properties['Published Date']?.date?.start || new Date().toISOString(),
    tags: properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
    author: properties.Author?.rich_text?.[0]?.plain_text || 'Unknown',
    language: properties.Language?.select?.name || 'en',
  };
}

function getMockArticles(locale?: string): NotionArticle[] {
  const articles: NotionArticle[] = [
    {
      id: '1',
      title: 'Quantum Computing Patent Breakthrough',
      description: 'A revolutionary approach to quantum error correction has been patented, promising to reduce computational errors significantly.',
      content: 'Recent developments in quantum computing have led to a groundbreaking patent for error correction algorithms. This innovation promises to significantly reduce computational errors in quantum systems, making practical quantum computing more achievable.\n\nThe patent describes a novel method for detecting and correcting errors in quantum bits (qubits) without destroying their quantum state. This is crucial because quantum systems are extremely sensitive to environmental disturbances, and maintaining coherence is one of the biggest challenges in building practical quantum computers.\n\nThe new approach uses a combination of redundant encoding and real-time monitoring to identify errors as they occur. Unlike previous methods, this system can correct errors faster than they accumulate, potentially allowing quantum computers to perform complex calculations that were previously impossible.\n\nResearchers believe this breakthrough could accelerate the development of quantum computers capable of solving problems in cryptography, drug discovery, and materials science that are beyond the reach of classical computers.',
      coverImage: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=1200',
      publishedDate: '2025-12-01',
      tags: ['Quantum Computing', 'Innovation', 'Technology'],
      author: 'Dr. Sarah Chen',
      language: 'en',
    },
    {
      id: '2',
      title: 'AI-Powered Drug Discovery Patent',
      description: 'New machine learning algorithm accelerates pharmaceutical development by predicting molecular interactions with high accuracy.',
      content: 'A newly patented AI system can predict molecular interactions with unprecedented accuracy, potentially reducing drug development time from years to months. This technology represents a major advancement in computational chemistry.\n\nThe system uses deep learning to analyze millions of molecular structures and predict how they will interact with specific protein targets in the human body. This allows researchers to identify promising drug candidates much faster than traditional trial-and-error methods.\n\nWhat makes this patent particularly significant is its ability to predict not just efficacy, but also potential side effects and toxicity issues early in the development process. This could save pharmaceutical companies billions of dollars and bring life-saving medications to patients much faster.\n\nSeveral major pharmaceutical companies have already expressed interest in licensing this technology, and early trials have shown promising results in identifying new treatments for cancer and neurodegenerative diseases.',
      coverImage: 'https://images.pexels.com/photos/3825517/pexels-photo-3825517.jpeg?auto=compress&cs=tinysrgb&w=1200',
      publishedDate: '2025-11-28',
      tags: ['AI', 'Healthcare', 'Biotechnology'],
      author: 'Prof. Michael Johnson',
      language: 'en',
    },
    {
      id: '3',
      title: '次世代バッテリー技術の特許',
      description: '固体電池の新しい製造方法が特許取得。従来比3倍のエネルギー密度を実現し、電気自動車の航続距離を大幅延長。',
      content: '最新の固体電池技術により、従来のリチウムイオン電池と比較して3倍のエネルギー密度を実現。この革新的な製造プロセスは、電気自動車の航続距離を大幅に延長する可能性があります。\n\n固体電池は、液体電解質の代わりに固体電解質を使用することで、安全性とエネルギー密度の両方を向上させることができます。しかし、これまで製造コストと生産性の課題により、大規模な商業化が困難でした。\n\n今回特許取得された製造方法は、既存の生産設備を活用できるため、コストを大幅に削減できます。また、製造時間も従来の方法の半分以下に短縮されます。\n\nこの技術により、電気自動車の航続距離を1000km以上に延ばすことが可能になり、充電時間も大幅に短縮されます。自動車メーカー各社がこの技術に注目しており、2026年中の実用化を目指しています。',
      coverImage: 'https://images.pexels.com/photos/110844/pexels-photo-110844.jpeg?auto=compress&cs=tinysrgb&w=1200',
      publishedDate: '2025-11-25',
      tags: ['Energy', 'Battery', 'Electric Vehicles'],
      author: '田中 博士',
      language: 'ja',
    },
    {
      id: '4',
      title: 'Renewable Energy Storage Innovation',
      description: 'Novel thermal energy storage approach receives patent, offering cost-effective solution for grid-scale renewable energy.',
      content: 'A breakthrough in thermal energy storage technology has been patented, offering a cost-effective solution for storing renewable energy at scale. This innovation could help overcome one of the biggest challenges in transitioning to clean energy.\n\nThe system stores excess energy generated by solar and wind farms as heat in specially designed materials. When electricity is needed, the stored heat is converted back into electricity with high efficiency.\n\nWhat sets this technology apart is its use of abundant, inexpensive materials rather than rare earth elements or expensive batteries. The storage units can be scaled up or down to match the needs of different communities, from small towns to large cities.\n\nEarly installations have demonstrated round-trip efficiency of over 70%, with storage capacity that can provide power for several days. This makes it ideal for handling the intermittent nature of renewable energy sources and could significantly reduce reliance on fossil fuel backup power plants.',
      coverImage: 'https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg?auto=compress&cs=tinysrgb&w=1200',
      publishedDate: '2025-11-20',
      tags: ['Renewable Energy', 'Sustainability', 'Innovation'],
      author: 'Dr. Emily Rodriguez',
      language: 'en',
    },
    {
      id: '5',
      title: '人工智能芯片专利突破',
      description: '新型神经网络处理器架构获得专利,在保持高性能的同时大幅降低能耗,特别适合边缘计算应用。',
      content: '一项革命性的AI芯片设计专利展示了如何在保持高性能的同时大幅降低能耗。这种创新架构特别适合边缘计算应用,可能会改变物联网设备的运行方式。\n\n该芯片采用了全新的神经网络处理架构,能够在本地设备上高效运行复杂的AI模型,而无需将数据发送到云端处理。这不仅提高了响应速度,还增强了用户隐私保护。\n\n与传统GPU相比,这种新型芯片在执行AI推理任务时的能耗降低了80%,同时性能提升了3倍。这意味着智能手机、智能家居设备等终端设备可以运行更复杂的AI应用,而不会快速耗尽电池。\n\n多家科技巨头已经表示有意授权这项技术,预计第一批采用该芯片的消费电子产品将在2026年初上市。这可能会开启边缘AI应用的新时代,从智能相机到自动驾驶汽车,都将受益于这项创新。',
      coverImage: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1200',
      publishedDate: '2025-11-15',
      tags: ['AI', 'Hardware', 'Edge Computing'],
      author: '王博士',
      language: 'zh',
    },
    {
      id: '6',
      title: 'Biodegradable Plastic Innovation',
      description: 'New polymer breaks down naturally in ocean environments within months while maintaining commercial durability.',
      content: 'Scientists have patented a revolutionary biodegradable plastic that decomposes in marine environments within months. This breakthrough addresses the global plastic pollution crisis while maintaining the durability needed for commercial applications.\n\nThe new material is based on a novel polymer structure that remains stable during normal use but breaks down rapidly when exposed to seawater and sunlight. Importantly, it decomposes into harmless compounds that are non-toxic to marine life.\n\nLaboratory tests show that the plastic maintains strength comparable to conventional plastics for packaging and consumer goods, but begins decomposing within weeks of entering the ocean. Within six months, it completely breaks down into natural compounds.\n\nMajor consumer goods companies are already testing the material for packaging applications. While the production cost is currently 20% higher than conventional plastics, economies of scale are expected to bring costs down as production ramps up. This innovation could revolutionize the packaging industry and help address the estimated 8 million tons of plastic that enter the oceans each year.',
      coverImage: 'https://images.pexels.com/photos/1482803/pexels-photo-1482803.jpeg?auto=compress&cs=tinysrgb&w=1200',
      publishedDate: '2025-11-10',
      tags: ['Environment', 'Materials Science', 'Sustainability'],
      author: 'Dr. James Wilson',
      language: 'en',
    },
    {
      id: '7',
      title: '自動運転技術の新特許',
      description: '悪天候下での認識精度を向上させる革新的なセンサー融合技術が特許取得。自動運転車の全天候対応を実現。',
      content: '雨や雪などの悪天候条件下でも高精度な物体認識を可能にする革新的なセンサー融合技術が特許を取得。この技術により、自動運転車の全天候対応が現実的になります。\n\n従来の自動運転システムは、カメラやLiDARセンサーが悪天候の影響を受けやすく、安全性の確保が課題でした。新しいシステムは、複数の異なるセンサーからのデータを高度なAIアルゴリズムで統合し、悪条件下でも正確な環境認識を実現します。\n\n特に画期的なのは、センサーの一部が機能しなくなった場合でも、残りのセンサーデータから欠落情報を補完できる点です。実路試験では、大雨や濃霧の中でも、晴天時と同等の認識精度を維持することが確認されています。\n\n複数の自動車メーカーがこの技術のライセンス契約を結んでおり、2027年までに市販車への搭載が予定されています。これにより、自動運転車の実用化が大きく前進することが期待されます。',
      coverImage: 'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg?auto=compress&cs=tinysrgb&w=1200',
      publishedDate: '2025-11-05',
      tags: ['Autonomous Vehicles', 'AI', 'Safety'],
      author: '佐藤 博士',
      language: 'ja',
    },
    {
      id: '8',
      title: '区块链隐私保护专利',
      description: '新型加密协议获专利,在保持交易透明度的同时保护用户身份隐私,推动区块链在金融领域应用。',
      content: '一项创新的区块链隐私技术专利实现了在保持交易透明度的同时保护用户身份隐私。这种零知识证明的新实现方式可能会推动区块链技术在金融领域的广泛应用。\n\n传统区块链技术的一个主要挑战是如何在保持交易可验证性的同时保护用户隐私。新专利技术通过改进的零知识证明协议,允许交易方证明交易的合法性,而无需透露具体的交易细节或身份信息。\n\n该系统的处理速度比现有隐私保护方案快10倍,使其更适合用于高频交易场景。同时,它保持了与现有区块链基础设施的兼容性,可以作为现有系统的升级模块部署。\n\n金融机构对这项技术表现出浓厚兴趣,因为它可以帮助他们在采用区块链技术的同时遵守隐私保护法规。预计首批商业应用将在2026年在跨境支付和证券结算领域推出。',
      coverImage: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=1200',
      publishedDate: '2025-11-01',
      tags: ['Blockchain', 'Privacy', 'Cryptography'],
      author: '李博士',
      language: 'zh',
    },
  ];

  if (locale) {
    return articles.filter(article => article.language === locale);
  }

  return articles;
}
