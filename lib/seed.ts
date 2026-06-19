import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { connectDB } from './mongodb'

// ─── Schemas (inline để tránh circular import lúc instrumentation) ────────────

const MLSchema = {
  vi: { type: String, default: '' },
  en: { type: String, default: '' },
  ko: { type: String, default: '' },
  ja: { type: String, default: '' },
  zh: { type: String, default: '' },
}

const Setting = mongoose.models.Setting || mongoose.model('Setting', new mongoose.Schema({
  key: { type: String, unique: true, default: 'global' },
  general: { portalName: String, tagline: String, publicDomain: String, systemEmail: String },
  header: { navDisplayName: String, faviconUrl: String, logoEn: String, logoVi: String, logoImageUrl: String },
}, { strict: false, timestamps: true }))

const AboutConfig = mongoose.models.AboutConfig || mongoose.model('AboutConfig', new mongoose.Schema({
  key: { type: String, unique: true, default: 'global' },
}, { strict: false, timestamps: true }))

const ContactConfig = mongoose.models.ContactConfig || mongoose.model('ContactConfig', new mongoose.Schema({
  key: { type: String, unique: true, default: 'global' },
}, { strict: false, timestamps: true }))

const FooterConfig = mongoose.models.FooterConfig || mongoose.model('FooterConfig', new mongoose.Schema({
  key: { type: String, unique: true, default: 'global' },
  companyName: MLSchema, navAbout: MLSchema, navServices: MLSchema, navCareers: MLSchema,
  navBlog: MLSchema, navContact: MLSchema, servicesHeading: MLSchema,
  service1: MLSchema, service2: MLSchema, service3: MLSchema, service4: MLSchema,
  locationHeading: MLSchema, locationCity: MLSchema,
  phoneLabel: MLSchema, emailLabel: MLSchema, legalRepLabel: MLSchema, copyright: MLSchema,
}, { strict: false, timestamps: true }))

const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['superadmin', 'admin', 'user'], default: 'user' },
}, { timestamps: true }))

const Category = mongoose.models.Category || mongoose.model('Category', new mongoose.Schema({
  slug:    { type: String, required: true, unique: true, trim: true },
  name:    MLSchema,
  forType: { type: String, enum: ['blog', 'tuyen-dung', 'all'], default: 'all' },
  active:  { type: Boolean, default: true },
  order:   { type: Number, default: 0 },
}, { timestamps: true }))

const HomepageHero = mongoose.models.HomepageHero || mongoose.model('HomepageHero', new mongoose.Schema({
  key: { type: String, default: 'main', unique: true },
  title: MLSchema, title2: MLSchema, subtitle: MLSchema,
}, { timestamps: true }))

const HomepageService = mongoose.models.HomepageService || mongoose.model('HomepageService', new mongoose.Schema({
  order: Number, iconKey: String,
  title: MLSchema, desc: MLSchema, active: { type: Boolean, default: true },
}, { timestamps: true }))

const HomepageAchievement = mongoose.models.HomepageAchievement || mongoose.model('HomepageAchievement', new mongoose.Schema({
  order: Number, value: Number, label: MLSchema, active: { type: Boolean, default: true },
}, { timestamps: true }))

const HomepagePartner = mongoose.models.HomepagePartner || mongoose.model('HomepagePartner', new mongoose.Schema({
  order: Number, name: String, logo: String, active: { type: Boolean, default: true },
}, { timestamps: true }))

const HomepagePostsConfig = mongoose.models.HomepagePostsConfig || mongoose.model('HomepagePostsConfig', new mongoose.Schema({
  key:         { type: String, default: 'posts', unique: true },
  mode:        { type: String, enum: ['auto', 'manual'], default: 'auto' },
  selectedIds: [{ type: String }],
  limit:       { type: Number, default: 6 },
}, { timestamps: true }))

const Post = mongoose.models.Post || mongoose.model('Post', new mongoose.Schema({
  slug:           { type: String, required: true, unique: true },
  type:           { type: String, enum: ['blog', 'tuyen-dung'], default: 'blog' },
  thumbnail:      { type: String, default: '' },
  date:           { type: String, default: '' },
  showOnHomepage: { type: Boolean, default: false },
  category:       MLSchema,
  title:          MLSchema,
  excerpt:        MLSchema,
  content:        MLSchema,
  active:         { type: Boolean, default: true },
  urgent:         { type: Boolean, default: false },
  deadline:       { type: String, default: '' },
  jobType:        { type: String, default: '' },
  location:       { type: String, default: '' },
  salary:         { type: String, default: '' },
}, { timestamps: true }))

// ─── Categories ───────────────────────────────────────────────────────────────

async function seedCategories() {
  const count = await Category.countDocuments()
  if (count > 0) return

  const categories = [
    // Blog
    { slug: 'tin-tuc',       forType: 'blog',      order: 1,  name: { vi: 'Tin tức',         en: 'News',           ko: '뉴스',     ja: 'ニュース',     zh: '新闻'   } },
    { slug: 'giai-tri',      forType: 'blog',      order: 2,  name: { vi: 'Giải trí',        en: 'Entertainment',  ko: '엔터테인먼트', ja: 'エンタメ',   zh: '娱乐'   } },
    { slug: 'am-nhac',       forType: 'blog',      order: 3,  name: { vi: 'Âm nhạc',         en: 'Music',          ko: '음악',     ja: '音楽',         zh: '音乐'   } },
    { slug: 'video',         forType: 'blog',      order: 4,  name: { vi: 'Video',            en: 'Video',          ko: '비디오',   ja: 'ビデオ',       zh: '视频'   } },
    { slug: 'podcast',       forType: 'blog',      order: 5,  name: { vi: 'Podcast',          en: 'Podcast',        ko: '팟캐스트', ja: 'ポッドキャスト', zh: '播客'  } },
    { slug: 'su-kien',       forType: 'blog',      order: 6,  name: { vi: 'Sự kiện',          en: 'Events',         ko: '이벤트',   ja: 'イベント',     zh: '活动'   } },
    // Tuyển dụng
    { slug: 'content',       forType: 'tuyen-dung', order: 1, name: { vi: 'Content Creator', en: 'Content Creator', ko: '콘텐츠 크리에이터', ja: 'コンテンツクリエイター', zh: '内容创作者' } },
    { slug: 'marketing',     forType: 'tuyen-dung', order: 2, name: { vi: 'Marketing',        en: 'Marketing',      ko: '마케팅',   ja: 'マーケティング', zh: '市场营销' } },
    { slug: 'thiet-ke',      forType: 'tuyen-dung', order: 3, name: { vi: 'Thiết kế',         en: 'Design',         ko: '디자인',   ja: 'デザイン',     zh: '设计'   } },
    { slug: 'ky-thuat',      forType: 'tuyen-dung', order: 4, name: { vi: 'Kỹ thuật',         en: 'Technical',      ko: '기술',     ja: '技術',         zh: '技术'   } },
    { slug: 'kinh-doanh',    forType: 'tuyen-dung', order: 5, name: { vi: 'Kinh doanh',       en: 'Business',       ko: '비즈니스', ja: 'ビジネス',     zh: '商务'   } },
  ]

  await Category.insertMany(categories.map(c => ({ ...c, active: true })))
  console.log(`[seed] ${categories.length} categories created`)
}

// ─── Admin ────────────────────────────────────────────────────────────────────

async function seedAdmin() {
  const hashed = await bcrypt.hash('wonmedia', 12)
  await User.findOneAndUpdate(
    { role: 'superadmin' },
    { name: 'Super Admin', email: 'wonmedia@wonmedia.com', password: hashed, role: 'superadmin' },
    { upsert: true }
  )
  console.log('[seed] Super admin: wonmedia@wonmedia.com / wonmedia')
}

// ─── Posts ────────────────────────────────────────────────────────────────────

