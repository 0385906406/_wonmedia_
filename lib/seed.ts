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

// ─── Admin ────────────────────────────────────────────────────────────────────

async function seedAdmin() {
  const exists = await User.findOne({ email: 'admin@wonmedia.com' })
  if (exists) return

  const seedPassword = process.env.SEED_ADMIN_PASSWORD ?? 'Admin@123456'
  if (!process.env.SEED_ADMIN_PASSWORD && process.env.NODE_ENV === 'production') {
    console.warn('[seed] ⚠️  SEED_ADMIN_PASSWORD env var không được set — đang dùng mật khẩu mặc định. Đặt env var này trước khi deploy production!')
  }
  const hashed = await bcrypt.hash(seedPassword, 12)
  await User.create({
    name: 'Super Admin',
    email: 'admin@wonmedia.com',
    password: hashed,
    role: 'superadmin',
  })
  // Không log credentials ra console — set SEED_ADMIN_PASSWORD trong .env để đổi password mặc định
  console.log('[seed] Super admin account created: admin@wonmedia.com')
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
<p>Gửi CV và portfolio về email: <strong>hr@wonmedia.com</strong></p>`,
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
<p>Send CV and portfolio to: <strong>hr@wonmedia.com</strong></p>`,
      ko: `<h2>채용: 음악 콘텐츠 크리에이터</h2>
<h3>지원 방법</h3>
<p>CV 및 포트폴리오를 이메일로 보내주세요: <strong>hr@wonmedia.com</strong></p>`,
      ja: `<h2>採用: 音楽コンテンツクリエイター</h2>
<h3>応募方法</h3>
<p>CVとポートフォリオをメールで送ってください: <strong>hr@wonmedia.com</strong></p>`,
      zh: `<h2>招聘：音乐内容创作者</h2>
<h3>申请方式</h3>
<p>请将简历和作品集发送至邮箱：<strong>hr@wonmedia.com</strong></p>`,
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
<p>Gửi CV về email: <strong>hr@wonmedia.com</strong><br/>Tiêu đề email: <em>[Digital Marketing Executive] – Họ và tên</em></p>`,
      en: `<h2>Recruitment: Digital Marketing Executive</h2>
<h3>Requirements</h3>
<ul>
  <li>Minimum 2 years of Digital Marketing experience</li>
  <li>Proficient in Facebook Ads, Google Ads, TikTok Ads</li>
  <li>Data analysis skills with Google Analytics, Meta Business Suite</li>
</ul>
<h3>How to Apply</h3>
<p>Send CV to: <strong>hr@wonmedia.com</strong></p>`,
      ko: `<h2>채용: 디지털 마케팅 임원</h2>
<h3>지원 방법</h3>
<p>이메일로 CV를 보내주세요: <strong>hr@wonmedia.com</strong></p>`,
      ja: `<h2>採用: デジタルマーケティングエグゼクティブ</h2>
<h3>応募方法</h3>
<p>CVをメールで送ってください: <strong>hr@wonmedia.com</strong></p>`,
      zh: `<h2>招聘：数字营销执行</h2>
<h3>申请方式</h3>
<p>请将简历发送至：<strong>hr@wonmedia.com</strong></p>`,
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
      vi: `<h2>Về vị trí</h2><p>Bạn sẽ trực tiếp sản xuất và quản lý nội dung trên các kênh truyền thông của WonMedia.</p><h2>Trách nhiệm chính</h2><ul><li>Lên ý tưởng và sản xuất nội dung hàng ngày cho Facebook, TikTok, YouTube, Instagram</li><li>Viết bài blog, tin tức âm nhạc, thông cáo báo chí</li><li>Theo dõi và phân tích hiệu quả nội dung</li></ul><h2>Yêu cầu</h2><ul><li>Ít nhất <strong>1 năm kinh nghiệm</strong> làm nội dung số</li><li>Đam mê âm nhạc và văn hóa giải trí</li></ul><h2>Quyền lợi</h2><ul><li>Lương: <strong>12 – 18 triệu VNĐ/tháng</strong> + thưởng KPI</li><li>BHXH, BHYT đầy đủ</li></ul><p>Gửi CV về: <strong>hr@wonmedia.com</strong></p>`,
      en: `<h2>About the role</h2><p>You will directly produce and manage content across WonMedia's media channels.</p><h2>Requirements</h2><ul><li>At least <strong>1 year of experience</strong> in digital content</li><li>Passion for music and entertainment culture</li></ul><p>Send CV to: <strong>hr@wonmedia.com</strong></p>`,
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
      vi: `<h2>Về vị trí</h2><p>WonMedia mở rộng đội ngũ sáng tạo, tìm Graphic Designer có khiếu thẩm mỹ cao.</p><h2>Trách nhiệm</h2><ul><li>Thiết kế cover album, single artwork cho nghệ sĩ</li><li>Tạo visual identity cho các chiến dịch âm nhạc</li><li>Thiết kế banner, poster, key visual sự kiện</li></ul><h2>Yêu cầu</h2><ul><li>Ít nhất <strong>2 năm kinh nghiệm</strong> thiết kế đồ họa</li><li>Thành thạo Adobe Photoshop, Illustrator, After Effects</li></ul><h2>Quyền lợi</h2><ul><li>Lương: <strong>15 – 25 triệu VNĐ/tháng</strong></li><li>Hybrid: 3 ngày văn phòng, 2 ngày remote</li></ul><p>Gửi CV về: <strong>hr@wonmedia.com</strong></p>`,
      en: `<h2>About the role</h2><p>WonMedia is expanding its creative team.</p><h2>Requirements</h2><ul><li>At least <strong>2 years of graphic design experience</strong></li><li>Proficient in Adobe Photoshop, Illustrator, After Effects</li></ul><p>Send CV to: <strong>hr@wonmedia.com</strong></p>`,
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
      vi: `<h2>Về vị trí</h2><p>Vị trí then chốt trong đội ngũ sản xuất nội dung của WonMedia.</p><h2>Trách nhiệm</h2><ul><li>Dựng phim MV, lyric video, official audio video cho nghệ sĩ</li><li>Tạo reels, short-form video cho TikTok, YouTube Shorts</li><li>Thực hiện color grading, motion graphics</li></ul><h2>Yêu cầu</h2><ul><li>Ít nhất <strong>2 năm kinh nghiệm</strong> dựng phim chuyên nghiệp</li><li>Thành thạo Adobe Premiere Pro, After Effects, DaVinci Resolve</li></ul><h2>Quyền lợi</h2><ul><li>Lương: <strong>18 – 28 triệu VNĐ/tháng</strong> + thưởng dự án</li></ul><p>Gửi CV về: <strong>hr@wonmedia.com</strong></p>`,
      en: `<h2>About the role</h2><p>Key position in WonMedia's content production team.</p><h2>Requirements</h2><ul><li>At least <strong>2 years of professional video editing experience</strong></li><li>Proficient in Adobe Premiere Pro, After Effects, DaVinci Resolve</li></ul><p>Send CV to: <strong>hr@wonmedia.com</strong></p>`,
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
      vi: `<h2>Về vị trí</h2><p>Vị trí <strong>100% remote</strong>, dẫn dắt chiến lược digital marketing cho danh mục nghệ sĩ của WonMedia.</p><h2>Trách nhiệm</h2><ul><li>Lên kế hoạch và thực thi chiến dịch marketing cho single/album mới</li><li>Quản lý Facebook Ads, Google Ads, TikTok Ads</li><li>Spotify editorial pitching, playlist promotion</li></ul><h2>Yêu cầu</h2><ul><li>Ít nhất <strong>2 năm kinh nghiệm digital marketing</strong></li><li>Hiểu biết sâu về các nền tảng âm nhạc số</li></ul><h2>Quyền lợi</h2><ul><li>Lương: <strong>15 – 22 triệu VNĐ/tháng</strong> + hoa hồng performance</li><li>100% remote — linh hoạt thời gian</li></ul><p>Gửi CV về: <strong>hr@wonmedia.com</strong></p>`,
      en: `<h2>About the role</h2><p><strong>100% remote</strong> position leading digital marketing strategies for WonMedia's artist portfolio.</p><h2>Requirements</h2><ul><li>At least <strong>2 years of digital marketing experience</strong></li><li>Deep understanding of digital music platforms</li></ul><p>Send CV to: <strong>hr@wonmedia.com</strong></p>`,
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
      vi: `<h2>Về vị trí</h2><p>Vị trí chiến lược — cầu nối giữa WonMedia và các đối tác nhãn hàng, nền tảng công nghệ, record labels quốc tế.</p><h2>Trách nhiệm</h2><ul><li>Tìm kiếm và ký kết hợp đồng với đối tác mới trong và ngoài nước</li><li>Đàm phán và xây dựng thỏa thuận hợp tác chiến lược</li></ul><h2>Yêu cầu</h2><ul><li>Ít nhất <strong>3 năm kinh nghiệm</strong> Business Development hoặc Sales B2B</li><li>Tiếng Anh thành thạo</li></ul><h2>Quyền lợi</h2><ul><li>Lương và bonus <strong>thỏa thuận theo năng lực</strong></li><li>Phúc lợi: BHXH, bảo hiểm sức khỏe cao cấp</li></ul><p>Gửi CV về: <strong>hr@wonmedia.com</strong></p>`,
      en: `<h2>About the role</h2><p>Strategic position bridging WonMedia and partners — brands, tech platforms, international record labels.</p><h2>Requirements</h2><ul><li>At least <strong>3 years of experience</strong> in Business Development or B2B Sales</li><li>Fluent English</li></ul><p>Send CV to: <strong>hr@wonmedia.com</strong></p>`,
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
      vi: `<h2>Về vị trí</h2><p>Trực tiếp quản lý các trang mạng xã hội của nghệ sĩ trong danh mục WonMedia.</p><h2>Trách nhiệm</h2><ul><li>Vận hành hàng ngày Facebook, TikTok, Instagram, YouTube của nghệ sĩ</li><li>Lên lịch và đăng nội dung theo content calendar</li><li>Tương tác với cộng đồng fan</li></ul><h2>Yêu cầu</h2><ul><li>Ít nhất <strong>1 năm kinh nghiệm</strong> quản lý mạng xã hội</li><li>Yêu âm nhạc, biết xu hướng giải trí hiện tại</li></ul><h2>Quyền lợi</h2><ul><li>Lương: <strong>10 – 15 triệu VNĐ/tháng</strong></li><li>Tham dự sự kiện âm nhạc, concert miễn phí</li></ul><p>Gửi CV về: <strong>hr@wonmedia.com</strong></p>`,
      en: `<h2>About the role</h2><p>Directly manage artists' social media pages in WonMedia's portfolio.</p><h2>Requirements</h2><ul><li>At least <strong>1 year of social media management experience</strong></li><li>Love for music and entertainment trends</li></ul><p>Send CV to: <strong>hr@wonmedia.com</strong></p>`,
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
      systemEmail: 'info@wonmedia.com',
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
  if (exists) return

  await FooterConfig.create({
    key: 'global',
    companyName: { vi: 'CÔNG TY TNHH WON MEDIA', en: 'WON MEDIA CO., LTD.', ko: '원미디어 주식회사', ja: 'ウォンメディア株式会社', zh: '旺传媒有限公司' },
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
    phoneLabel:      { vi: 'Điện thoại:', en: 'Phone:',   ko: '전화:',   ja: '電話:',   zh: '电话:' },
    emailLabel:      { vi: 'Email:',      en: 'Email:',   ko: '이메일:', ja: 'メール:', zh: '邮箱:' },
    legalRepLabel:   { vi: 'Người đại diện:', en: 'Legal Rep:', ko: '대표자:', ja: '代表者:', zh: '法人代表:' },
    copyright: {
      vi: '© 2025 WonMedia. Bảo lưu mọi quyền.',
      en: '© 2025 WonMedia. All rights reserved.',
      ko: '© 2025 WonMedia. 모든 권리 보유.',
      ja: '© 2025 WonMedia. All rights reserved.',
      zh: '© 2025 WonMedia. 保留所有权利。',
    },
  })
  console.log('[seed] Footer created')
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export async function runSeed() {
  try {
    await connectDB()
    await seedAdmin()
    await seedSettings()
    await seedFooter()
    await seedPosts()
  } catch (err) {
    console.error('[seed] Failed:', err)
  }
}
