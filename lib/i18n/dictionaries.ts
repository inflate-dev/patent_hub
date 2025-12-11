export type Locale = 'en' | 'ja' | 'zh';

export type CategoryKey = 'all' | 'carbon' | 'battery' | 'engineering-plastics' | 'metal-processing';

export interface Dictionary {
  nav: {
    home: string;
    articles: string;
    login: string;
    signup: string;
    logout: string;
    profile: string;
    categories: string;
  };
  auth: {
    email: string;
    password: string;
    confirmPassword: string;
    loginTitle: string;
    signupTitle: string;
    loginButton: string;
    signupButton: string;
    noAccount: string;
    hasAccount: string;
    signupLink: string;
    loginLink: string;
    loggingIn: string;
    signingUp: string;
    emailRequired: string;
    passwordRequired: string;
    passwordMismatch: string;
    loginError: string;
    signupError: string;
  };
  home: {
    title: string;
    subtitle: string;
    exploreButton: string;
    loginPrompt: string;
  };
  articles: {
    title: string;
    searchPlaceholder: string;
    noResults: string;
    loading: string;
    readMore: string;
    publishedOn: string;
  };
  categories: {
    all: string;
    carbon: string;
    battery: string;
    'engineering-plastics': string;
    'metal-processing': string;
  };
  sidebar: {
    title: string;
    allCategories: string;
    relatedArticles: string;
    noArticles: string;
  };
  profile: {
    title: string;
    preferredLanguage: string;
    updateButton: string;
    updating: string;
    updated: string;
  };
  common: {
    welcome: string;
    error: string;
    success: string;
  };
}

const en: Dictionary = {
  nav: {
    home: 'Home',
    articles: 'Articles',
    login: 'Login',
    signup: 'Sign Up',
    logout: 'Logout',
    profile: 'Profile',
    categories: 'Categories',
  },
  auth: {
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    loginTitle: 'Welcome Back',
    signupTitle: 'Create Account',
    loginButton: 'Sign In',
    signupButton: 'Create Account',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    signupLink: 'Sign up here',
    loginLink: 'Sign in here',
    loggingIn: 'Signing in...',
    signingUp: 'Creating account...',
    emailRequired: 'Email is required',
    passwordRequired: 'Password is required',
    passwordMismatch: 'Passwords do not match',
    loginError: 'Invalid email or password',
    signupError: 'Could not create account',
  },
  home: {
    title: 'Patent Article Aggregator',
    subtitle: 'Discover the latest innovations and patent insights from around the world',
    exploreButton: 'Explore Articles',
    loginPrompt: 'Sign in to access premium content',
  },
  articles: {
    title: 'Patent Articles',
    searchPlaceholder: 'Search articles...',
    noResults: 'No articles found',
    loading: 'Loading articles...',
    readMore: 'Read More',
    publishedOn: 'Published on',
  },
  categories: {
    all: 'All Categories',
    carbon: 'Carbon Technology',
    battery: 'Battery Innovation',
    'engineering-plastics': 'Engineering Plastics',
    'metal-processing': 'Metal Processing',
  },
  sidebar: {
    title: 'Categories',
    allCategories: 'All Categories',
    relatedArticles: 'Related Articles',
    noArticles: 'No articles available',
  },
  profile: {
    title: 'Profile Settings',
    preferredLanguage: 'Preferred Language',
    updateButton: 'Update Profile',
    updating: 'Updating...',
    updated: 'Profile updated successfully',
  },
  common: {
    welcome: 'Welcome',
    error: 'An error occurred',
    success: 'Success',
  },
};

