import { config } from 'dotenv'
config({ path: '.env.local' })
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

const ML = { vi: String, en: String, ko: String, ja: String, zh: String }

const PostModel = mongoose.models.Post ||
  mongoose.model('Post', new mongoose.Schema({
    slug: { type: String, unique: true }, type: String, thumbnail: String,
    date: String, showOnHomepage: { type: Boolean, default: false },
    category: ML, title: ML, excerpt: ML, content: ML,
    active: { type: Boolean, default: true },
    urgent: { type: Boolean, default: false },
    deadline: { type: String, default: '' },
    jobType: { type: String, default: '' },
    location: { type: String, default: '' },
    salary: { type: String, default: '' },
  }, { timestamps: true }))

const JOBS = [
  // ── 1. Content Creator ──────────────────────────────────────────────────────
  {
    slug: 'tuyen-dung-content-creator-2025',
    type: 'tuyen-dung',
    thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=85&fit=crop',
    date: '01/06/2025',
    showOnHomepage: true,
    urgent: true,
    deadline: '2025-07-15',
    jobType: 'full-time',
    location: 'Hà Nội',
    salary: '12 – 18 triệu',
    category: { vi: 'Nội dung', en: 'Content', ko: '콘텐츠', ja: 'コンテンツ', zh: '内容' },
    title: {
      vi: 'Tuyển dụng Content Creator – Sáng tạo nội dung đa nền tảng',
      en: 'Content Creator – Multi-platform Content Creator',
      ko: '콘텐츠 크리에이터 채용 – 멀티 플랫폼 콘텐츠 제작',
      ja: 'コンテンツクリエイター募集 – マルチプラットフォームコンテンツ制作',
      zh: '招聘内容创作者 – 多平台内容创作',
    },
    excerpt: {
      vi: 'WonMedia tìm kiếm Content Creator sáng tạo, đam mê âm nhạc và giải trí, có khả năng sản xuất nội dung hấp dẫn cho Facebook, TikTok, YouTube và các nền tảng số khác.',
      en: 'WonMedia is looking for a creative Content Creator passionate about music and entertainment, capable of producing engaging content for Facebook, TikTok, YouTube and other digital platforms.',
      ko: 'WonMedia는 음악과 엔터테인먼트에 열정적이며 Facebook, TikTok, YouTube 및 기타 디지털 플랫폼을 위한 매력적인 콘텐츠를 제작할 수 있는 창의적인 콘텐츠 크리에이터를 찾고 있습니다.',
      ja: 'WonMediaは、音楽とエンターテインメントに情熱を持ち、Facebook、TikTok、YouTubeおよびその他のデジタルプラットフォーム向けの魅力的なコンテンツを制作できるクリエイティブなコンテンツクリエイターを探しています。',
      zh: 'WonMedia正在寻找对音乐和娱乐充满热情的创意内容创作者，能够为Facebook、TikTok、YouTube及其他数字平台制作引人入胜的内容。',
    },
    content: {
      vi: `<h2>Về vị trí</h2>
<p>Bạn sẽ là người trực tiếp sản xuất và quản lý nội dung trên các kênh truyền thông của WonMedia — từ bài viết, video short-form đến infographic và podcast. Đây là cơ hội tuyệt vời để làm việc trong môi trường âm nhạc và giải trí năng động.</p>

<h2>Trách nhiệm chính</h2>
<ul>
  <li>Lên ý tưởng và sản xuất nội dung hàng ngày cho Facebook, TikTok, YouTube, Instagram</li>
  <li>Viết bài blog, tin tức âm nhạc, thông cáo báo chí</li>
  <li>Phối hợp với team design và video để tạo nội dung đa phương tiện</li>
  <li>Theo dõi và phân tích hiệu quả nội dung, đề xuất cải tiến</li>
  <li>Hỗ trợ các chiến dịch ra mắt sản phẩm âm nhạc của nghệ sĩ</li>
</ul>

<h2>Yêu cầu</h2>
<ul>
  <li>Tốt nghiệp Đại học chuyên ngành Báo chí, Truyền thông, Marketing hoặc liên quan</li>
  <li>Ít nhất <strong>1 năm kinh nghiệm</strong> làm nội dung số</li>
  <li>Khả năng viết lách tốt, sáng tạo và có con mắt thẩm mỹ</li>
  <li>Am hiểu các nền tảng mạng xã hội và xu hướng nội dung hiện tại</li>
  <li>Đam mê âm nhạc và văn hóa giải trí là lợi thế lớn</li>
</ul>

<h2>Quyền lợi</h2>
<ul>
  <li>Lương cạnh tranh: <strong>12 – 18 triệu VNĐ/tháng</strong> + thưởng KPI</li>
  <li>Môi trường làm việc sáng tạo, trẻ trung, năng động</li>
  <li>Tiếp cận sự kiện âm nhạc, buổi ra mắt album độc quyền</li>
  <li>Đào tạo chuyên sâu về content marketing và digital media</li>
  <li>BHXH, BHYT, BHTN đầy đủ theo quy định</li>
</ul>

<h2>Hồ sơ ứng tuyển</h2>
<p>Gửi CV và portfolio về email: <strong>duongnv10504@gmail.com</strong><br>Tiêu đề email: <em>[Content Creator] Họ và tên</em></p>`,

      en: `<h2>About the role</h2>
<p>You will directly produce and manage content across WonMedia's media channels — from articles and short-form videos to infographics and podcasts. This is a great opportunity to work in a dynamic music and entertainment environment.</p>

<h2>Key responsibilities</h2>
<ul>
  <li>Ideate and produce daily content for Facebook, TikTok, YouTube, Instagram</li>
  <li>Write blog posts, music news, and press releases</li>
  <li>Collaborate with design and video teams to create multimedia content</li>
  <li>Track and analyze content performance and suggest improvements</li>
  <li>Support product launch campaigns for artists</li>
</ul>

<h2>Requirements</h2>
<ul>
  <li>Bachelor's degree in Journalism, Communications, Marketing or related fields</li>
  <li>At least <strong>1 year of experience</strong> in digital content</li>
  <li>Strong writing skills, creativity and aesthetic sense</li>
  <li>Familiar with social media platforms and current content trends</li>
  <li>Passion for music and entertainment culture is a big plus</li>
</ul>

<h2>Benefits</h2>
<ul>
  <li>Competitive salary: <strong>12 – 18 million VND/month</strong> + KPI bonus</li>
  <li>Creative, young and dynamic working environment</li>
  <li>Access to music events and exclusive album launches</li>
  <li>In-depth training in content marketing and digital media</li>
  <li>Full social insurance as per regulations</li>
</ul>`,
      ko: '', ja: '', zh: '',
    },
  },

  // ── 2. Graphic Designer ─────────────────────────────────────────────────────
  {
    slug: 'tuyen-dung-graphic-designer-2025',
    type: 'tuyen-dung',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=85&fit=crop',
    date: '03/06/2025',
    showOnHomepage: true,
    urgent: false,
    deadline: '2025-07-31',
    jobType: 'hybrid',
    location: 'TP. Hồ Chí Minh',
    salary: '15 – 25 triệu',
    category: { vi: 'Thiết kế', en: 'Design', ko: '디자인', ja: 'デザイン', zh: '设计' },
    title: {
      vi: 'Tuyển dụng Graphic Designer – Thiết kế sáng tạo cho ngành giải trí',
      en: 'Graphic Designer – Creative Design for Entertainment Industry',
      ko: '그래픽 디자이너 채용 – 엔터테인먼트 업계 창의적 디자인',
      ja: 'グラフィックデザイナー募集 – エンターテインメント業界のクリエイティブデザイン',
      zh: '招聘平面设计师 – 娱乐行业创意设计',
    },
    excerpt: {
      vi: 'Chúng tôi tìm kiếm Graphic Designer tài năng để tạo ra những sản phẩm trực quan ấn tượng — từ cover album, poster sự kiện đến bộ nhận diện thương hiệu nghệ sĩ.',
      en: 'We are looking for a talented Graphic Designer to create impressive visual products — from album covers and event posters to artist brand identity packages.',
      ko: '앨범 커버, 이벤트 포스터부터 아티스트 브랜드 아이덴티티까지 인상적인 시각적 결과물을 만들어낼 재능 있는 그래픽 디자이너를 찾고 있습니다.',
      ja: 'アルバムカバーやイベントポスターからアーティストブランドアイデンティティまで、印象的なビジュアル制作物を作成できる才能あるグラフィックデザイナーを探しています。',
      zh: '我们正在寻找才华横溢的平面设计师，创作令人印象深刻的视觉作品——从专辑封面、活动海报到艺人品牌形象。',
    },
    content: {
      vi: `<h2>Về vị trí</h2>
<p>WonMedia đang mở rộng đội ngũ sáng tạo và tìm kiếm một Graphic Designer có khiếu thẩm mỹ cao, hiểu biết về ngành âm nhạc và giải trí. Bạn sẽ thiết kế các sản phẩm đồ họa chất lượng cao phục vụ cho các chiến dịch marketing, phát hành album và sự kiện live.</p>

<h2>Trách nhiệm chính</h2>
<ul>
  <li>Thiết kế cover album, single artwork, lyric video thumbnail cho nghệ sĩ</li>
  <li>Tạo bộ visual identity cho các chiến dịch âm nhạc</li>
  <li>Thiết kế banner, poster, key visual cho sự kiện và concert</li>
  <li>Sản xuất nội dung đồ họa cho mạng xã hội (Stories, Reels, Posts)</li>
  <li>Đảm bảo tính nhất quán thương hiệu trên tất cả các kênh truyền thông</li>
</ul>

<h2>Yêu cầu</h2>
<ul>
  <li>Ít nhất <strong>2 năm kinh nghiệm</strong> thiết kế đồ họa</li>
  <li>Thành thạo Adobe Photoshop, Illustrator, After Effects</li>
  <li>Có portfolio ấn tượng với các dự án liên quan đến âm nhạc/giải trí là lợi thế</li>
  <li>Khả năng làm việc độc lập và theo nhóm, đáp ứng deadline</li>
  <li>Sáng tạo, có tư duy thẩm mỹ và theo kịp xu hướng design hiện đại</li>
</ul>

<h2>Quyền lợi</h2>
<ul>
  <li>Mức lương hấp dẫn: <strong>15 – 25 triệu VNĐ/tháng</strong></li>
  <li>Làm việc hybrid: 3 ngày văn phòng, 2 ngày remote</li>
  <li>Laptop và phần mềm thiết kế được cung cấp đầy đủ</li>
  <li>Thưởng dự án theo hiệu quả công việc</li>
  <li>Cơ hội phát triển sự nghiệp trong môi trường sáng tạo quốc tế</li>
</ul>`,

      en: `<h2>About the role</h2>
<p>WonMedia is expanding its creative team and looking for a Graphic Designer with strong aesthetic sense and understanding of the music and entertainment industry. You will design high-quality graphic products for marketing campaigns, album releases and live events.</p>

<h2>Key responsibilities</h2>
<ul>
  <li>Design album covers, single artwork, lyric video thumbnails for artists</li>
  <li>Create visual identity packages for music campaigns</li>
  <li>Design banners, posters, key visuals for events and concerts</li>
  <li>Produce graphic content for social media</li>
  <li>Ensure brand consistency across all media channels</li>
</ul>

<h2>Requirements</h2>
<ul>
  <li>At least <strong>2 years of graphic design experience</strong></li>
  <li>Proficient in Adobe Photoshop, Illustrator, After Effects</li>
  <li>Impressive portfolio with music/entertainment-related projects is a plus</li>
  <li>Ability to work independently and in teams, meet deadlines</li>
</ul>`,
      ko: '', ja: '', zh: '',
    },
  },

  // ── 3. Video Editor ──────────────────────────────────────────────────────────
  {
    slug: 'tuyen-dung-video-editor-2025',
    type: 'tuyen-dung',
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=85&fit=crop',
    date: '04/06/2025',
    showOnHomepage: false,
    urgent: true,
    deadline: '2025-06-30',
    jobType: 'full-time',
    location: 'Hà Nội',
    salary: '18 – 28 triệu',
    category: { vi: 'Kỹ thuật', en: 'Production', ko: '프로덕션', ja: 'プロダクション', zh: '制作' },
    title: {
      vi: 'Tuyển dụng Video Editor – Dựng phim MV & nội dung âm nhạc',
      en: 'Video Editor – MV & Music Content Production',
      ko: '비디오 에디터 채용 – MV 및 음악 콘텐츠 제작',
      ja: 'ビデオエディター募集 – MVと音楽コンテンツ制作',
      zh: '招聘视频剪辑师 – MV及音乐内容制作',
    },
    excerpt: {
      vi: 'WonMedia cần Video Editor kinh nghiệm để dựng MV, lyric video, behind-the-scenes và các nội dung video ngắn cho mạng xã hội. Ưu tiên ứng viên có kinh nghiệm trong ngành âm nhạc.',
      en: 'WonMedia needs an experienced Video Editor to edit MVs, lyric videos, behind-the-scenes content and short video content for social media. Priority given to candidates with music industry experience.',
      ko: 'WonMedia는 MV, 가사 비디오, 비하인드 씬 및 소셜 미디어용 단편 비디오 콘텐츠를 편집할 경험 있는 비디오 에디터가 필요합니다. 음악 업계 경험자 우대.',
      ja: 'WonMediaはMV、歌詞動画、舞台裏コンテンツ、ソーシャルメディア向けショート動画コンテンツを編集できる経験豊富なビデオエディターを必要としています。',
      zh: 'WonMedia需要有经验的视频剪辑师来剪辑MV、歌词视频、幕后内容及社交媒体短视频。优先考虑有音乐行业经验的候选人。',
    },
    content: {
      vi: `<h2>Về vị trí</h2>
<p>Đây là vị trí then chốt trong đội ngũ sản xuất nội dung của WonMedia. Bạn sẽ chịu trách nhiệm dựng và hậu kỳ cho các sản phẩm âm nhạc — từ MV chuyên nghiệp đến nội dung viral trên TikTok và YouTube Shorts.</p>

<h2>Trách nhiệm chính</h2>
<ul>
  <li>Dựng phim MV, lyric video và official audio video cho nghệ sĩ</li>
  <li>Biên tập và cắt ghép nội dung behind-the-scenes, vlog của nghệ sĩ</li>
  <li>Tạo reels, short-form video tối ưu cho TikTok, YouTube Shorts, Instagram</li>
  <li>Thực hiện color grading, motion graphics và hiệu ứng hình ảnh</li>
  <li>Phối hợp với đạo diễn và nhiếp ảnh gia trong các buổi quay</li>
</ul>

<h2>Yêu cầu</h2>
<ul>
  <li>Ít nhất <strong>2 năm kinh nghiệm</strong> dựng phim chuyên nghiệp</li>
  <li>Thành thạo Adobe Premiere Pro, After Effects, DaVinci Resolve</li>
  <li>Hiểu biết về âm nhạc, có khả năng sync hình ảnh với nhịp điệu</li>
  <li>Portfolio MV hoặc video âm nhạc ấn tượng là lợi thế lớn</li>
  <li>Làm việc tốt dưới áp lực và deadline chặt</li>
</ul>

<h2>Quyền lợi</h2>
<ul>
  <li>Lương hấp dẫn: <strong>18 – 28 triệu VNĐ/tháng</strong> + thưởng dự án</li>
  <li>Trang bị máy tính hiệu năng cao, màn hình 4K và phần mềm bản quyền</li>
  <li>Làm việc trực tiếp với nghệ sĩ nổi tiếng và các production house</li>
  <li>Cơ hội tham gia các buổi quay MV, concert chuyên nghiệp</li>
  <li>Môi trường sáng tạo, không gian làm việc hiện đại</li>
</ul>`,

      en: `<h2>About the role</h2>
<p>This is a key position in WonMedia's content production team. You will be responsible for editing and post-production for music products — from professional MVs to viral content on TikTok and YouTube Shorts.</p>

<h2>Key responsibilities</h2>
<ul>
  <li>Edit MVs, lyric videos and official audio videos for artists</li>
  <li>Edit and cut behind-the-scenes content and artist vlogs</li>
  <li>Create reels and short-form videos for TikTok, YouTube Shorts, Instagram</li>
  <li>Perform color grading, motion graphics and visual effects</li>
</ul>

<h2>Requirements</h2>
<ul>
  <li>At least <strong>2 years of professional video editing experience</strong></li>
  <li>Proficient in Adobe Premiere Pro, After Effects, DaVinci Resolve</li>
  <li>Understanding of music, ability to sync visuals with rhythm</li>
  <li>Impressive MV or music video portfolio is a big plus</li>
</ul>`,
      ko: '', ja: '', zh: '',
    },
  },

  // ── 4. Digital Marketing Specialist ─────────────────────────────────────────
  {
    slug: 'tuyen-dung-digital-marketing-specialist-2025',
    type: 'tuyen-dung',
    thumbnail: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=1200&q=85&fit=crop',
    date: '05/06/2025',
    showOnHomepage: true,
    urgent: false,
    deadline: '2025-08-15',
    jobType: 'remote',
    location: 'Remote toàn quốc',
    salary: '15 – 22 triệu',
    category: { vi: 'Marketing', en: 'Marketing', ko: '마케팅', ja: 'マーケティング', zh: '营销' },
    title: {
      vi: 'Tuyển dụng Digital Marketing Specialist – Làm việc Remote',
      en: 'Digital Marketing Specialist – Remote Work',
      ko: '디지털 마케팅 스페셜리스트 채용 – 원격 근무',
      ja: 'デジタルマーケティングスペシャリスト募集 – リモートワーク',
      zh: '招聘数字营销专员 – 远程工作',
    },
    excerpt: {
      vi: 'WonMedia tìm kiếm Digital Marketing Specialist làm việc remote, phụ trách các chiến dịch quảng bá âm nhạc, tăng trưởng lượng người nghe và xây dựng cộng đồng fan trực tuyến.',
      en: 'WonMedia is looking for a Digital Marketing Specialist to work remotely, responsible for music promotion campaigns, growing listener counts and building online fan communities.',
      ko: 'WonMedia는 음악 홍보 캠페인, 청취자 수 증가 및 온라인 팬 커뮤니티 구축을 담당할 원격 근무 디지털 마케팅 스페셜리스트를 찾고 있습니다.',
      ja: 'WonMediaは、音楽プロモーションキャンペーン、リスナー数の増加、オンラインファンコミュニティの構築を担当するリモートワークのデジタルマーケティングスペシャリストを探しています。',
      zh: 'WonMedia正在寻找远程工作的数字营销专员，负责音乐推广活动、增加听众数量和建立在线粉丝社区。',
    },
    content: {
      vi: `<h2>Về vị trí</h2>
<p>Bạn sẽ là người dẫn dắt các chiến lược digital marketing cho danh mục nghệ sĩ của WonMedia — từ Spotify pitching, playlist outreach đến quảng cáo paid media trên các nền tảng số. Đây là vị trí <strong>100% remote</strong>, phù hợp với người có kỷ luật làm việc và kỹ năng tự quản lý tốt.</p>

<h2>Trách nhiệm chính</h2>
<ul>
  <li>Lên kế hoạch và thực thi chiến dịch marketing cho các single/album mới</li>
  <li>Quản lý và tối ưu quảng cáo Facebook Ads, Google Ads, TikTok Ads</li>
  <li>Thực hiện Spotify editorial pitching, playlist promotion</li>
  <li>Theo dõi và báo cáo KPI: streams, saves, followers, engagement rate</li>
  <li>Nghiên cứu xu hướng âm nhạc và đối thủ cạnh tranh</li>
  <li>Xây dựng chiến lược fan community và CRM cho nghệ sĩ</li>
</ul>

<h2>Yêu cầu</h2>
<ul>
  <li>Ít nhất <strong>2 năm kinh nghiệm digital marketing</strong></li>
  <li>Hiểu biết sâu về các nền tảng âm nhạc số (Spotify, Apple Music, YouTube Music)</li>
  <li>Kinh nghiệm chạy paid ads đạt ROAS tốt</li>
  <li>Kỹ năng phân tích data, sử dụng Google Analytics, Spotify for Artists</li>
  <li>Tự chủ trong công việc, không cần giám sát chặt chẽ</li>
</ul>

<h2>Quyền lợi</h2>
<ul>
  <li>Lương: <strong>15 – 22 triệu VNĐ/tháng</strong> + hoa hồng performance</li>
  <li>Làm việc <strong>100% remote</strong> — linh hoạt thời gian và địa điểm</li>
  <li>Hỗ trợ mua thiết bị làm việc và phần mềm</li>
  <li>Được tiếp cận và học hỏi từ các chuyên gia âm nhạc hàng đầu</li>
  <li>Cơ hội thăng tiến lên Senior / Head of Marketing</li>
</ul>`,

      en: `<h2>About the role</h2>
<p>You will lead digital marketing strategies for WonMedia's artist portfolio — from Spotify pitching and playlist outreach to paid media advertising on digital platforms. This is a <strong>100% remote</strong> position, ideal for someone with strong self-discipline and self-management skills.</p>

<h2>Key responsibilities</h2>
<ul>
  <li>Plan and execute marketing campaigns for new singles/albums</li>
  <li>Manage and optimize Facebook Ads, Google Ads, TikTok Ads</li>
  <li>Handle Spotify editorial pitching and playlist promotion</li>
  <li>Track and report KPIs: streams, saves, followers, engagement rate</li>
</ul>

<h2>Requirements</h2>
<ul>
  <li>At least <strong>2 years of digital marketing experience</strong></li>
  <li>Deep understanding of digital music platforms</li>
  <li>Experience running paid ads with strong ROAS</li>
  <li>Self-directed, able to work without close supervision</li>
</ul>`,
      ko: '', ja: '', zh: '',
    },
  },

  // ── 5. Business Development ──────────────────────────────────────────────────
  {
    slug: 'tuyen-dung-business-development-manager-2025',
    type: 'tuyen-dung',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=85&fit=crop',
    date: '05/06/2025',
    showOnHomepage: false,
    urgent: false,
    deadline: '2025-08-31',
    jobType: 'full-time',
    location: 'Hà Nội hoặc TP.HCM',
    salary: 'Thỏa thuận',
    category: { vi: 'Kinh doanh', en: 'Business', ko: '비즈니스', ja: 'ビジネス', zh: '商业' },
    title: {
      vi: 'Tuyển dụng Business Development Manager – Phát triển đối tác âm nhạc',
      en: 'Business Development Manager – Music Partnership Development',
      ko: '비즈니스 개발 매니저 채용 – 음악 파트너십 개발',
      ja: 'ビジネスデベロップメントマネージャー募集 – 音楽パートナーシップ開発',
      zh: '招聘商务拓展经理 – 音乐合作伙伴开发',
    },
    excerpt: {
      vi: 'WonMedia tìm kiếm Business Development Manager giàu kinh nghiệm để xây dựng và mở rộng mạng lưới đối tác trong ngành âm nhạc, giải trí và công nghệ tại Việt Nam và khu vực.',
      en: 'WonMedia is looking for an experienced Business Development Manager to build and expand its partner network in the music, entertainment and technology industries in Vietnam and the region.',
      ko: 'WonMedia는 베트남과 지역 내 음악, 엔터테인먼트, 기술 업계에서 파트너 네트워크를 구축하고 확장할 경험 있는 비즈니스 개발 매니저를 찾고 있습니다.',
      ja: 'WonMediaは、ベトナムおよびその地域の音楽、エンターテインメント、テクノロジー業界でパートナーネットワークを構築・拡大する経験豊富なビジネスデベロップメントマネージャーを探しています。',
      zh: 'WonMedia正在寻找有经验的商务拓展经理，在越南及地区建立和扩大音乐、娱乐和科技行业的合作伙伴网络。',
    },
    content: {
      vi: `<h2>Về vị trí</h2>
<p>Đây là vị trí chiến lược tại WonMedia, nơi bạn sẽ đóng vai trò cầu nối giữa công ty và các đối tác — nhãn hàng, nền tảng công nghệ, đơn vị tổ chức sự kiện, record labels quốc tế và các cơ quan truyền thông. Bạn sẽ trực tiếp tham gia vào việc mở rộng hệ sinh thái âm nhạc và giải trí của WonMedia.</p>

<h2>Trách nhiệm chính</h2>
<ul>
  <li>Tìm kiếm, tiếp cận và ký kết hợp đồng với đối tác mới trong và ngoài nước</li>
  <li>Duy trì và phát triển quan hệ với các đối tác hiện có</li>
  <li>Đàm phán và xây dựng các thỏa thuận hợp tác chiến lược</li>
  <li>Phân tích thị trường, xác định cơ hội kinh doanh mới</li>
  <li>Phối hợp với các bộ phận nội bộ để đảm bảo triển khai hợp đồng hiệu quả</li>
  <li>Tham dự các hội nghị, triển lãm ngành âm nhạc và giải trí trong và ngoài nước</li>
</ul>

<h2>Yêu cầu</h2>
<ul>
  <li>Ít nhất <strong>3 năm kinh nghiệm</strong> trong Business Development hoặc Sales B2B</li>
  <li>Có mạng lưới quan hệ rộng trong ngành âm nhạc, giải trí hoặc công nghệ</li>
  <li>Kỹ năng đàm phán và thuyết trình xuất sắc</li>
  <li>Tiếng Anh thành thạo, giao tiếp được tiếng Hàn là lợi thế</li>
  <li>Sẵn sàng đi công tác trong nước và quốc tế</li>
</ul>

<h2>Quyền lợi</h2>
<ul>
  <li>Mức lương và bonus hấp dẫn — <strong>thỏa thuận theo năng lực</strong></li>
  <li>Cơ hội làm việc với các đối tác và nghệ sĩ quốc tế hàng đầu</li>
  <li>Được tham dự các hội nghị âm nhạc quốc tế (SXSW, MIDEM, Music Mantra...)</li>
  <li>Môi trường làm việc chuyên nghiệp, cơ hội thăng tiến rõ ràng</li>
  <li>Phúc lợi đầy đủ: BHXH, bảo hiểm sức khỏe cao cấp, xe công ty</li>
</ul>`,

      en: `<h2>About the role</h2>
<p>This is a strategic position at WonMedia where you will serve as a bridge between the company and partners — brands, technology platforms, event organizers, international record labels and media agencies. You will directly participate in expanding WonMedia's music and entertainment ecosystem.</p>

<h2>Key responsibilities</h2>
<ul>
  <li>Identify, approach and sign contracts with new domestic and international partners</li>
  <li>Maintain and develop relationships with existing partners</li>
  <li>Negotiate and build strategic partnership agreements</li>
  <li>Analyze markets and identify new business opportunities</li>
</ul>

<h2>Requirements</h2>
<ul>
  <li>At least <strong>3 years of experience</strong> in Business Development or B2B Sales</li>
  <li>Wide network in music, entertainment or technology industries</li>
  <li>Excellent negotiation and presentation skills</li>
  <li>Fluent English; Korean communication skills are a plus</li>
</ul>`,
      ko: '', ja: '', zh: '',
    },
  },

  // ── 6. Social Media Executive ────────────────────────────────────────────────
  {
    slug: 'tuyen-dung-social-media-executive-2025',
    type: 'tuyen-dung',
    thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200&q=85&fit=crop',
    date: '06/06/2025',
    showOnHomepage: true,
    urgent: false,
    deadline: '2025-07-20',
    jobType: 'full-time',
    location: 'TP. Hồ Chí Minh',
    salary: '10 – 15 triệu',
    category: { vi: 'Truyền thông', en: 'Media', ko: '미디어', ja: 'メディア', zh: '媒体' },
    title: {
      vi: 'Tuyển dụng Social Media Executive – Quản lý kênh nghệ sĩ',
      en: 'Social Media Executive – Artist Channel Management',
      ko: '소셜 미디어 전문가 채용 – 아티스트 채널 관리',
      ja: 'ソーシャルメディアエグゼクティブ募集 – アーティストチャンネル管理',
      zh: '招聘社交媒体专员 – 艺人频道管理',
    },
    excerpt: {
      vi: 'Bạn đam mê mạng xã hội và yêu âm nhạc? WonMedia cần một Social Media Executive để vận hành và phát triển các kênh Facebook, TikTok, Instagram cho nghệ sĩ trong danh mục của chúng tôi.',
      en: 'Are you passionate about social media and love music? WonMedia needs a Social Media Executive to operate and grow Facebook, TikTok and Instagram channels for artists in our portfolio.',
      ko: '소셜 미디어와 음악을 사랑하시나요? WonMedia는 우리 포트폴리오의 아티스트를 위해 Facebook, TikTok, Instagram 채널을 운영하고 성장시킬 소셜 미디어 전문가가 필요합니다.',
      ja: 'ソーシャルメディアと音楽が好きですか？WonMediaは、私たちのポートフォリオのアーティストのFacebook、TikTok、InstagramチャンネルをNaN運営・成長させるソーシャルメディアエグゼクティブを必要としています。',
      zh: '您热衷于社交媒体并热爱音乐吗？WonMedia需要一名社交媒体专员来运营和发展我们旗下艺人的Facebook、TikTok、Instagram频道。',
    },
    content: {
      vi: `<h2>Về vị trí</h2>
<p>Social Media Executive tại WonMedia sẽ trực tiếp quản lý các trang mạng xã hội của nghệ sĩ — từ lên lịch đăng bài, tương tác với fan đến phân tích hiệu quả và đề xuất chiến lược tăng trưởng. Đây là cơ hội làm việc gần gũi với các nghệ sĩ và thương hiệu âm nhạc hàng đầu.</p>

<h2>Trách nhiệm chính</h2>
<ul>
  <li>Vận hành hàng ngày các trang Facebook, TikTok, Instagram, YouTube của nghệ sĩ</li>
  <li>Lên lịch và đăng nội dung, stories, reels theo kế hoạch content calendar</li>
  <li>Tương tác với cộng đồng fan, xử lý bình luận và tin nhắn</li>
  <li>Theo dõi số liệu và báo cáo weekly/monthly performance</li>
  <li>Theo dõi trends, đề xuất ý tưởng nội dung viral</li>
  <li>Hỗ trợ nghệ sĩ trong các livestream, Q&A session</li>
</ul>

<h2>Yêu cầu</h2>
<ul>
  <li>Ít nhất <strong>1 năm kinh nghiệm</strong> quản lý mạng xã hội</li>
  <li>Am hiểu các thuật toán và best practices của Facebook, TikTok, Instagram</li>
  <li>Kỹ năng viết caption hấp dẫn, có khả năng copywriting tốt</li>
  <li>Yêu âm nhạc, biết các nghệ sĩ Việt và xu hướng giải trí hiện tại</li>
  <li>Linh hoạt về giờ giấc (có thể làm việc buổi tối/cuối tuần khi có sự kiện)</li>
</ul>

<h2>Quyền lợi</h2>
<ul>
  <li>Lương: <strong>10 – 15 triệu VNĐ/tháng</strong></li>
  <li>Làm việc trực tiếp với các nghệ sĩ nổi tiếng</li>
  <li>Tham dự các sự kiện âm nhạc, lễ trao giải, concert miễn phí</li>
  <li>Môi trường làm việc trẻ trung, sáng tạo, nhiều cơ hội học hỏi</li>
  <li>Roadmap phát triển lên Senior Social Media Manager</li>
</ul>`,

      en: `<h2>About the role</h2>
<p>The Social Media Executive at WonMedia will directly manage artists' social media pages — from scheduling posts and engaging with fans to analyzing performance and proposing growth strategies.</p>

<h2>Key responsibilities</h2>
<ul>
  <li>Daily operation of artists' Facebook, TikTok, Instagram, YouTube pages</li>
  <li>Schedule and post content according to content calendar</li>
  <li>Engage with fan community, handle comments and messages</li>
  <li>Track metrics and report weekly/monthly performance</li>
</ul>

<h2>Requirements</h2>
<ul>
  <li>At least <strong>1 year of social media management experience</strong></li>
  <li>Understanding of Facebook, TikTok, Instagram algorithms and best practices</li>
  <li>Strong copywriting skills for engaging captions</li>
  <li>Love for music and knowledge of Vietnamese artists and entertainment trends</li>
</ul>`,
      ko: '', ja: '', zh: '',
    },
  },
]

async function run() {
  await mongoose.connect(MONGODB_URI)
  console.log('[seed-tuyen-dung] Connected to MongoDB')

  let created = 0
  let skipped = 0

  for (const job of JOBS) {
    const exists = await PostModel.findOne({ slug: job.slug })
    if (exists) {
      console.log(`[skip] ${job.slug}`)
      skipped++
      continue
    }
    await PostModel.create({ ...job, active: true })
    console.log(`[created] ${job.slug}`)
    created++
  }

  console.log(`\n✓ Done — ${created} tạo mới, ${skipped} đã tồn tại`)
  await mongoose.disconnect()
}

run().catch(e => { console.error(e); process.exit(1) })