const POSTS = [
  // ── Tin tức ──────────────────────────────────────────────────────────────
  {
    slug: 'won-media-ra-mat-nen-tang-phan-phoi-am-nhac-2025',
    type: 'blog',
    thumbnail: '/posts/post_1.png',
    date: '15/03/2025',
    showOnHomepage: true,
    category: { vi: 'Tin tức', en: 'News', ko: '뉴스', ja: 'ニュース', zh: '新闻' },
    title: {
      vi: 'WON Media ra mắt nền tảng phân phối âm nhạc số toàn cầu',
      en: 'WON Media Launches Global Digital Music Distribution Platform',
      ko: 'WON Media, 글로벌 디지털 음악 유통 플랫폼 출시',
      ja: 'WON Media、グローバルデジタル音楽配信プラットフォームを開始',
      zh: 'WON Media推出全球数字音乐发行平台',
    },
    excerpt: {
      vi: 'WON Media chính thức ra mắt nền tảng phân phối âm nhạc số, giúp nghệ sĩ Việt Nam đưa tác phẩm lên hơn 150 nền tảng streaming toàn cầu chỉ trong vài ngày.',
      en: 'WON Media officially launches its digital music distribution platform, helping Vietnamese artists upload their work to over 150 global streaming platforms within days.',
      ko: 'WON Media가 공식적으로 디지털 음악 유통 플랫폼을 출시하여 베트남 아티스트들이 며칠 내에 150개 이상의 글로벌 스트리밍 플랫폼에 작품을 업로드할 수 있게 되었습니다.',
      ja: 'WON Mediaがデジタル音楽配信プラットフォームを正式に開始し、ベトナムのアーティストが数日以内に150以上のグローバルストリーミングプラットフォームに作品をアップロードできるようになりました。',
      zh: 'WON Media正式推出数字音乐发行平台，帮助越南艺术家在几天内将作品上传到150多个全球流媒体平台。',
    },
    content: {
      vi: `<h2>WON Media ra mắt nền tảng phân phối âm nhạc số toàn cầu</h2>
<p>Ngày 15/03/2025, WON Media chính thức công bố ra mắt nền tảng phân phối âm nhạc số mới — một bước tiến quan trọng trong hành trình đưa âm nhạc Việt Nam ra thế giới.</p>
<p>Với nền tảng này, các nghệ sĩ và nhạc sĩ Việt Nam có thể đăng ký, tải lên tác phẩm và phân phối âm nhạc lên hơn <strong>150 nền tảng streaming quốc tế</strong> bao gồm Spotify, Apple Music, YouTube Music, TikTok, Amazon Music và nhiều hơn nữa.</p>
<h3>Tính năng nổi bật</h3>
<ul>
  <li>Phân phối không giới hạn số lượng bài hát</li>
  <li>Theo dõi doanh thu theo thời gian thực</li>
  <li>Hỗ trợ đa ngôn ngữ: Tiếng Việt, Anh, Hàn, Nhật, Trung</li>
  <li>Đội ngũ hỗ trợ 24/7</li>
</ul>
<p>Đây là minh chứng cho cam kết của WON Media trong việc xây dựng hệ sinh thái âm nhạc số bền vững cho người sáng tạo Việt.</p>`,
      en: `<h2>WON Media Launches Global Digital Music Distribution Platform</h2>
<p>On March 15, 2025, WON Media officially announced the launch of its new digital music distribution platform — a significant step in bringing Vietnamese music to the world.</p>
<p>With this platform, Vietnamese artists and musicians can register, upload their work, and distribute music to over <strong>150 international streaming platforms</strong> including Spotify, Apple Music, YouTube Music, TikTok, Amazon Music, and more.</p>
<h3>Key Features</h3>
<ul>
  <li>Unlimited song distribution</li>
  <li>Real-time revenue tracking</li>
  <li>Multi-language support: Vietnamese, English, Korean, Japanese, Chinese</li>
  <li>24/7 support team</li>
</ul>
<p>This is a testament to WON Media's commitment to building a sustainable digital music ecosystem for Vietnamese creators.</p>`,
      ko: `<h2>WON Media, 글로벌 디지털 음악 유통 플랫폼 출시</h2>
<p>2025년 3월 15일, WON Media는 새로운 디지털 음악 유통 플랫폼의 출시를 공식 발표했습니다.</p>
<p>이 플랫폼을 통해 베트남 아티스트와 뮤지션들은 Spotify, Apple Music, YouTube Music, TikTok, Amazon Music 등 <strong>150개 이상의 국제 스트리밍 플랫폼</strong>에 음악을 등록하고 배급할 수 있습니다.</p>`,
      ja: `<h2>WON Media、グローバルデジタル音楽配信プラットフォームを開始</h2>
<p>2025年3月15日、WON Mediaは新しいデジタル音楽配信プラットフォームの開始を正式に発表しました。</p>
<p>このプラットフォームにより、ベトナムのアーティストやミュージシャンは、Spotify、Apple Music、YouTube Music、TikTok、Amazon Musicなど<strong>150以上の国際ストリーミングプラットフォーム</strong>に音楽を登録・配信できます。</p>`,
      zh: `<h2>WON Media推出全球数字音乐发行平台</h2>
<p>2025年3月15日，WON Media正式宣布推出新的数字音乐发行平台。</p>
<p>通过这一平台，越南艺术家和音乐人可以注册、上传作品，并将音乐发行到包括Spotify、Apple Music、YouTube Music、TikTok、Amazon Music在内的<strong>150多个国际流媒体平台</strong>。</p>`,
    },
  },
  {
    slug: 'won-media-hop-tac-chien-luoc-voi-cac-dai-truyen-hinh-2025',
    type: 'blog',
    thumbnail: '/posts/recap-yep-2025.jpg',
    date: '10/04/2025',
    showOnHomepage: true,
    category: { vi: 'Tin tức', en: 'News', ko: '뉴스', ja: 'ニュース', zh: '新闻' },
    title: {
      vi: 'WON Media ký kết hợp tác chiến lược với các đài truyền hình lớn',
      en: 'WON Media Signs Strategic Partnership with Major TV Networks',
      ko: 'WON Media, 주요 TV 네트워크와 전략적 파트너십 체결',
      ja: 'WON Media、主要テレビ局と戦略的パートナーシップを締結',
      zh: 'WON Media与主要电视网络签署战略合作协议',
    },
    excerpt: {
      vi: 'WON Media vừa ký kết thỏa thuận hợp tác chiến lược với VTV, VTVcab và nhiều đài truyền hình lớn, mở ra cơ hội quảng bá nội dung âm nhạc trên sóng truyền hình quốc gia.',
      en: 'WON Media has just signed strategic cooperation agreements with VTV, VTVcab, and many major TV stations, opening up opportunities to promote music content on national television.',
      ko: 'WON Media가 VTV, VTVcab 및 여러 주요 방송국과 전략적 협력 협약을 체결하여 전국 텔레비전에서 음악 콘텐츠를 홍보할 기회를 열었습니다.',
      ja: 'WON MediaがVTV、VTVcabなど多くの主要テレビ局と戦略的協力協定を締結し、全国テレビで音楽コンテンツを宣伝する機会を開きました。',
      zh: 'WON Media刚刚与VTV、VTVcab及多家主要电视台签署战略合作协议，为在全国电视上推广音乐内容开辟了机会。',
    },
    content: {
      vi: `<h2>WON Media ký kết hợp tác chiến lược với các đài truyền hình lớn</h2>
<p>Tháng 4/2025, WON Media chính thức ký kết thỏa thuận hợp tác với <strong>VTV, VTVcab, VOV</strong> và nhiều đối tác truyền thông lớn khác tại Việt Nam.</p>
<p>Theo đó, nội dung âm nhạc do WON Media sản xuất và phân phối sẽ được phát sóng trên các kênh truyền hình quốc gia, mở rộng đáng kể tầm với của các nghệ sĩ trong nước.</p>
<h3>Ý nghĩa của hợp tác</h3>
<p>Đây là bước ngoặt lớn, giúp WON Media trở thành cầu nối giữa người sáng tạo nội dung và khán giả đại chúng. Nghệ sĩ có cơ hội xuất hiện trên truyền hình mà không cần qua nhiều khâu trung gian phức tạp.</p>
<p>WON Media cam kết đồng hành cùng các nghệ sĩ Việt trên con đường xây dựng sự nghiệp bền vững.</p>`,
      en: `<h2>WON Media Signs Strategic Partnership with Major TV Networks</h2>
<p>In April 2025, WON Media officially signed cooperation agreements with <strong>VTV, VTVcab, VOV</strong>, and many other major media partners in Vietnam.</p>
<p>Accordingly, music content produced and distributed by WON Media will be broadcast on national TV channels, significantly expanding the reach of domestic artists.</p>`,
      ko: `<h2>WON Media, 주요 TV 네트워크와 전략적 파트너십 체결</h2>
<p>2025년 4월, WON Media는 베트남의 <strong>VTV, VTVcab, VOV</strong> 및 기타 주요 미디어 파트너와 공식적으로 협력 협약을 체결했습니다.</p>`,
      ja: `<h2>WON Media、主要テレビ局と戦略的パートナーシップを締結</h2>
<p>2025年4月、WON Mediaはベトナムの<strong>VTV、VTVcab、VOV</strong>などの主要メディアパートナーと正式に協力協定を締結しました。</p>`,
      zh: `<h2>WON Media与主要电视网络签署战略合作协议</h2>
<p>2025年4月，WON Media正式与越南<strong>VTV、VTVcab、VOV</strong>及其他主要媒体合作伙伴签署合作协议。</p>`,
    },
  },
  {
    slug: 'won-media-year-end-party-2025',
    type: 'blog',
    thumbnail: '/posts/year-end-party-won-media.jpg',
    date: '28/01/2025',
    showOnHomepage: false,
    category: { vi: 'Nội bộ', en: 'Internal', ko: '내부', ja: '社内', zh: '内部' },
    title: {
      vi: 'Year End Party WON Media 2025 — Kết nối, Tỏa sáng, Bứt phá',
      en: 'WON Media Year End Party 2025 — Connect, Shine, Break Through',
      ko: 'WON Media Year End Party 2025 — 연결, 빛남, 돌파',
      ja: 'WON Media Year End Party 2025 — つながり、輝き、突破',
      zh: 'WON Media 2025年终派对 — 连接、闪耀、突破',
    },
    excerpt: {
      vi: 'Đêm tiệc cuối năm WON Media 2025 là dịp để toàn thể nhân viên cùng nhìn lại một năm đầy thành quả, chia sẻ những khoảnh khắc đáng nhớ và cùng nhau hướng đến tương lai.',
      en: "WON Media's 2025 Year End Party is an occasion for all employees to look back on a year full of achievements, share memorable moments, and look forward to the future together.",
      ko: 'WON Media 2025 Year End Party는 전체 직원들이 성과로 가득한 한 해를 돌아보고 기억에 남는 순간들을 나누며 함께 미래를 향해 나아가는 자리입니다.',
      ja: 'WON Media 2025年末パーティーは、全社員が成果に満ちた一年を振り返り、記念すべき瞬間を共有し、共に未来に向けて歩む機会です。',
      zh: 'WON Media 2025年终派对是全体员工回顾充满成果的一年、分享难忘时刻并共同展望未来的机会。',
    },
    content: {
      vi: `<h2>Year End Party WON Media 2025 — Kết nối, Tỏa sáng, Bứt phá</h2>
<p>Tối ngày 28/01/2025, toàn thể gia đình WON Media đã cùng nhau tụ họp trong đêm tiệc cuối năm đầy ý nghĩa với chủ đề <strong>"Kết nối — Tỏa sáng — Bứt phá"</strong>.</p>
<p>Sự kiện là dịp để ban lãnh đạo ghi nhận những đóng góp của từng thành viên trong năm qua, đồng thời công bố định hướng phát triển của công ty cho năm 2025.</p>
<h3>Những khoảnh khắc đáng nhớ</h3>
<ul>
  <li>Lễ trao giải "Nhân viên xuất sắc năm 2024"</li>
  <li>Màn trình diễn âm nhạc đặc biệt từ các nghệ sĩ WON Media</li>
  <li>Team building và gala dinner</li>
</ul>
<p>Năm 2025 hứa hẹn là một năm bứt phá mạnh mẽ với nhiều dự án lớn đang được WON Media ấp ủ.</p>`,
      en: `<h2>WON Media Year End Party 2025 — Connect, Shine, Break Through</h2>
<p>On the evening of January 28, 2025, the entire WON Media family gathered together for a meaningful year-end party with the theme <strong>"Connect — Shine — Break Through"</strong>.</p>`,
      ko: `<h2>WON Media Year End Party 2025</h2>
<p>2025년 1월 28일 저녁, WON Media 가족 전체가 <strong>"연결 — 빛남 — 돌파"</strong>를 주제로 한 의미 있는 연말 파티에 함께 모였습니다.</p>`,
      ja: `<h2>WON Media Year End Party 2025</h2>
<p>2025年1月28日の夜、WON Mediaファミリー全員が<strong>「つながり — 輝き — 突破」</strong>をテーマにした意義深い年末パーティーに集まりました。</p>`,
      zh: `<h2>WON Media 2025年终派对</h2>
<p>2025年1月28日晚，WON Media全体家庭成员聚集在一起，共同参加以<strong>"连接 — 闪耀 — 突破"</strong>为主题的年终派对。</p>`,
    },
  },

  // ── Tuyển dụng ────────────────────────────────────────────────────────────
  {
    slug: 'tuyen-dung-content-creator-am-nhac-2025',
    type: 'tuyen-dung',
    thumbnail: '',
    date: '01/05/2025',
    showOnHomepage: false,
    category: { vi: 'Tuyển dụng', en: 'Recruitment', ko: '채용', ja: '採用', zh: '招聘' },
    title: {
      vi: 'Tuyển dụng: Content Creator Âm nhạc (2 vị trí)',
      en: 'Recruitment: Music Content Creator (2 positions)',
      ko: '채용: 음악 콘텐츠 크리에이터 (2명)',
      ja: '採用: 音楽コンテンツクリエイター（2名）',
      zh: '招聘：音乐内容创作者（2个职位）',
    },
    excerpt: {
      vi: 'WON Media tìm kiếm Content Creator đam mê âm nhạc, có khả năng sản xuất nội dung sáng tạo trên các nền tảng số. Ứng tuyển ngay hôm nay!',
      en: 'WON Media is looking for Content Creators passionate about music, capable of producing creative content on digital platforms. Apply today!',
      ko: 'WON Media는 디지털 플랫폼에서 창의적인 콘텐츠를 제작할 수 있는 음악에 열정적인 콘텐츠 크리에이터를 찾고 있습니다.',
      ja: 'WON Mediaは、デジタルプラットフォームでクリエイティブなコンテンツを制作できる、音楽に情熱を持つコンテンツクリエイターを募集しています。',
      zh: 'WON Media正在寻找对音乐充满热情、能够在数字平台上制作创意内容的内容创作者。',
    },
    content: {
      vi: `<h2>Tuyển dụng: Content Creator Âm nhạc</h2>
<h3>Mô tả công việc</h3>
<ul>
  <li>Sản xuất nội dung video, reels về âm nhạc cho TikTok, Instagram, YouTube</li>
  <li>Viết bài giới thiệu nghệ sĩ, bài đánh giá album, tin tức âm nhạc</li>
  <li>Phối hợp với team marketing xây dựng chiến dịch quảng bá</li>
  <li>Theo dõi và phân tích hiệu suất nội dung</li>
</ul>
<h3>Yêu cầu</h3>
<ul>
  <li>Đam mê âm nhạc, hiểu biết về thị trường nhạc số</li>
  <li>Có kinh nghiệm tạo nội dung trên mạng xã hội (từ 1 năm trở lên)</li>
  <li>Thành thạo các công cụ chỉnh sửa video (Premiere, CapCut...)</li>
  <li>Kỹ năng viết lách tốt, tư duy sáng tạo</li>
</ul>
<h3>Quyền lợi</h3>
<ul>
  <li>Lương: 12–18 triệu VNĐ + thưởng hiệu suất</li>
  <li>Môi trường làm việc năng động, sáng tạo</li>
  <li>Cơ hội tiếp cận và hợp tác với các nghệ sĩ nổi tiếng</li>
  <li>Bảo hiểm đầy đủ theo quy định</li>
</ul>
<h3>Cách ứng tuyển</h3>
<p>Gửi CV và portfolio về email: <strong>duongnv10504@gmail.com</strong></p>`,
      en: `<h2>Recruitment: Music Content Creator</h2>
<h3>Job Description</h3>
<ul>
  <li>Produce video content, reels about music for TikTok, Instagram, YouTube</li>
  <li>Write artist introductions, album reviews, music news</li>
  <li>Collaborate with marketing team to build promotion campaigns</li>
  <li>Track and analyze content performance</li>
</ul>
<h3>Requirements</h3>
<ul>
  <li>Passionate about music, knowledgeable about the digital music market</li>
  <li>Experience creating content on social media (1+ year)</li>
  <li>Proficient in video editing tools (Premiere, CapCut...)</li>
</ul>
<h3>How to Apply</h3>
<p>Send CV and portfolio to: <strong>duongnv10504@gmail.com</strong></p>`,
      ko: `<h2>채용: 음악 콘텐츠 크리에이터</h2>
<h3>지원 방법</h3>
<p>CV 및 포트폴리오를 이메일로 보내주세요: <strong>duongnv10504@gmail.com</strong></p>`,
      ja: `<h2>採用: 音楽コンテンツクリエイター</h2>
<h3>応募方法</h3>
<p>CVとポートフォリオをメールで送ってください: <strong>duongnv10504@gmail.com</strong></p>`,
      zh: `<h2>招聘：音乐内容创作者</h2>
<h3>申请方式</h3>
<p>请将简历和作品集发送至邮箱：<strong>duongnv10504@gmail.com</strong></p>`,
    },
  },
  {
    slug: 'tuyen-dung-digital-marketing-executive-2025',
    type: 'tuyen-dung',
    thumbnail: '',
    date: '15/05/2025',
    showOnHomepage: false,
    category: { vi: 'Tuyển dụng', en: 'Recruitment', ko: '채용', ja: '採用', zh: '招聘' },
    title: {
      vi: 'Tuyển dụng: Digital Marketing Executive',
      en: 'Recruitment: Digital Marketing Executive',
      ko: '채용: 디지털 마케팅 임원',
      ja: '採用: デジタルマーケティングエグゼクティブ',
      zh: '招聘：数字营销执行',
    },
    excerpt: {
      vi: 'WON Media đang tìm kiếm Digital Marketing Executive có kinh nghiệm trong lĩnh vực âm nhạc và giải trí để xây dựng và triển khai chiến lược marketing đa kênh.',
      en: 'WON Media is looking for a Digital Marketing Executive with experience in music and entertainment to build and implement multi-channel marketing strategies.',
      ko: 'WON Media는 다채널 마케팅 전략을 구축하고 실행하기 위해 음악 및 엔터테인먼트 분야 경험이 있는 디지털 마케팅 임원을 찾고 있습니다.',
      ja: 'WON Mediaは、マルチチャネルマーケティング戦略を構築・実施するために、音楽・エンターテインメント分野での経験を持つデジタルマーケティングエグゼクティブを募集しています。',
      zh: 'WON Media正在寻找具有音乐和娱乐领域经验的数字营销执行，以构建和实施多渠道营销策略。',
    },
    content: {
      vi: `<h2>Tuyển dụng: Digital Marketing Executive</h2>
<h3>Mô tả công việc</h3>
<ul>
  <li>Lên kế hoạch và triển khai các chiến dịch marketing trên Facebook, TikTok, Google, YouTube</li>
  <li>Quản lý ngân sách quảng cáo và tối ưu hóa ROI</li>
  <li>Phân tích dữ liệu, báo cáo hiệu suất chiến dịch hàng tuần/tháng</li>
  <li>Phối hợp với team content và design để tạo ra các tài liệu marketing hiệu quả</li>
  <li>Nghiên cứu xu hướng thị trường âm nhạc và đề xuất chiến lược mới</li>
</ul>
<h3>Yêu cầu</h3>
<ul>
  <li>Tốt nghiệp Đại học chuyên ngành Marketing, Truyền thông hoặc liên quan</li>
  <li>Tối thiểu 2 năm kinh nghiệm Digital Marketing</li>
  <li>Thành thạo Facebook Ads, Google Ads, TikTok Ads</li>
  <li>Kỹ năng phân tích dữ liệu với Google Analytics, Meta Business Suite</li>
  <li>Ưu tiên ứng viên có kinh nghiệm trong ngành giải trí/âm nhạc</li>
</ul>
<h3>Quyền lợi</h3>
<ul>
  <li>Lương: 15–25 triệu VNĐ (thương lượng theo năng lực)</li>
  <li>Thưởng theo hiệu suất dự án</li>
  <li>Môi trường làm việc sáng tạo, năng động</li>
  <li>Cơ hội học hỏi và phát triển không giới hạn</li>
  <li>Laptop và các thiết bị làm việc được cung cấp</li>
</ul>
<h3>Cách ứng tuyển</h3>
<p>Gửi CV về email: <strong>duongnv10504@gmail.com</strong><br/>Tiêu đề email: <em>[Digital Marketing Executive] – Họ và tên</em></p>`,
      en: `<h2>Recruitment: Digital Marketing Executive</h2>
<h3>Requirements</h3>
<ul>
  <li>Minimum 2 years of Digital Marketing experience</li>
  <li>Proficient in Facebook Ads, Google Ads, TikTok Ads</li>
  <li>Data analysis skills with Google Analytics, Meta Business Suite</li>
</ul>
<h3>How to Apply</h3>
<p>Send CV to: <strong>duongnv10504@gmail.com</strong></p>`,
      ko: `<h2>채용: 디지털 마케팅 임원</h2>
<h3>지원 방법</h3>
<p>이메일로 CV를 보내주세요: <strong>duongnv10504@gmail.com</strong></p>`,
      ja: `<h2>採用: デジタルマーケティングエグゼクティブ</h2>
<h3>応募方法</h3>
<p>CVをメールで送ってください: <strong>duongnv10504@gmail.com</strong></p>`,
      zh: `<h2>招聘：数字营销执行</h2>
<h3>申请方式</h3>
<p>请将简历发送至：<strong>duongnv10504@gmail.com</strong></p>`,
    },
  },

  // ── Tuyển dụng ───────────────────────────────────────────────────────────────
  {
    slug: 'tuyen-dung-content-creator-2025',
    type: 'tuyen-dung',
    thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=85&fit=crop',
    date: '01/06/2025', showOnHomepage: true, active: true,
    urgent: true, deadline: '2025-07-15', jobType: 'full-time', location: 'Hà Nội', salary: '12 – 18 triệu',
    category: { vi: 'Nội dung', en: 'Content', ko: '콘텐츠', ja: 'コンテンツ', zh: '内容' },
    title: {
      vi: 'Tuyển dụng Content Creator – Sáng tạo nội dung đa nền tảng',
      en: 'Content Creator – Multi-platform Content Creator',
      ko: '콘텐츠 크리에이터 채용', ja: 'コンテンツクリエイター募集', zh: '招聘内容创作者',
    },
    excerpt: {
      vi: 'WonMedia tìm kiếm Content Creator sáng tạo, đam mê âm nhạc và giải trí, có khả năng sản xuất nội dung hấp dẫn cho Facebook, TikTok, YouTube và các nền tảng số khác.',
      en: 'WonMedia is looking for a creative Content Creator passionate about music and entertainment, capable of producing engaging content for Facebook, TikTok, YouTube and other digital platforms.',
      ko: '', ja: '', zh: '',
    },
    content: {
      vi: `<h2>Về vị trí</h2><p>Bạn sẽ trực tiếp sản xuất và quản lý nội dung trên các kênh truyền thông của WonMedia.</p><h2>Trách nhiệm chính</h2><ul><li>Lên ý tưởng và sản xuất nội dung hàng ngày cho Facebook, TikTok, YouTube, Instagram</li><li>Viết bài blog, tin tức âm nhạc, thông cáo báo chí</li><li>Theo dõi và phân tích hiệu quả nội dung</li></ul><h2>Yêu cầu</h2><ul><li>Ít nhất <strong>1 năm kinh nghiệm</strong> làm nội dung số</li><li>Đam mê âm nhạc và văn hóa giải trí</li></ul><h2>Quyền lợi</h2><ul><li>Lương: <strong>12 – 18 triệu VNĐ/tháng</strong> + thưởng KPI</li><li>BHXH, BHYT đầy đủ</li></ul><p>Gửi CV về: <strong>duongnv10504@gmail.com</strong></p>`,
      en: `<h2>About the role</h2><p>You will directly produce and manage content across WonMedia's media channels.</p><h2>Requirements</h2><ul><li>At least <strong>1 year of experience</strong> in digital content</li><li>Passion for music and entertainment culture</li></ul><p>Send CV to: <strong>duongnv10504@gmail.com</strong></p>`,
      ko: '', ja: '', zh: '',
    },
  },
  {
    slug: 'tuyen-dung-graphic-designer-2025',
    type: 'tuyen-dung',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=85&fit=crop',
    date: '03/06/2025', showOnHomepage: true, active: true,
    urgent: false, deadline: '2025-07-31', jobType: 'hybrid', location: 'TP. Hồ Chí Minh', salary: '15 – 25 triệu',
    category: { vi: 'Thiết kế', en: 'Design', ko: '디자인', ja: 'デザイン', zh: '设计' },
    title: {
      vi: 'Tuyển dụng Graphic Designer – Thiết kế sáng tạo cho ngành giải trí',
      en: 'Graphic Designer – Creative Design for Entertainment Industry',
      ko: '그래픽 디자이너 채용', ja: 'グラフィックデザイナー募集', zh: '招聘平面设计师',
    },
    excerpt: {
      vi: 'Chúng tôi tìm kiếm Graphic Designer tài năng để tạo ra những sản phẩm trực quan ấn tượng — từ cover album, poster sự kiện đến bộ nhận diện thương hiệu nghệ sĩ.',
      en: 'We are looking for a talented Graphic Designer to create impressive visual products — from album covers and event posters to artist brand identity packages.',
      ko: '', ja: '', zh: '',
    },
    content: {
      vi: `<h2>Về vị trí</h2><p>WonMedia mở rộng đội ngũ sáng tạo, tìm Graphic Designer có khiếu thẩm mỹ cao.</p><h2>Trách nhiệm</h2><ul><li>Thiết kế cover album, single artwork cho nghệ sĩ</li><li>Tạo visual identity cho các chiến dịch âm nhạc</li><li>Thiết kế banner, poster, key visual sự kiện</li></ul><h2>Yêu cầu</h2><ul><li>Ít nhất <strong>2 năm kinh nghiệm</strong> thiết kế đồ họa</li><li>Thành thạo Adobe Photoshop, Illustrator, After Effects</li></ul><h2>Quyền lợi</h2><ul><li>Lương: <strong>15 – 25 triệu VNĐ/tháng</strong></li><li>Hybrid: 3 ngày văn phòng, 2 ngày remote</li></ul><p>Gửi CV về: <strong>duongnv10504@gmail.com</strong></p>`,
      en: `<h2>About the role</h2><p>WonMedia is expanding its creative team.</p><h2>Requirements</h2><ul><li>At least <strong>2 years of graphic design experience</strong></li><li>Proficient in Adobe Photoshop, Illustrator, After Effects</li></ul><p>Send CV to: <strong>duongnv10504@gmail.com</strong></p>`,
      ko: '', ja: '', zh: '',
    },
  },
  {
    slug: 'tuyen-dung-video-editor-2025',
    type: 'tuyen-dung',
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=85&fit=crop',
    date: '04/06/2025', showOnHomepage: false, active: true,
    urgent: true, deadline: '2025-06-30', jobType: 'full-time', location: 'Hà Nội', salary: '18 – 28 triệu',
    category: { vi: 'Kỹ thuật', en: 'Production', ko: '프로덕션', ja: 'プロダクション', zh: '制作' },
    title: {
      vi: 'Tuyển dụng Video Editor – Dựng phim MV & nội dung âm nhạc',
      en: 'Video Editor – MV & Music Content Production',
      ko: '비디오 에디터 채용', ja: 'ビデオエディター募集', zh: '招聘视频剪辑师',
    },
    excerpt: {
      vi: 'WonMedia cần Video Editor kinh nghiệm để dựng MV, lyric video, behind-the-scenes và nội dung video ngắn. Ưu tiên ứng viên có kinh nghiệm trong ngành âm nhạc.',
      en: 'WonMedia needs an experienced Video Editor to edit MVs, lyric videos, behind-the-scenes content and short video content. Priority given to candidates with music industry experience.',
      ko: '', ja: '', zh: '',
    },
    content: {
      vi: `<h2>Về vị trí</h2><p>Vị trí then chốt trong đội ngũ sản xuất nội dung của WonMedia.</p><h2>Trách nhiệm</h2><ul><li>Dựng phim MV, lyric video, official audio video cho nghệ sĩ</li><li>Tạo reels, short-form video cho TikTok, YouTube Shorts</li><li>Thực hiện color grading, motion graphics</li></ul><h2>Yêu cầu</h2><ul><li>Ít nhất <strong>2 năm kinh nghiệm</strong> dựng phim chuyên nghiệp</li><li>Thành thạo Adobe Premiere Pro, After Effects, DaVinci Resolve</li></ul><h2>Quyền lợi</h2><ul><li>Lương: <strong>18 – 28 triệu VNĐ/tháng</strong> + thưởng dự án</li></ul><p>Gửi CV về: <strong>duongnv10504@gmail.com</strong></p>`,
      en: `<h2>About the role</h2><p>Key position in WonMedia's content production team.</p><h2>Requirements</h2><ul><li>At least <strong>2 years of professional video editing experience</strong></li><li>Proficient in Adobe Premiere Pro, After Effects, DaVinci Resolve</li></ul><p>Send CV to: <strong>duongnv10504@gmail.com</strong></p>`,
      ko: '', ja: '', zh: '',
    },
  },
  {
    slug: 'tuyen-dung-digital-marketing-specialist-2025',
    type: 'tuyen-dung',
    thumbnail: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=1200&q=85&fit=crop',
    date: '05/06/2025', showOnHomepage: true, active: true,
    urgent: false, deadline: '2025-08-15', jobType: 'remote', location: 'Remote toàn quốc', salary: '15 – 22 triệu',
    category: { vi: 'Marketing', en: 'Marketing', ko: '마케팅', ja: 'マーケティング', zh: '营销' },
    title: {
      vi: 'Tuyển dụng Digital Marketing Specialist – Làm việc Remote',
      en: 'Digital Marketing Specialist – Remote Work',
      ko: '디지털 마케팅 스페셜리스트 채용', ja: 'デジタルマーケティングスペシャリスト募集', zh: '招聘数字营销专员',
    },
    excerpt: {
      vi: 'WonMedia tìm kiếm Digital Marketing Specialist làm việc remote, phụ trách các chiến dịch quảng bá âm nhạc, tăng trưởng lượng người nghe và xây dựng cộng đồng fan trực tuyến.',
      en: 'WonMedia is looking for a Digital Marketing Specialist to work remotely, responsible for music promotion campaigns, growing listener counts and building online fan communities.',
      ko: '', ja: '', zh: '',
    },
    content: {
      vi: `<h2>Về vị trí</h2><p>Vị trí <strong>100% remote</strong>, dẫn dắt chiến lược digital marketing cho danh mục nghệ sĩ của WonMedia.</p><h2>Trách nhiệm</h2><ul><li>Lên kế hoạch và thực thi chiến dịch marketing cho single/album mới</li><li>Quản lý Facebook Ads, Google Ads, TikTok Ads</li><li>Spotify editorial pitching, playlist promotion</li></ul><h2>Yêu cầu</h2><ul><li>Ít nhất <strong>2 năm kinh nghiệm digital marketing</strong></li><li>Hiểu biết sâu về các nền tảng âm nhạc số</li></ul><h2>Quyền lợi</h2><ul><li>Lương: <strong>15 – 22 triệu VNĐ/tháng</strong> + hoa hồng performance</li><li>100% remote — linh hoạt thời gian</li></ul><p>Gửi CV về: <strong>duongnv10504@gmail.com</strong></p>`,
      en: `<h2>About the role</h2><p><strong>100% remote</strong> position leading digital marketing strategies for WonMedia's artist portfolio.</p><h2>Requirements</h2><ul><li>At least <strong>2 years of digital marketing experience</strong></li><li>Deep understanding of digital music platforms</li></ul><p>Send CV to: <strong>duongnv10504@gmail.com</strong></p>`,
      ko: '', ja: '', zh: '',
    },
  },
  {
    slug: 'tuyen-dung-business-development-manager-2025',
    type: 'tuyen-dung',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=85&fit=crop',
    date: '05/06/2025', showOnHomepage: false, active: true,
    urgent: false, deadline: '2025-08-31', jobType: 'full-time', location: 'Hà Nội hoặc TP.HCM', salary: 'Thỏa thuận',
    category: { vi: 'Kinh doanh', en: 'Business', ko: '비즈니스', ja: 'ビジネス', zh: '商业' },
    title: {
      vi: 'Tuyển dụng Business Development Manager – Phát triển đối tác âm nhạc',
      en: 'Business Development Manager – Music Partnership Development',
      ko: '비즈니스 개발 매니저 채용', ja: 'ビジネスデベロップメントマネージャー募集', zh: '招聘商务拓展经理',
    },
    excerpt: {
      vi: 'WonMedia tìm kiếm Business Development Manager giàu kinh nghiệm để xây dựng và mở rộng mạng lưới đối tác trong ngành âm nhạc, giải trí và công nghệ.',
      en: 'WonMedia is looking for an experienced Business Development Manager to build and expand its partner network in the music, entertainment and technology industries.',
      ko: '', ja: '', zh: '',
    },
    content: {
      vi: `<h2>Về vị trí</h2><p>Vị trí chiến lược — cầu nối giữa WonMedia và các đối tác nhãn hàng, nền tảng công nghệ, record labels quốc tế.</p><h2>Trách nhiệm</h2><ul><li>Tìm kiếm và ký kết hợp đồng với đối tác mới trong và ngoài nước</li><li>Đàm phán và xây dựng thỏa thuận hợp tác chiến lược</li></ul><h2>Yêu cầu</h2><ul><li>Ít nhất <strong>3 năm kinh nghiệm</strong> Business Development hoặc Sales B2B</li><li>Tiếng Anh thành thạo</li></ul><h2>Quyền lợi</h2><ul><li>Lương và bonus <strong>thỏa thuận theo năng lực</strong></li><li>Phúc lợi: BHXH, bảo hiểm sức khỏe cao cấp</li></ul><p>Gửi CV về: <strong>duongnv10504@gmail.com</strong></p>`,
      en: `<h2>About the role</h2><p>Strategic position bridging WonMedia and partners — brands, tech platforms, international record labels.</p><h2>Requirements</h2><ul><li>At least <strong>3 years of experience</strong> in Business Development or B2B Sales</li><li>Fluent English</li></ul><p>Send CV to: <strong>duongnv10504@gmail.com</strong></p>`,
      ko: '', ja: '', zh: '',
    },
  },
  {
    slug: 'tuyen-dung-social-media-executive-2025',
    type: 'tuyen-dung',
    thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200&q=85&fit=crop',
    date: '06/06/2025', showOnHomepage: true, active: true,
    urgent: false, deadline: '2025-07-20', jobType: 'full-time', location: 'TP. Hồ Chí Minh', salary: '10 – 15 triệu',
    category: { vi: 'Truyền thông', en: 'Media', ko: '미디어', ja: 'メディア', zh: '媒体' },
    title: {
      vi: 'Tuyển dụng Social Media Executive – Quản lý kênh nghệ sĩ',
      en: 'Social Media Executive – Artist Channel Management',
      ko: '소셜 미디어 전문가 채용', ja: 'ソーシャルメディアエグゼクティブ募集', zh: '招聘社交媒体专员',
    },
    excerpt: {
      vi: 'Bạn đam mê mạng xã hội và yêu âm nhạc? WonMedia cần một Social Media Executive để vận hành và phát triển các kênh Facebook, TikTok, Instagram cho nghệ sĩ của chúng tôi.',
      en: 'Are you passionate about social media and love music? WonMedia needs a Social Media Executive to operate and grow Facebook, TikTok and Instagram channels for artists in our portfolio.',
      ko: '', ja: '', zh: '',
    },
    content: {
      vi: `<h2>Về vị trí</h2><p>Trực tiếp quản lý các trang mạng xã hội của nghệ sĩ trong danh mục WonMedia.</p><h2>Trách nhiệm</h2><ul><li>Vận hành hàng ngày Facebook, TikTok, Instagram, YouTube của nghệ sĩ</li><li>Lên lịch và đăng nội dung theo content calendar</li><li>Tương tác với cộng đồng fan</li></ul><h2>Yêu cầu</h2><ul><li>Ít nhất <strong>1 năm kinh nghiệm</strong> quản lý mạng xã hội</li><li>Yêu âm nhạc, biết xu hướng giải trí hiện tại</li></ul><h2>Quyền lợi</h2><ul><li>Lương: <strong>10 – 15 triệu VNĐ/tháng</strong></li><li>Tham dự sự kiện âm nhạc, concert miễn phí</li></ul><p>Gửi CV về: <strong>duongnv10504@gmail.com</strong></p>`,
      en: `<h2>About the role</h2><p>Directly manage artists' social media pages in WonMedia's portfolio.</p><h2>Requirements</h2><ul><li>At least <strong>1 year of social media management experience</strong></li><li>Love for music and entertainment trends</li></ul><p>Send CV to: <strong>duongnv10504@gmail.com</strong></p>`,
      ko: '', ja: '', zh: '',
    },
  },
]