const ja: Dictionary = {
  nav: {
    home: 'ホーム',
    articles: '記事',
    login: 'ログイン',
    signup: '新規登録',
    logout: 'ログアウト',
    profile: 'プロフィール',
    categories: 'カテゴリー',
  },
  auth: {
    email: 'メールアドレス',
    password: 'パスワード',
    confirmPassword: 'パスワード確認',
    loginTitle: 'お帰りなさい',
    signupTitle: 'アカウント作成',
    loginButton: 'ログイン',
    signupButton: 'アカウント作成',
    noAccount: 'アカウントをお持ちでないですか？',
    hasAccount: 'すでにアカウントをお持ちですか？',
    signupLink: '新規登録はこちら',
    loginLink: 'ログインはこちら',
    loggingIn: 'ログイン中...',
    signingUp: 'アカウント作成中...',
    emailRequired: 'メールアドレスが必要です',
    passwordRequired: 'パスワードが必要です',
    passwordMismatch: 'パスワードが一致しません',
    loginError: 'メールアドレスまたはパスワードが無効です',
    signupError: 'アカウントを作成できませんでした',
  },
  home: {
    title: '特許記事アグリゲーター',
    subtitle: '世界中の最新イノベーションと特許インサイトを発見',
    exploreButton: '記事を探す',
    loginPrompt: 'プレミアムコンテンツにアクセスするにはサインインしてください',
  },
  articles: {
    title: '特許記事',
    searchPlaceholder: '記事を検索...',
    noResults: '記事が見つかりません',
    loading: '記事を読み込み中...',
    readMore: '続きを読む',
    publishedOn: '公開日',
  },
  categories: {
    all: 'すべてのカテゴリー',
    carbon: 'カーボン技術',
    battery: 'バッテリー革新',
    'engineering-plastics': 'エンジニアリングプラスチック',
    'metal-processing': '金属加工',
  },
  sidebar: {
    title: 'カテゴリー',
    allCategories: 'すべてのカテゴリー',
    relatedArticles: '関連記事',
    noArticles: '利用可能な記事はありません',
  },
  profile: {
    title: 'プロフィール設定',
    preferredLanguage: '優先言語',
    updateButton: 'プロフィールを更新',
    updating: '更新中...',
    updated: 'プロフィールが正常に更新されました',
  },
  common: {
    welcome: 'ようこそ',
    error: 'エラーが発生しました',
    success: '成功',
  },
};

const zh: Dictionary = {
  nav: {
    home: '首页',
    articles: '文章',
    login: '登录',
    signup: '注册',
    logout: '登出',
    profile: '个人资料',
    categories: '分类',
  },
  auth: {
    email: '电子邮件',
    password: '密码',
    confirmPassword: '确认密码',
    loginTitle: '欢迎回来',
    signupTitle: '创建账户',
    loginButton: '登录',
    signupButton: '创建账户',
    noAccount: '还没有账户？',
    hasAccount: '已有账户？',
    signupLink: '在此注册',
    loginLink: '在此登录',
    loggingIn: '登录中...',
    signingUp: '创建账户中...',
    emailRequired: '需要电子邮件',
    passwordRequired: '需要密码',
    passwordMismatch: '密码不匹配',
    loginError: '电子邮件或密码无效',
    signupError: '无法创建账户',
  },
  home: {
    title: '专利文章聚合器',
    subtitle: '发现来自世界各地的最新创新和专利见解',
    exploreButton: '浏览文章',
    loginPrompt: '登录以访问高级内容',
  },
  articles: {
    title: '专利文章',
    searchPlaceholder: '搜索文章...',
    noResults: '未找到文章',
    loading: '加载文章中...',
    readMore: '阅读更多',
    publishedOn: '发布于',
  },
  categories: {
    all: '全部分类',
    carbon: '碳技术',
    battery: '电池创新',
    'engineering-plastics': '工程塑料',
    'metal-processing': '金属加工',
  },
  sidebar: {
    title: '分类',
    allCategories: '全部分类',
    relatedArticles: '相关文章',
    noArticles: '暂无文章',
  },
  profile: {
    title: '个人资料设置',
    preferredLanguage: '首选语言',
    updateButton: '更新个人资料',
    updating: '更新中...',
    updated: '个人资料更新成功',
  },
  common: {
    welcome: '欢迎',
    error: '发生错误',
    success: '成功',
  },
};

const dictionaries = {
  en,
  ja,
  zh,
};

export const getDictionary = (locale: Locale): Dictionary => {
  return dictionaries[locale] || dictionaries.en;
};

export const locales: Locale[] = ['en', 'ja', 'zh'];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ja: '日本語',
  zh: '中文',
};

export const categoryKeys: CategoryKey[] = ['all', 'carbon', 'battery', 'engineering-plastics', 'metal-processing'];