async function seedPosts() {
  let created = 0
  for (const post of POSTS) {
    const exists = await Post.findOne({ slug: post.slug })
    if (!exists) {
      await Post.create(post)
      created++
    }
  }
  if (created > 0) console.log(`[seed] Created ${created} posts`)
}

// ─── Settings ─────────────────────────────────────────────────────────────────

async function seedSettings() {
  const exists = await Setting.findOne({ key: 'global' })
  if (exists) return

  await Setting.create({
    key: 'global',
    general: {
      portalName: 'WonMedia',
      tagline: 'Đơn vị hàng đầu trong lĩnh vực quản lý nội dung số và phát hành âm nhạc tại Việt Nam',
      publicDomain: 'https://wonmedia.vercel.app',
      systemEmail: 'duongnv10504@gmail.com',
    },
    header: {
      navDisplayName: '', logoEn: 'Won Media', logoVi: 'Won Media',
      faviconUrl: '/logo.png', logoImageUrl: '/logo.png',
    },
  })
  console.log('[seed] Settings created')
}

// ─── Footer ────────────────────────────────────────────────────────────────────

async function seedFooter() {
  const exists = await FooterConfig.findOne({ key: 'global' })
  if (exists?.brandDesc?.vi) return

  await FooterConfig.findOneAndUpdate({ key: 'global' }, { $set: {
    key: 'global',
    companyName: { vi: 'CÔNG TY TNHH WON MEDIA', en: 'WON MEDIA CO., LTD.', ko: '원미디어 주식회사', ja: 'ウォンメディア株式会社', zh: '旺传媒有限公司' },
    brandDesc: { vi: 'Đơn vị tiên phong trong phân phối âm nhạc số và quản lý bản quyền tại Việt Nam.', en: 'Pioneering digital music distribution and copyright management in Vietnam.', ko: '베트남의 디지털 음악 배급 및 저작권 관리 선구자.', ja: 'ベトナムのデジタル音楽配信・著作権管理のパイオニア。', zh: '越南数字音乐发行与版权管理的先驱。' },
    navAbout:    { vi: 'Giới thiệu', en: 'About Us',  ko: '회사 소개', ja: '会社概要',   zh: '关于我们' },
    navServices: { vi: 'Dịch vụ',   en: 'Services',   ko: '서비스',   ja: 'サービス',   zh: '服务' },
    navCareers:  { vi: 'Tuyển dụng',en: 'Careers',    ko: '채용',     ja: '採用情報',   zh: '招聘' },
    navBlog:     { vi: 'Tin tức',   en: 'News',        ko: '뉴스',     ja: 'ニュース',   zh: '新闻' },
    navContact:  { vi: 'Liên hệ',  en: 'Contact',     ko: '연락처',   ja: 'お問い合わせ',zh: '联系我们' },
    servicesHeading: { vi: 'Dịch vụ', en: 'Services', ko: '서비스', ja: 'サービス', zh: '服务' },
    service1: { vi: 'Phân phối âm nhạc số',  en: 'Digital Music Distribution', ko: '디지털 음악 배급', ja: 'デジタル音楽配信', zh: '数字音乐发行' },
    service2: { vi: 'Quản lý bản quyền',     en: 'Copyright Management',       ko: '저작권 관리',     ja: '著作権管理',       zh: '版权管理' },
    service3: { vi: 'Marketing âm nhạc',     en: 'Music Marketing',            ko: '음악 마케팅',     ja: '音楽マーケティング',zh: '音乐营销' },
    service4: { vi: 'Sản xuất nội dung',     en: 'Content Production',         ko: '콘텐츠 제작',     ja: 'コンテンツ制作',    zh: '内容制作' },
    locationHeading: { vi: 'Trụ sở:',   en: 'Headquarters:', ko: '본사:',  ja: '本社:',  zh: '总部:' },
    locationCity:    { vi: 'HÀ NỘI, VIỆT NAM', en: 'HANOI, VIETNAM', ko: '하노이, 베트남', ja: 'ハノイ、ベトナム', zh: '河内，越南' },
    phone:   '+84 28 1234 5678',
    hotline: '1800 1234',
    email:   'duongnv10504@gmail.com',
    zalo:    '0901234567',
    copyright: {
      vi: '© 2025 WonMedia. Bảo lưu mọi quyền.',
      en: '© 2025 WonMedia. All rights reserved.',
      ko: '© 2025 WonMedia. 모든 권리 보유.',
      ja: '© 2025 WonMedia. All rights reserved.',
      zh: '© 2025 WonMedia. 保留所有权利。',
    },
  }}, { upsert: true })
  console.log('[seed] Footer created/updated with brandDesc')
}

// ─── About ────────────────────────────────────────────────────────────────────

async function seedAbout() {
  const exists = await AboutConfig.findOne({ key: 'global' }).lean() as { bannerTitle?: { vi?: string } } | null
  if (exists?.bannerTitle?.vi) return  // đã có nội dung thật → không ghi đè

  await AboutConfig.findOneAndUpdate({ key: 'global' }, { $set: {
    bannerSubtitle: { vi: 'VỀ CHÚNG TÔI', en: 'ABOUT US', ko: '회사 소개', ja: '会社概要', zh: '关于我们' },
    bannerTitle: {
      vi: 'Đơn vị truyền thông hàng đầu Việt Nam',
      en: 'Vietnam\'s Leading Media Company',
      ko: '베트남 최고의 미디어 기업',
      ja: 'ベトナム最大手のメディア企業',
      zh: '越南领先的媒体公司',
    },
    aboutLabel: { vi: 'VỀ WON MEDIA', en: 'ABOUT WON MEDIA', ko: 'WON MEDIA 소개', ja: 'WON MEDIAについて', zh: '关于WON MEDIA' },
    aboutTitleLine1: {
      vi: 'Sứ mệnh đưa âm nhạc',
      en: 'Our mission to bring music',
      ko: '음악을 세계로',
      ja: '音楽を世界へ',
      zh: '将音乐带向世界',
    },
    aboutTitleHighlight: {
      vi: 'Việt Nam ra thế giới',
      en: 'from Vietnam to the world',
      ko: '베트남에서 세계로',
      ja: 'ベトナムから世界へ',
      zh: '从越南走向世界',
    },
    aboutDesc1Prefix: { vi: 'Được thành lập từ năm', en: 'Founded in', ko: '설립 연도:', ja: '設立年:', zh: '成立于' },
    aboutDesc1Year:   { vi: '2020', en: '2020', ko: '2020', ja: '2020', zh: '2020' },
    aboutDesc1Suffix: {
      vi: ', WON Media đã trở thành đơn vị tiên phong trong lĩnh vực phân phối âm nhạc số và quản lý bản quyền tại Việt Nam.',
      en: ', WON Media has become a pioneer in digital music distribution and copyright management in Vietnam.',
      ko: ', WON Media는 베트남의 디지털 음악 배급 및 저작권 관리 분야의 선구자가 되었습니다.',
      ja: ', WON Mediaはベトナムのデジタルâmusic配信と著作権管理のパイオニアとなりました。',
      zh: ', WON Media已成为越南数字音乐发行和版权管理领域的先驱。',
    },
    aboutDesc2: {
      vi: 'Với đội ngũ hơn 50 chuyên gia giàu kinh nghiệm, chúng tôi đã hợp tác cùng hàng trăm nghệ sĩ và nhãn hàng, mang âm nhạc Việt Nam đến với khán giả toàn cầu trên hơn 150 nền tảng streaming quốc tế.',
      en: 'With a team of over 50 experienced professionals, we have partnered with hundreds of artists and brands, bringing Vietnamese music to global audiences on over 150 international streaming platforms.',
      ko: '50명 이상의 경험 있는 전문가 팀을 보유하여 수백 명의 아티스트 및 브랜드와 협력하여 150개 이상의 국제 스트리밍 플랫폼에서 전 세계 관객에게 베트남 음악을 전달합니다.',
      ja: '50人以上の経験豊富な専門家チームを擁し、数百のアーティストやブランドと提携し、150以上の国際ストリーミングプラットフォームで世界中の視聴者にベトナムの音楽を届けています。',
      zh: '拥有50余名经验丰富的专业人士团队，我们与数百位艺术家和品牌合作，在150多个国际流媒体平台上将越南音乐带给全球观众。',
    },
    aboutExpValue: { vi: '5+', en: '5+', ko: '5+', ja: '5+', zh: '5+' },
    aboutExpText:  { vi: 'Năm kinh nghiệm', en: 'Years of experience', ko: '년 경험', ja: '年の経験', zh: '年经验' },
    aboutButton:   { vi: 'Liên hệ với chúng tôi', en: 'Contact Us', ko: '문의하기', ja: 'お問い合わせ', zh: '联系我们' },
    timelineHeading: { vi: 'Hành trình phát triển', en: 'Our Journey', ko: '성장 여정', ja: '成長の歩み', zh: '发展历程' },
    timelineMilestones: [
      {
        title: { vi: 'Thành lập WON Media', en: 'WON Media Founded', ko: 'WON Media 설립', ja: 'WON Media 設立', zh: 'WON Media 成立' },
        line1: { vi: 'Ra mắt với đội ngũ 5 thành viên', en: 'Launched with a team of 5 members', ko: '5명의 팀으로 출발', ja: '5人のチームで始動', zh: '以5人团队起步' },
        line2: { vi: 'Tập trung vào phân phối âm nhạc', en: 'Focused on music distribution', ko: '음악 배급에 집중', ja: '音楽配信に注力', zh: '专注于音乐发行' },
      },
      {
        title: { vi: 'Đạt 100 nghệ sĩ đối tác', en: 'Reached 100 partner artists', ko: '파트너 아티스트 100명 달성', ja: 'パートナーアーティスト100名達成', zh: '达成100位合作艺术家' },
        line1: { vi: 'Mở rộng lên 50 nền tảng streaming', en: 'Expanded to 50 streaming platforms', ko: '50개 스트리밍 플랫폼으로 확장', ja: '50ストリーミングプラットフォームに拡大', zh: '扩展至50个流媒体平台' },
        line2: { vi: 'Ra mắt dịch vụ quản lý bản quyền', en: 'Launched copyright management service', ko: '저작권 관리 서비스 출시', ja: '著作権管理サービス開始', zh: '推出版权管理服务' },
      },
      {
        title: { vi: 'Hợp tác quốc tế đầu tiên', en: 'First International Partnership', ko: '첫 국제 파트너십', ja: '初の国際パートナーシップ', zh: '首次国际合作' },
        line1: { vi: 'Ký kết với các label Hàn Quốc, Nhật Bản', en: 'Signed with Korean and Japanese labels', ko: '한국 및 일본 레이블과 계약', ja: '韓国・日本のレーベルと契約', zh: '与韩日唱片公司签约' },
        line2: { vi: 'Phân phối lên 100+ nền tảng toàn cầu', en: 'Distribution across 100+ global platforms', ko: '100개 이상 글로벌 플랫폼 배급', ja: '100以上のグローバルプラットフォームへ配信', zh: '发行至100多个全球平台' },
      },
      {
        title: { vi: 'Ra mắt dịch vụ Marketing âm nhạc', en: 'Music Marketing Service Launch', ko: '음악 마케팅 서비스 출시', ja: '音楽マーケティングサービス開始', zh: '音乐营销服务上线' },
        line1: { vi: 'Chiến dịch đa kênh cho 200+ nghệ sĩ', en: 'Multi-channel campaigns for 200+ artists', ko: '200+ 아티스트 대상 멀티채널 캠페인', ja: '200+アーティスト向けマルチチャネルキャンペーン', zh: '为200+艺术家开展多渠道营销' },
        line2: { vi: 'Hợp tác với VTV, VTVcab, HTV', en: 'Partnership with VTV, VTVcab, HTV', ko: 'VTV, VTVcab, HTV와 파트너십', ja: 'VTV、VTVcab、HTVとのパートナーシップ', zh: '与VTV、VTVcab、HTV合作' },
      },
      {
        title: { vi: 'Nền tảng phân phối thế hệ mới', en: 'Next-Gen Distribution Platform', ko: '차세대 배급 플랫폼', ja: '次世代配信プラットフォーム', zh: '新一代发行平台' },
        line1: { vi: 'Ra mắt hệ thống phân tích doanh thu AI', en: 'Launched AI revenue analytics system', ko: 'AI 수익 분석 시스템 출시', ja: 'AI収益分析システム開始', zh: '推出AI收益分析系统' },
        line2: { vi: 'Phủ sóng 150+ nền tảng toàn cầu', en: 'Coverage across 150+ global platforms', ko: '150개 이상 플랫폼 글로벌 커버리지', ja: '150以上のプラットフォームをカバー', zh: '覆盖150+全球平台' },
      },
      {
        title: { vi: 'Mở rộng khu vực Đông Nam Á', en: 'Southeast Asia Expansion', ko: '동남아시아 확장', ja: '東南アジアへの拡大', zh: '东南亚业务扩展' },
        line1: { vi: 'Văn phòng tại Thái Lan, Indonesia', en: 'Offices in Thailand, Indonesia', ko: '태국, 인도네시아 사무소', ja: 'タイ・インドネシアにオフィス開設', zh: '泰国、印度尼西亚设立办事处' },
        line2: { vi: 'Đội ngũ 50+ chuyên gia đa quốc gia', en: '50+ multinational expert team', ko: '50명 이상 다국적 전문가 팀', ja: '50名以上の多国籍専門家チーム', zh: '50+多国籍专家团队' },
      },
    ],
    whyUsHeading: { vi: 'Tại sao chọn WON Media?', en: 'Why Choose WON Media?', ko: '왜 WON Media인가?', ja: 'なぜWON Mediaを選ぶのか？', zh: '为什么选择WON Media？' },
    whyUsReasons: [
      {
        title: { vi: 'Đội ngũ chuyên gia', en: 'Expert Team', ko: '전문가 팀', ja: '専門家チーム', zh: '专业团队' },
        desc:  { vi: 'Hơn 50 chuyên gia với kinh nghiệm sâu về âm nhạc số và bản quyền quốc tế.', en: 'Over 50 experts with deep experience in digital music and international copyright.', ko: '디지털 음악과 국제 저작권에 깊은 경험을 가진 50명 이상의 전문가.', ja: 'デジタル音楽と国際著作権に深い経験を持つ50名以上の専門家。', zh: '50余名在数字音乐和国际版权方面拥有深厚经验的专家。' },
      },
      {
        title: { vi: 'Mạng lưới toàn cầu', en: 'Global Network', ko: '글로벌 네트워크', ja: 'グローバルネットワーク', zh: '全球网络' },
        desc:  { vi: 'Kết nối với 150+ nền tảng streaming và hàng nghìn đối tác trên toàn thế giới.', en: 'Connected to 150+ streaming platforms and thousands of partners worldwide.', ko: '150개 이상의 스트리밍 플랫폼과 전 세계 수천 개의 파트너와 연결.', ja: '150以上のストリーミングプラットフォームと世界中の何千ものパートナーと接続。', zh: '与150+流媒体平台和全球数千个合作伙伴相连。' },
      },
      {
        title: { vi: 'Công nghệ hiện đại', en: 'Modern Technology', ko: '현대적인 기술', ja: '最新技術', zh: '现代技术' },
        desc:  { vi: 'Ứng dụng AI và big data để tối ưu hóa chiến lược phân phối và marketing âm nhạc.', en: 'Applying AI and big data to optimize music distribution and marketing strategies.', ko: 'AI와 빅데이터를 적용하여 음악 배급 및 마케팅 전략을 최적화.', ja: 'AIとビッグデータを活用して音楽配信とマーケティング戦略を最適化。', zh: '应用AI和大数据优化音乐发行和营销策略。' },
      },
      {
        title: { vi: 'Hỗ trợ toàn diện', en: 'Comprehensive Support', ko: '종합적인 지원', ja: '総合サポート', zh: '全面支持' },
        desc:  { vi: 'Đồng hành cùng nghệ sĩ từ sản xuất, phân phối đến marketing và quản lý bản quyền.', en: 'Accompanying artists from production, distribution to marketing and copyright management.', ko: '제작, 배급, 마케팅 및 저작권 관리까지 아티스트와 함께.', ja: 'プロダクション、配信からマーケティングと著作権管理まで アーティストに同行。', zh: '从制作、发行到营销和版权管理，全程陪伴艺术家。' },
      },
      {
        title: { vi: 'Minh bạch tài chính', en: 'Financial Transparency', ko: '재정 투명성', ja: '財務の透明性', zh: '财务透明' },
        desc:  { vi: 'Báo cáo doanh thu theo thời gian thực, rõ ràng và trung thực với mọi nghệ sĩ đối tác.', en: 'Real-time revenue reporting, clear and honest with all partner artists.', ko: '모든 파트너 아티스트와 함께 실시간 수익 보고, 명확하고 정직하게.', ja: 'すべてのパートナーアーティストに対してリアルタイムの収益報告、明確かつ誠実に。', zh: '与所有合作艺术家实时收益报告，清晰诚实。' },
      },
      {
        title: { vi: 'Uy tín thương hiệu', en: 'Brand Reputation', ko: '브랜드 신뢰성', ja: 'ブランドの信頼性', zh: '品牌信誉' },
        desc:  { vi: 'Được hàng trăm nghệ sĩ và doanh nghiệp tin tưởng lựa chọn trong 5 năm qua.', en: 'Trusted by hundreds of artists and businesses over the past 5 years.', ko: '지난 5년간 수백 명의 아티스트와 기업이 선택한 신뢰할 수 있는 파트너.', ja: 'この5年間、数百のアーティストや企業から信頼されてきたパートナー。', zh: '过去5年来受到数百位艺术家和企业的信赖与选择。' },
      },
    ],
    servicesHeading: { vi: 'Dịch vụ của chúng tôi', en: 'Our Services', ko: '서비스', ja: 'サービス', zh: '我们的服务' },
    servicesItems: [
      {
        title: { vi: 'Phân phối âm nhạc số', en: 'Digital Music Distribution', ko: '디지털 음악 배급', ja: 'デジタル音楽配信', zh: '数字音乐发行' },
        desc:  { vi: 'Đưa âm nhạc của bạn lên 150+ nền tảng streaming toàn cầu chỉ trong vài ngày.', en: 'Get your music on 150+ global streaming platforms within days.', ko: '며칠 내에 150개 이상의 글로벌 스트리밍 플랫폼에 음악을 게시하세요.', ja: '数日以内に150以上のグローバルストリーミングプラットフォームに音楽を届けます。', zh: '几天内将您的音乐上线至150多个全球流媒体平台。' },
      },
      {
        title: { vi: 'Quản lý bản quyền', en: 'Copyright Management', ko: '저작권 관리', ja: '著作権管理', zh: '版权管理' },
        desc:  { vi: 'Bảo vệ tác phẩm và tối ưu hóa nguồn thu từ bản quyền âm nhạc của bạn.', en: 'Protect your work and optimize revenue from your music copyright.', ko: '작품을 보호하고 음악 저작권 수익을 최적화하세요.', ja: '作品を保護し、音楽著作権からの収益を最適化します。', zh: '保护您的作品并优化音乐版权收益。' },
      },
      {
        title: { vi: 'Marketing âm nhạc', en: 'Music Marketing', ko: '음악 마케팅', ja: '音楽マーケティング', zh: '音乐营销' },
        desc:  { vi: 'Chiến dịch marketing đa kênh giúp âm nhạc của bạn tiếp cận hàng triệu người nghe.', en: 'Multi-channel marketing campaigns to reach millions of listeners.', ko: '수백만 명의 청취자에게 도달하는 멀티채널 마케팅 캠페인.', ja: '何百万人もの聴衆にリーチするマルチチャネルマーケティングキャンペーン。', zh: '多渠道营销活动，助您的音乐触达数百万听众。' },
      },
      {
        title: { vi: 'Sản xuất nội dung', en: 'Content Production', ko: '콘텐츠 제작', ja: 'コンテンツ制作', zh: '内容制作' },
        desc:  { vi: 'Sản xuất MV, lyric video, content mạng xã hội chuyên nghiệp, sáng tạo.', en: 'Professional and creative production of MVs, lyric videos, and social media content.', ko: 'MV, 가사 비디오 및 소셜 미디어 콘텐츠의 전문적이고 창의적인 제작.', ja: 'MV、歌詞動画、ソーシャルメディアコンテンツのプロフェッショナルでクリエイティブな制作。', zh: 'MV、歌词视频和社交媒体内容的专业创意制作。' },
      },
    ],
  } }, { upsert: true, new: true })
  console.log('[seed] About page content created')
}

// ─── Contact ──────────────────────────────────────────────────────────────────

async function seedContact() {
  const exists = await ContactConfig.findOne({ key: 'global' }).lean() as { bannerTitle?: { vi?: string } } | null
  if (exists?.bannerTitle?.vi) return  // đã có nội dung thật → không ghi đè

  await ContactConfig.findOneAndUpdate({ key: 'global' }, { $set: {
    key: 'global',
    bannerSubtitle: { vi: 'LIÊN HỆ', en: 'CONTACT', ko: '연락처', ja: 'お問い合わせ', zh: '联系我们' },
    bannerTitle: {
      vi: 'Hãy kết nối với chúng tôi',
      en: 'Let\'s Connect With Us',
      ko: '우리와 연결하세요',
      ja: 'お気軽にご連絡ください',
      zh: '与我们建立联系',
    },
    address: {
      vi: 'Tầng 5, Tòa nhà WON Tower, 123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
      en: '5th Floor, WON Tower, 123 Nguyen Hue, District 1, Ho Chi Minh City',
      ko: '5층, WON 타워, 123 응우옌 후에, 1군, 호치민시',
      ja: '5階、WONタワー、123グエン・フエ、1区、ホーチミン市',
      zh: '5楼，WON大厦，123阮惠街，1郡，胡志明市',
    },
    phone:           '+84 28 1234 5678',
    hotline:         '1800 1234',
    email:           'duongnv10504@gmail.com',
    zalo:            '0901234567',
    googleMapsUrl:   'https://maps.google.com/?q=Ho+Chi+Minh+City',
    googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d501.7148577413613!2d106.70244752924595!3d10.776489600000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4670702e31%3A0xa5777fb3d5b57e59!2sNguy%E1%BB%85n%20Hu%E1%BB%87%2C%20Ph%C6%B0%E1%BB%9Dng%20B%E1%BA%BFn%20Ngh%C3%A9%2C%20Qu%E1%BA%ADn%201%2C%20Th%C3%A0nh%20ph%E1%BB%91%20H%E1%BB%93%20Ch%C3%AD%20Minh%2C%20Vietnam!5e0!3m2!1sen!2s!4v1718000000000!5m2!1sen!2s',
    formTitle: {
      vi: 'Gửi tin nhắn cho chúng tôi',
      en: 'Send Us a Message',
      ko: '메시지를 보내주세요',
      ja: 'メッセージを送る',
      zh: '给我们发消息',
    },
    formSubtitle: {
      vi: 'Điền thông tin bên dưới, chúng tôi sẽ phản hồi trong vòng 24 giờ.',
      en: 'Fill in the form below and we will respond within 24 hours.',
      ko: '아래 양식을 작성해 주시면 24시간 내에 답변 드리겠습니다.',
      ja: '以下のフォームにご記入ください。24時間以内にご返信します。',
      zh: '填写下面的表单，我们将在24小时内回复。',
    },
  } }, { upsert: true, new: true })
  console.log('[seed] Contact page content created')
}

// ─── Homepage ─────────────────────────────────────────────────────────────────

async function seedHomepage() {
  const heroCount = await HomepageHero.countDocuments()
  if (!heroCount) {
    await HomepageHero.create({
      key: 'main',
      title:    { vi: 'BRINGING MUSIC', en: 'BRINGING MUSIC', ko: 'BRINGING MUSIC', ja: 'BRINGING MUSIC', zh: 'BRINGING MUSIC' },
      title2:   { vi: 'TO THE WORLD',   en: 'TO THE WORLD',   ko: 'TO THE WORLD',   ja: 'TO THE WORLD',   zh: 'TO THE WORLD' },
      subtitle: {
        vi: 'WON Media – Đơn vị phát hành âm nhạc & khai thác bản quyền hàng đầu Việt Nam.',
        en: "WON Media – Vietnam's leading music distribution & copyright management company.",
        ko: 'WON Media – 베트남 최고의 음악 배급 및 저작권 관리 회사.',
        ja: 'WON Media – ベトナムを代表する音楽配信・著作権管理会社。',
        zh: 'WON Media – 越南领先的音乐发行与版权管理公司。',
      },
    })
    console.log('[seed] Homepage hero created')
  }

  const svcCount = await HomepageService.countDocuments()
  if (!svcCount) {
    await HomepageService.insertMany([
      { order: 0, iconKey: 'play',    title: { vi: 'Kinh doanh trên mạng xã hội', en: 'Social Media Business',        ko: '소셜 미디어 비즈니스',   ja: 'ソーシャルメディアビジネス', zh: '社交媒体业务' }, desc: { vi: 'WON Media là đối tác chính thức của YouTube, Facebook và TikTok tại Việt Nam.', en: 'WON Media is an official partner of YouTube, Facebook, and TikTok in Vietnam.', ko: 'WON Media는 베트남의 YouTube, Facebook, TikTok 공식 파트너입니다.', ja: 'WON MediaはベトナムのYouTube、Facebook、TikTokの公式パートナーです。', zh: 'WON Media是越南YouTube、Facebook和TikTok的官方合作伙伴。' } },
      { order: 1, iconKey: 'music',   title: { vi: 'Phát hành âm nhạc',           en: 'Music Distribution',           ko: '음악 배급',              ja: '音楽配信',                  zh: '音乐发行' },       desc: { vi: 'Triển khai phát hành nhạc tới các nền tảng toàn cầu như Spotify, Apple Music, YouTube Music, TikTok.', en: 'Distribute music to global platforms such as Spotify, Apple Music, YouTube Music, TikTok.', ko: 'Spotify, Apple Music 등 글로벌 플랫폼에 음악을 배급합니다.', ja: 'Spotify、Apple Musicなどのグローバルプラットフォームへ音楽を配信します。', zh: '向Spotify、Apple Music等全球平台发行音乐。' } },
      { order: 2, iconKey: 'youtube', title: { vi: 'Khai thác nội dung bản quyền', en: 'Copyright Content Exploitation', ko: '저작권 콘텐츠 활용',      ja: '著作権コンテンツ活用',      zh: '版权内容开发' },   desc: { vi: 'Phân phối nội dung có bản quyền thuộc nhiều thể loại trên các nền tảng online và truyền hình.', en: 'Distribute copyrighted content across various genres on online platforms and television.', ko: '다양한 장르의 저작권 콘텐츠를 배급합니다.', ja: '様々なジャンルの著作権コンテンツを配信します。', zh: '分发各类版权内容。' } },
      { order: 3, iconKey: 'shield',  title: { vi: 'Dịch vụ bản quyền',           en: 'Copyright Services',           ko: '저작권 서비스',          ja: '著作権サービス',            zh: '版权服务' },       desc: { vi: 'Bảo vệ bản quyền nội dung cho các đối tác trên môi trường số; quản lý bản quyền tác giả âm nhạc.', en: 'Protect digital content copyrights for partners and manage music copyright ownership.', ko: '디지털 환경에서 파트너의 콘텐츠 저작권을 보호하고 음악 저작권을 관리합니다.', ja: 'デジタル環境でパートナーのコンテンツ著作権を保護し、音楽著作権を管理します。', zh: '在数字环境中保护合作伙伴的内容版权，管理音乐版权。' } },
    ])
    console.log('[seed] Homepage services created')
  }

  const achCount = await HomepageAchievement.countDocuments()
  if (!achCount) {
    await HomepageAchievement.insertMany([
      { order: 0, value: 150, label: { vi: 'Đối tác',              en: 'Partners',               ko: '파트너',       ja: 'パートナー',          zh: '合作伙伴' } },
      { order: 1, value: 25,  label: { vi: 'Nút vàng',             en: 'Gold Buttons',           ko: '골든 버튼',    ja: 'ゴールドボタン',      zh: '金牌按钮' } },
      { order: 2, value: 100, label: { vi: 'Nút bạc YouTube',      en: 'Silver YouTube Buttons', ko: '실버 유튜브',  ja: 'シルバーYouTube',    zh: '银牌YouTube' } },
      { order: 3, value: 250, label: { vi: 'Kênh trong hệ thống',  en: 'Channels in System',     ko: '시스템 내 채널', ja: 'システム内チャンネル', zh: '系统内频道' } },
    ])
    console.log('[seed] Homepage achievements created')
  }

  const partnerCount = await HomepagePartner.countDocuments()
  if (!partnerCount) {
    await HomepagePartner.insertMany([
      { order: 0, name: 'YouTube',     logo: '/partners/youtube.png' },
      { order: 1, name: 'Facebook',    logo: '/partners/facebook.png' },
      { order: 2, name: 'Instagram',   logo: '/partners/instagram.png' },
      { order: 3, name: 'TikTok',      logo: '/partners/tiktok.png' },
      { order: 4, name: 'Spotify',     logo: '/partners/spotify.png' },
      { order: 5, name: 'Apple Music', logo: '/partners/apple-music.png' },
      { order: 6, name: 'VTV',         logo: '/partners/vtv.png' },
      { order: 7, name: 'VOV',         logo: '/partners/vov.png' },
      { order: 8, name: 'VTVcab',      logo: '/partners/vtvcab.png' },
      { order: 9, name: 'VTV News',    logo: '/partners/vtv-news.png' },
    ])
    console.log('[seed] Homepage partners created')
  }

  const postsConfigCount = await HomepagePostsConfig.countDocuments()
  if (!postsConfigCount) {
    await HomepagePostsConfig.create({ key: 'posts', mode: 'auto', selectedIds: [], limit: 6 })
    console.log('[seed] HomepagePostsConfig created')
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export async function runSeed() {
  try {
    await connectDB()
    await seedAdmin()
    await seedCategories()
    await seedSettings()
    await seedFooter()
    await seedAbout()
    await seedContact()
    await seedHomepage()
    await seedPosts()
  } catch (err) {
    console.error('[seed] Failed:', err)
  }
}
