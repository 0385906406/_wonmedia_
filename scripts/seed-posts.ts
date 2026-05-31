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
  }, { timestamps: true }))

// ─── Blog posts ───────────────────────────────────────────────────────────────
const BLOG_POSTS = [
  {
    slug: 'won-media-ra-mat-dich-vu-phat-hanh-am-nhac-quoc-te-2025',
    type: 'blog',
    thumbnail: '',
    date: '15/05/2025',
    showOnHomepage: true,
    category: {
      vi: 'Tin tức', en: 'News', ko: '뉴스', ja: 'ニュース', zh: '新闻',
    },
    title: {
      vi: 'WON Media ra mắt dịch vụ phát hành âm nhạc quốc tế 2025',
      en: 'WON Media Launches International Music Distribution Service 2025',
      ko: 'WON Media, 2025년 국제 음악 배급 서비스 출시',
      ja: 'WON Media、2025年に国際音楽配信サービスを開始',
      zh: 'WON Media推出2025年国际音乐发行服务',
    },
    excerpt: {
      vi: 'WON Media chính thức ra mắt dịch vụ phát hành âm nhạc quốc tế, giúp các nghệ sĩ Việt Nam tiếp cận thị trường toàn cầu trên hơn 150 nền tảng streaming.',
      en: 'WON Media officially launches its international music distribution service, helping Vietnamese artists reach global markets on over 150 streaming platforms.',
      ko: 'WON Media가 공식적으로 국제 음악 배급 서비스를 출시하여 베트남 아티스트들이 150개 이상의 스트리밍 플랫폼에서 글로벌 시장에 진출할 수 있도록 지원합니다.',
      ja: 'WON Mediaが国際音楽配信サービスを正式に開始し、ベトナムのアーティストが150以上のストリーミングプラットフォームでグローバル市場にアクセスできるよう支援します。',
      zh: 'WON Media正式推出国际音乐发行服务，帮助越南艺术家在150多个流媒体平台上进入全球市场。',
    },
    content: {
      vi: `<p>WON Media – đơn vị hàng đầu trong lĩnh vực quản lý nội dung số và phát hành âm nhạc tại Việt Nam – vừa chính thức công bố ra mắt gói dịch vụ <strong>phát hành âm nhạc quốc tế 2025</strong>, đánh dấu bước tiến quan trọng trong chiến lược mở rộng toàn cầu.</p>

<h2>Điểm nổi bật của dịch vụ</h2>
<p>Gói dịch vụ mới cho phép các nghệ sĩ, nhạc sĩ và đơn vị sản xuất âm nhạc phân phối tác phẩm tới hơn <strong>150 nền tảng streaming</strong> toàn cầu bao gồm Spotify, Apple Music, YouTube Music, Amazon Music, Deezer và nhiều nền tảng khác.</p>

<ul>
  <li>Phát hành nhanh chóng trong vòng <strong>48–72 giờ</strong></li>
  <li>Báo cáo doanh thu minh bạch theo thời gian thực</li>
  <li>Hỗ trợ quản lý bản quyền tác giả toàn diện</li>
  <li>Đội ngũ hỗ trợ song ngữ Việt – Anh 24/7</li>
</ul>

<h2>Phát biểu từ lãnh đạo</h2>
<blockquote>
  "Chúng tôi hiểu rằng âm nhạc Việt Nam có đủ chất lượng để chinh phục thị trường quốc tế. Dịch vụ mới này là cầu nối giúp các nghệ sĩ Việt Nam vươn ra thế giới một cách chuyên nghiệp và bền vững."
</blockquote>

<p>Để đăng ký sử dụng dịch vụ hoặc tìm hiểu thêm, vui lòng liên hệ trực tiếp đội ngũ WON Media qua email hoặc hotline.</p>`,

      en: `<p>WON Media – Vietnam's leading digital content management and music distribution company – has officially announced the launch of its <strong>International Music Distribution Package 2025</strong>, marking an important milestone in its global expansion strategy.</p>

<h2>Service Highlights</h2>
<p>The new package allows artists, songwriters, and music production companies to distribute their work to over <strong>150 global streaming platforms</strong> including Spotify, Apple Music, YouTube Music, Amazon Music, Deezer, and many others.</p>

<ul>
  <li>Fast release within <strong>48–72 hours</strong></li>
  <li>Transparent real-time revenue reporting</li>
  <li>Comprehensive copyright management support</li>
  <li>Bilingual Vietnamese–English support team 24/7</li>
</ul>

<blockquote>
  "We believe Vietnamese music has the quality to conquer international markets. This new service is the bridge that helps Vietnamese artists reach the world professionally and sustainably."
</blockquote>`,

      ko: '', ja: '', zh: '',
    },
  },
  {
    slug: 'won-media-dat-moc-100-nut-bac-youtube-2025',
    type: 'blog',
    thumbnail: '',
    date: '02/04/2025',
    showOnHomepage: true,
    category: {
      vi: 'Thành tựu', en: 'Achievement', ko: '성과', ja: '実績', zh: '成就',
    },
    title: {
      vi: 'WON Media đạt mốc 100 Nút Bạc YouTube trong năm 2025',
      en: 'WON Media Reaches 100 YouTube Silver Play Buttons in 2025',
      ko: 'WON Media, 2025년에 YouTube 실버 플레이 버튼 100개 달성',
      ja: 'WON Media、2025年にYouTubeシルバーボタン100個達成',
      zh: 'WON Media在2025年达成100个YouTube银牌播放按钮',
    },
    excerpt: {
      vi: 'Với hơn 100 Nút Bạc YouTube, WON Media khẳng định vị thế là đơn vị MCN hàng đầu Việt Nam về số lượng kênh đạt chuẩn quốc tế.',
      en: 'With over 100 YouTube Silver Play Buttons, WON Media affirms its position as Vietnam\'s leading MCN in terms of internationally certified channels.',
      ko: '100개 이상의 YouTube 실버 플레이 버튼을 통해 WON Media는 국제 인증 채널 수에서 베트남 최고의 MCN으로서의 위치를 확고히 합니다.',
      ja: '100個以上のYouTubeシルバーボタンにより、WON Mediaは国際認定チャンネル数においてベトナムトップのMCNとしての地位を確立しました。',
      zh: '凭借100多个YouTube银牌播放按钮，WON Media在国际认证频道数量方面确立了越南领先MCN的地位。',
    },
    content: {
      vi: `<p>Trong quý I năm 2025, WON Media đã chính thức vượt mốc <strong>100 kênh YouTube đạt Nút Bạc</strong> – một thành tích chưa từng có trong lịch sử của công ty và là cột mốc quan trọng khẳng định vị thế dẫn đầu trong ngành MCN tại Việt Nam.</p>

<h2>Hành trình 3 năm</h2>
<p>Từ những ngày đầu thành lập vào năm 2023 với chưa đến 10 kênh đối tác, WON Media đã không ngừng mở rộng hệ sinh thái nội dung số. Chỉ sau 2 năm hoạt động, con số này đã tăng trưởng gấp hơn 10 lần.</p>

<h2>Các lĩnh vực nội dung</h2>
<ul>
  <li><strong>Âm nhạc:</strong> Kênh ca sĩ, nhạc sĩ, ban nhạc độc lập</li>
  <li><strong>Giải trí:</strong> Vlog, review, lifestyle</li>
  <li><strong>Giáo dục:</strong> Kênh học tiếng Anh, kỹ năng sống</li>
  <li><strong>Thiếu nhi:</strong> Nội dung an toàn cho trẻ em</li>
</ul>

<p>Với đà tăng trưởng này, WON Media đặt mục tiêu đạt <strong>50 Nút Vàng</strong> vào cuối năm 2025.</p>`,
      en: `<p>In Q1 2025, WON Media officially surpassed the milestone of <strong>100 YouTube Silver Play Button channels</strong> – an unprecedented achievement in the company's history and an important milestone confirming its leading position in Vietnam's MCN industry.</p>

<h2>A 3-Year Journey</h2>
<p>From its founding days in 2023 with fewer than 10 partner channels, WON Media has continuously expanded its digital content ecosystem. In just 2 years of operation, this number has grown more than tenfold.</p>

<blockquote>
  "This milestone belongs to each creator who trusted WON Media as their companion on the journey of digital content."
</blockquote>`,
      ko: '', ja: '', zh: '',
    },
  },
  {
    slug: 'hop-tac-chien-luoc-won-media-va-spotify-viet-nam-2025',
    type: 'blog',
    thumbnail: '',
    date: '18/03/2025',
    showOnHomepage: true,
    category: {
      vi: 'Đối tác', en: 'Partnership', ko: '파트너십', ja: 'パートナーシップ', zh: '合作',
    },
    title: {
      vi: 'WON Media và Spotify Việt Nam ký kết hợp tác chiến lược',
      en: 'WON Media and Spotify Vietnam Sign Strategic Partnership',
      ko: 'WON Media와 Spotify 베트남, 전략적 파트너십 체결',
      ja: 'WON MediaとSpotifyベトナムが戦略的パートナーシップを締結',
      zh: 'WON Media与Spotify越南签署战略合作协议',
    },
    excerpt: {
      vi: 'Thỏa thuận hợp tác chiến lược giúp các nghệ sĩ trong hệ sinh thái WON Media được hưởng nhiều ưu đãi đặc biệt trên nền tảng Spotify.',
      en: 'The strategic partnership agreement allows artists in the WON Media ecosystem to enjoy special privileges on the Spotify platform.',
      ko: '전략적 파트너십 계약을 통해 WON Media 생태계의 아티스트들이 Spotify 플랫폼에서 특별 혜택을 누릴 수 있게 되었습니다.',
      ja: '戦略的パートナーシップ契約により、WON MediaエコシステムのアーティストがSpotifyプラットフォームで特別な特典を享受できるようになります。',
      zh: '战略合作协议使WON Media生态系统中的艺术家能够在Spotify平台上享受特殊优惠。',
    },
    content: {
      vi: `<p>Ngày 18/03/2025, WON Media và Spotify Việt Nam chính thức ký kết <strong>Thỏa thuận Hợp tác Chiến lược</strong>, mở ra cơ hội mới cho hàng trăm nghệ sĩ trong hệ sinh thái WON Media.</p>

<h2>Nội dung hợp tác</h2>
<p>Theo thỏa thuận, hai bên sẽ phối hợp trong các lĩnh vực:</p>
<ul>
  <li>Ưu tiên đề xuất (playlist pitching) cho nhạc phẩm mới của nghệ sĩ WON Media</li>
  <li>Hỗ trợ tạo nội dung độc quyền cho Spotify Canvas và Podcast</li>
  <li>Chia sẻ dữ liệu analytics để tối ưu chiến lược phát hành</li>
  <li>Tổ chức sự kiện âm nhạc trực tiếp (live sessions) trên Spotify Live</li>
</ul>

<h2>Lợi ích cho nghệ sĩ</h2>
<p>Các nghệ sĩ trong hệ sinh thái WON Media sẽ được hưởng mức chia sẻ doanh thu ưu đãi và được tiếp cận với <strong>đội ngũ chuyên gia marketing âm nhạc</strong> của Spotify tại khu vực Đông Nam Á.</p>`,
      en: `<p>On March 18, 2025, WON Media and Spotify Vietnam officially signed a <strong>Strategic Cooperation Agreement</strong>, opening new opportunities for hundreds of artists in the WON Media ecosystem.</p>

<h2>Cooperation Content</h2>
<ul>
  <li>Priority playlist pitching for new releases from WON Media artists</li>
  <li>Support for creating exclusive content for Spotify Canvas and Podcasts</li>
  <li>Analytics data sharing to optimize release strategies</li>
  <li>Organization of live sessions on Spotify Live</li>
</ul>`,
      ko: '', ja: '', zh: '',
    },
  },
  {
    slug: 'won-media-bao-ve-ban-quyen-so-cho-hon-500-doi-tac',
    type: 'blog',
    thumbnail: '',
    date: '05/02/2025',
    showOnHomepage: false,
    category: {
      vi: 'Bản quyền', en: 'Copyright', ko: '저작권', ja: '著作権', zh: '版权',
    },
    title: {
      vi: 'WON Media bảo vệ bản quyền số cho hơn 500 đối tác năm 2025',
      en: 'WON Media Protects Digital Copyright for Over 500 Partners in 2025',
      ko: 'WON Media, 2025년 500개 이상의 파트너를 위한 디지털 저작권 보호',
      ja: 'WON Media、2025年に500以上のパートナーのデジタル著作権を保護',
      zh: 'WON Media在2025年为500多个合作伙伴提供数字版权保护',
    },
    excerpt: {
      vi: 'Hệ thống quản lý bản quyền số tiên tiến của WON Media đã xử lý hơn 10,000 claim vi phạm bản quyền trong năm 2024, bảo vệ doanh thu cho các đối tác.',
      en: "WON Media's advanced digital rights management system has processed over 10,000 copyright infringement claims in 2024, protecting revenue for partners.",
      ko: 'WON Media의 첨단 디지털 저작권 관리 시스템은 2024년에 10,000건 이상의 저작권 침해 클레임을 처리하여 파트너의 수익을 보호했습니다.',
      ja: 'WON Mediaの高度なデジタル著作権管理システムは、2024年に10,000件以上の著作権侵害クレームを処理し、パートナーの収益を保護しました。',
      zh: 'WON Media先进的数字版权管理系统在2024年处理了超过10,000起版权侵权索赔，保护了合作伙伴的收益。',
    },
    content: {
      vi: `<p>Trong bối cảnh nội dung số ngày càng phổ biến, vấn đề vi phạm bản quyền trở thành thách thức lớn đối với các nghệ sĩ và đơn vị sản xuất nội dung. WON Media đã xây dựng <strong>hệ thống quản lý bản quyền số (DRM)</strong> toàn diện, giúp các đối tác bảo vệ tài sản trí tuệ của mình.</p>

<h2>Thành tích 2024</h2>
<ul>
  <li>Xử lý <strong>10,247 claim vi phạm</strong> bản quyền trên các nền tảng</li>
  <li>Thu hồi doanh thu <strong>ước tính 2.5 tỷ đồng</strong> cho các đối tác</li>
  <li>Tỷ lệ thành công: <strong>94.3%</strong></li>
  <li>Thời gian xử lý trung bình: <strong>72 giờ</strong></li>
</ul>

<h2>Công nghệ sử dụng</h2>
<p>WON Media sử dụng công nghệ AI fingerprinting tiên tiến để phát hiện nội dung vi phạm trên YouTube, Facebook, TikTok, Instagram và hơn 50 nền tảng khác trên toàn cầu.</p>`,
      en: `<p>In the context of increasingly popular digital content, copyright infringement has become a major challenge for artists and content producers. WON Media has built a comprehensive <strong>Digital Rights Management (DRM) system</strong> to help partners protect their intellectual property.</p>

<h2>2024 Achievements</h2>
<ul>
  <li>Processed <strong>10,247 infringement claims</strong> across platforms</li>
  <li>Recovered estimated revenue of <strong>2.5 billion VND</strong> for partners</li>
  <li>Success rate: <strong>94.3%</strong></li>
</ul>`,
      ko: '', ja: '', zh: '',
    },
  },
  {
    slug: 'recap-year-end-party-won-media-2024',
    type: 'blog',
    thumbnail: '',
    date: '25/12/2024',
    showOnHomepage: false,
    category: {
      vi: 'Nội bộ', en: 'Internal', ko: '내부', ja: '社内', zh: '内部',
    },
    title: {
      vi: 'Recap Year End Party WON Media 2024 — Một năm rực rỡ',
      en: 'Recap: WON Media Year End Party 2024 — A Brilliant Year',
      ko: 'WON Media 2024 연말 파티 리캡 — 빛나는 한 해',
      ja: 'WON Media 2024年末パーティーレキャップ — 輝かしい一年',
      zh: 'WON Media 2024年末派对回顾——辉煌的一年',
    },
    excerpt: {
      vi: 'Buổi tiệc cuối năm WON Media 2024 quy tụ toàn bộ đội ngũ trong không khí ấm áp, đánh dấu một năm đầy thành tựu và kỷ niệm hành trình phát triển cùng nhau.',
      en: "WON Media's 2024 year-end party brought together the entire team in a warm atmosphere, marking a year full of achievements and celebrating the journey of growth together.",
      ko: 'WON Media 2024년 연말 파티는 따뜻한 분위기 속에 전체 팀이 모여 성과로 가득한 한 해를 기념하고 함께한 성장의 여정을 축하했습니다.',
      ja: 'WON Media 2024年末パーティーは、温かい雰囲気の中でチーム全員が集まり、成果に満ちた一年を記念し、共に歩んだ成長の旅を祝いました。',
      zh: 'WON Media 2024年末派对在温馨的氛围中汇聚了全体团队，纪念充满成就的一年，共同庆祝成长之旅。',
    },
    content: {
      vi: `<p>Tối ngày 24/12/2024, toàn bộ đội ngũ WON Media đã cùng nhau tụ họp tại <strong>Rooftop Sky Lounge</strong>, Hà Nội trong không khí Giáng Sinh ấm áp để kết thúc một năm đáng nhớ với biết bao thành tựu.</p>

<h2>Những khoảnh khắc đáng nhớ</h2>
<p>Buổi tối bắt đầu với màn tổng kết năm ấn tượng từ Ban giám đốc, ôn lại hành trình từ những ngày đầu thành lập đến nay. Tiếp theo là phần trao giải thưởng cho các cá nhân và tập thể xuất sắc trong năm.</p>

<ul>
  <li>🏆 Nhân viên xuất sắc nhất: 5 cá nhân được vinh danh</li>
  <li>🎵 Dự án âm nhạc thành công nhất năm</li>
  <li>📺 Kênh YouTube tăng trưởng ấn tượng nhất</li>
  <li>🤝 Hợp tác đối tác tiêu biểu</li>
</ul>

<h2>Hướng tới 2025</h2>
<p>Khép lại một năm 2024 đầy tự hào, WON Media hướng tới năm 2025 với nhiều mục tiêu tham vọng hơn: mở rộng thị trường quốc tế, tăng gấp đôi số lượng đối tác và đặc biệt là ra mắt nhiều dịch vụ công nghệ mới phục vụ cộng đồng sáng tạo nội dung.</p>`,
      en: `<p>On the evening of December 24, 2024, the entire WON Media team gathered at <strong>Rooftop Sky Lounge</strong>, Hanoi in the warm Christmas atmosphere to end a memorable year with many achievements.</p>

<h2>Memorable Moments</h2>
<p>The evening began with an impressive year-end summary from the Board of Directors, looking back on the journey from the early founding days to now. This was followed by an awards ceremony honoring outstanding individuals and teams of the year.</p>

<h2>Looking Forward to 2025</h2>
<p>Closing a proud 2024, WON Media looks forward to 2025 with more ambitious goals: expanding international markets, doubling the number of partners, and launching many new technology services for the content creation community.</p>`,
      ko: '', ja: '', zh: '',
    },
  },
]

// ─── Tuyển dụng ───────────────────────────────────────────────────────────────
const TUYEN_DUNG_POSTS = [
  {
    slug: 'tuyen-dung-content-creator-am-nhac-2025',
    type: 'tuyen-dung',
    thumbnail: '',
    date: '20/05/2025',
    showOnHomepage: true,
    category: {
      vi: 'Sáng tạo nội dung', en: 'Content Creation',
      ko: '콘텐츠 제작', ja: 'コンテンツ制作', zh: '内容创作',
    },
    title: {
      vi: '[HÀ NỘI] Tuyển dụng Content Creator Âm nhạc (Full-time)',
      en: '[HANOI] Music Content Creator Recruitment (Full-time)',
      ko: '[하노이] 음악 콘텐츠 크리에이터 채용 (정규직)',
      ja: '[ハノイ] 音楽コンテンツクリエイター募集（フルタイム）',
      zh: '[河内] 招募音乐内容创作者（全职）',
    },
    excerpt: {
      vi: 'WON Media tìm kiếm Content Creator đam mê âm nhạc, có khả năng sản xuất nội dung sáng tạo cho các kênh YouTube, TikTok và mạng xã hội.',
      en: 'WON Media is looking for a music-passionate Content Creator capable of producing creative content for YouTube, TikTok, and social media channels.',
      ko: 'WON Media는 YouTube, TikTok 및 소셜 미디어 채널을 위한 창의적인 콘텐츠를 제작할 수 있는 음악을 열정적으로 사랑하는 콘텐츠 크리에이터를 찾고 있습니다.',
      ja: 'WON MediaはYouTube、TikTok、ソーシャルメディアチャンネル向けのクリエイティブなコンテンツを制作できる、音楽情熱的なコンテンツクリエイターを募集しています。',
      zh: 'WON Media正在寻找热爱音乐的内容创作者，能够为YouTube、TikTok和社交媒体渠道制作创意内容。',
    },
    content: {
      vi: `<h2>Mô tả công việc</h2>
<p>Bạn sẽ là thành viên của đội ngũ sáng tạo nội dung tại WON Media, chịu trách nhiệm sản xuất và quản lý nội dung trên các nền tảng số.</p>

<h3>Nhiệm vụ chính</h3>
<ul>
  <li>Lên ý tưởng và sản xuất video âm nhạc, MV, lyric video cho YouTube</li>
  <li>Tạo nội dung short-form hấp dẫn cho TikTok và Instagram Reels</li>
  <li>Viết kịch bản, quay dựng và hậu kỳ cơ bản</li>
  <li>Phân tích hiệu suất nội dung và đề xuất cải thiện</li>
  <li>Phối hợp với nghệ sĩ và ekip sản xuất</li>
</ul>

<h3>Yêu cầu</h3>
<ul>
  <li>Am hiểu âm nhạc Việt Nam và xu hướng content hiện tại</li>
  <li>Biết sử dụng phần mềm dựng video (Premiere Pro, CapCut hoặc tương đương)</li>
  <li>Có kênh mạng xã hội cá nhân với nội dung chất lượng là lợi thế</li>
  <li>Sáng tạo, chủ động và có khả năng làm việc nhóm tốt</li>
  <li>Kinh nghiệm: không yêu cầu (fresher được chào đón)</li>
</ul>

<h2>Quyền lợi</h2>
<ul>
  <li>Lương: <strong>8 – 15 triệu VNĐ/tháng</strong> tùy năng lực</li>
  <li>Thưởng dự án và KPI</li>
  <li>Môi trường sáng tạo, năng động</li>
  <li>Được tiếp cận và hợp tác với các nghệ sĩ nổi tiếng</li>
  <li>Phát triển kỹ năng qua các khóa đào tạo nội bộ</li>
</ul>

<h2>Cách ứng tuyển</h2>
<p>Gửi CV + portfolio (link kênh/video đã làm) về email: <strong>hr@wonmedia.vn</strong></p>
<p>Tiêu đề email: <code>[CONTENT CREATOR] Họ và tên - Năm sinh</code></p>`,
      en: `<h2>Job Description</h2>
<p>You will be a member of WON Media's creative content team, responsible for producing and managing content across digital platforms.</p>

<h3>Key Responsibilities</h3>
<ul>
  <li>Develop ideas and produce music videos, MVs, and lyric videos for YouTube</li>
  <li>Create engaging short-form content for TikTok and Instagram Reels</li>
  <li>Write scripts, film, and do basic editing</li>
  <li>Analyze content performance and propose improvements</li>
</ul>

<h3>Requirements</h3>
<ul>
  <li>Understanding of Vietnamese music and current content trends</li>
  <li>Proficiency in video editing software (Premiere Pro, CapCut, or equivalent)</li>
  <li>Creativity, initiative, and good teamwork skills</li>
  <li>Experience: not required (freshers welcome)</li>
</ul>

<h2>Benefits</h2>
<ul>
  <li>Salary: <strong>8 – 15 million VND/month</strong> based on ability</li>
  <li>Project and KPI bonuses</li>
  <li>Creative, dynamic environment</li>
  <li>Access to and collaboration with famous artists</li>
</ul>

<h2>How to Apply</h2>
<p>Send CV + portfolio (link to channels/videos) to: <strong>hr@wonmedia.vn</strong></p>`,
      ko: '', ja: '', zh: '',
    },
  },
  {
    slug: 'tuyen-dung-digital-marketing-executive-2025',
    type: 'tuyen-dung',
    thumbnail: '',
    date: '15/05/2025',
    showOnHomepage: true,
    category: {
      vi: 'Marketing', en: 'Marketing', ko: '마케팅', ja: 'マーケティング', zh: '市场营销',
    },
    title: {
      vi: '[HÀ NỘI] Digital Marketing Executive – Mảng Âm nhạc',
      en: '[HANOI] Digital Marketing Executive – Music Division',
      ko: '[하노이] 디지털 마케팅 임원 – 음악 부문',
      ja: '[ハノイ] デジタルマーケティングエグゼクティブ – 音楽部門',
      zh: '[河内] 数字营销主管——音乐部门',
    },
    excerpt: {
      vi: 'WON Media tìm kiếm chuyên viên Digital Marketing có kinh nghiệm chạy quảng cáo và xây dựng chiến lược marketing cho các sản phẩm âm nhạc.',
      en: 'WON Media is looking for a Digital Marketing specialist with experience in running ads and building marketing strategies for music products.',
      ko: 'WON Media는 음악 제품을 위한 광고 운영 및 마케팅 전략 수립 경험을 가진 디지털 마케팅 전문가를 찾고 있습니다.',
      ja: 'WON Mediaは音楽製品の広告運用とマーケティング戦略構築の経験を持つデジタルマーケティングスペシャリストを募集しています。',
      zh: 'WON Media正在寻找具有音乐产品广告投放和营销策略制定经验的数字营销专员。',
    },
    content: {
      vi: `<h2>Mô tả công việc</h2>
<p>Chịu trách nhiệm xây dựng và triển khai chiến lược marketing digital cho các sản phẩm âm nhạc và kênh đối tác của WON Media.</p>

<h3>Nhiệm vụ</h3>
<ul>
  <li>Lên kế hoạch và triển khai chiến dịch quảng cáo trên Meta Ads, Google Ads, TikTok Ads</li>
  <li>Quản lý ngân sách quảng cáo và tối ưu ROAS</li>
  <li>Phân tích dữ liệu và báo cáo hiệu quả chiến dịch</li>
  <li>Phối hợp với ekip content để đảm bảo tính nhất quán của thương hiệu</li>
  <li>Nghiên cứu đối thủ và xu hướng thị trường âm nhạc</li>
</ul>

<h3>Yêu cầu</h3>
<ul>
  <li>Từ 1 năm kinh nghiệm chạy quảng cáo (Meta Ads, Google Ads)</li>
  <li>Hiểu biết về thị trường âm nhạc và streaming</li>
  <li>Kỹ năng phân tích dữ liệu tốt (Google Analytics, Ads Manager)</li>
  <li>Có kinh nghiệm marketing cho sản phẩm âm nhạc là lợi thế lớn</li>
</ul>

<h2>Quyền lợi</h2>
<ul>
  <li>Lương: <strong>12 – 20 triệu VNĐ</strong> + thưởng hiệu suất</li>
  <li>Ngân sách quảng cáo để học hỏi và thực hành</li>
  <li>Được đào tạo chuyên sâu về marketing âm nhạc</li>
  <li>Môi trường trẻ trung, sáng tạo</li>
</ul>

<h2>Ứng tuyển</h2>
<p>Email: <strong>hr@wonmedia.vn</strong> | Tiêu đề: <code>[DIGITAL MARKETING] Họ tên</code></p>`,
      en: `<h2>Job Description</h2>
<p>Responsible for building and implementing digital marketing strategies for WON Media's music products and partner channels.</p>

<h3>Requirements</h3>
<ul>
  <li>At least 1 year of advertising experience (Meta Ads, Google Ads)</li>
  <li>Understanding of the music market and streaming</li>
  <li>Good data analysis skills (Google Analytics, Ads Manager)</li>
</ul>

<h2>Benefits</h2>
<ul>
  <li>Salary: <strong>12 – 20 million VND</strong> + performance bonus</li>
  <li>Young, creative environment</li>
</ul>

<p>Email: <strong>hr@wonmedia.vn</strong></p>`,
      ko: '', ja: '', zh: '',
    },
  },
  {
    slug: 'tuyen-dung-a-r-music-coordinator-2025',
    type: 'tuyen-dung',
    thumbnail: '',
    date: '10/05/2025',
    showOnHomepage: false,
    category: {
      vi: 'Âm nhạc', en: 'Music', ko: '음악', ja: '音楽', zh: '音乐',
    },
    title: {
      vi: 'Tuyển dụng A&R / Music Coordinator tại WON Media',
      en: 'A&R / Music Coordinator Recruitment at WON Media',
      ko: 'WON Media A&R / 음악 코디네이터 채용',
      ja: 'WON Media A&R / ミュージックコーディネーター募集',
      zh: 'WON Media招募A&R/音乐协调员',
    },
    excerpt: {
      vi: 'Vị trí A&R/Music Coordinator phụ trách tìm kiếm tài năng âm nhạc, phát triển nghệ sĩ và điều phối quá trình sản xuất âm nhạc tại WON Media.',
      en: 'The A&R/Music Coordinator position is responsible for talent scouting, artist development, and coordinating music production processes at WON Media.',
      ko: 'A&R/음악 코디네이터 직책은 WON Media에서 음악 재능 발굴, 아티스트 개발 및 음악 제작 프로세스 조정을 담당합니다.',
      ja: 'A&R/ミュージックコーディネーターのポジションは、WON MediaでのタレントスカウティングAと、アーティスト開発、音楽制作プロセスの調整を担当します。',
      zh: 'A&R/音乐协调员职位负责WON Media的音乐人才发掘、艺术家发展和音乐制作流程协调。',
    },
    content: {
      vi: `<h2>Giới thiệu vị trí</h2>
<p>A&R (Artists and Repertoire) là cầu nối quan trọng giữa nghệ sĩ và công ty, đóng vai trò then chốt trong việc phát triển sự nghiệp âm nhạc của đối tác WON Media.</p>

<h3>Nhiệm vụ</h3>
<ul>
  <li>Tìm kiếm và đánh giá tài năng âm nhạc mới</li>
  <li>Tư vấn và hỗ trợ nghệ sĩ trong định hướng âm nhạc</li>
  <li>Điều phối quá trình thu âm, sản xuất và phát hành</li>
  <li>Xây dựng và duy trì quan hệ với nghệ sĩ, nhạc sĩ, nhà sản xuất</li>
  <li>Theo dõi xu hướng âm nhạc trong và ngoài nước</li>
</ul>

<h3>Yêu cầu</h3>
<ul>
  <li>Đam mê âm nhạc, có tai nghe tốt và hiểu biết về các thể loại nhạc</li>
  <li>Kỹ năng giao tiếp và đàm phán tốt</li>
  <li>Có kinh nghiệm trong ngành âm nhạc hoặc giải trí (ưu tiên)</li>
  <li>Khả năng làm việc dưới áp lực cao và linh hoạt về giờ giấc</li>
</ul>

<h2>Mức lương</h2>
<p>Thương lượng theo năng lực: <strong>10 – 18 triệu VNĐ/tháng</strong></p>

<h2>Liên hệ</h2>
<p>Email: <strong>ar@wonmedia.vn</strong></p>`,
      en: `<h2>Position Overview</h2>
<p>A&R (Artists and Repertoire) is an important bridge between artists and the company, playing a key role in developing the musical careers of WON Media's partners.</p>

<h3>Requirements</h3>
<ul>
  <li>Passion for music, good ear, and understanding of music genres</li>
  <li>Good communication and negotiation skills</li>
  <li>Experience in the music or entertainment industry (preferred)</li>
</ul>

<h2>Salary</h2>
<p>Negotiable based on ability: <strong>10 – 18 million VND/month</strong></p>

<p>Email: <strong>ar@wonmedia.vn</strong></p>`,
      ko: '', ja: '', zh: '',
    },
  },
  {
    slug: 'tuyen-dung-copyright-specialist-2025',
    type: 'tuyen-dung',
    thumbnail: '',
    date: '01/05/2025',
    showOnHomepage: false,
    category: {
      vi: 'Bản quyền', en: 'Copyright', ko: '저작권', ja: '著作権', zh: '版权',
    },
    title: {
      vi: 'Tuyển dụng Chuyên viên Bản quyền số (Copyright Specialist)',
      en: 'Digital Copyright Specialist Recruitment',
      ko: '디지털 저작권 전문가 채용',
      ja: 'デジタル著作権スペシャリスト募集',
      zh: '数字版权专员招募',
    },
    excerpt: {
      vi: 'Chuyên viên Bản quyền số phụ trách quản lý, theo dõi và xử lý các vấn đề liên quan đến bản quyền nội dung số cho hàng trăm đối tác của WON Media.',
      en: 'The Digital Copyright Specialist is responsible for managing, monitoring, and resolving digital content copyright issues for hundreds of WON Media partners.',
      ko: '디지털 저작권 전문가는 WON Media의 수백 파트너를 위한 디지털 콘텐츠 저작권 문제를 관리, 모니터링 및 해결하는 역할을 담당합니다.',
      ja: 'デジタル著作権スペシャリストは、WON Mediaの数百のパートナーのデジタルコンテンツ著作権問題の管理、監視、解決を担当します。',
      zh: '数字版权专员负责为WON Media数百个合作伙伴管理、监控和解决数字内容版权问题。',
    },
    content: {
      vi: `<h2>Mô tả công việc</h2>
<p>Đây là vị trí quan trọng trong bộ phận Copyright của WON Media, trực tiếp đảm bảo quyền lợi doanh thu và bảo vệ tài sản số cho các nghệ sĩ và đối tác.</p>

<h3>Nhiệm vụ</h3>
<ul>
  <li>Đăng ký và quản lý bản quyền nội dung trên YouTube Content ID, Meta Rights Manager</li>
  <li>Theo dõi và xử lý claim vi phạm bản quyền trên các nền tảng</li>
  <li>Tư vấn nghệ sĩ về quyền sở hữu trí tuệ trong âm nhạc</li>
  <li>Quản lý hợp đồng bản quyền và thỏa thuận cấp phép</li>
  <li>Báo cáo doanh thu bản quyền định kỳ cho đối tác</li>
</ul>

<h3>Yêu cầu</h3>
<ul>
  <li>Tốt nghiệp chuyên ngành Luật, Quản lý Văn hóa hoặc liên quan</li>
  <li>Hiểu biết về Luật Sở hữu Trí tuệ Việt Nam và quốc tế</li>
  <li>Thành thạo tiếng Anh (đọc, viết tài liệu pháp lý)</li>
  <li>Cẩn thận, tỉ mỉ và có khả năng xử lý nhiều đầu việc cùng lúc</li>
</ul>

<h2>Quyền lợi</h2>
<ul>
  <li>Lương: <strong>10 – 16 triệu VNĐ</strong> + thưởng theo hiệu suất</li>
  <li>Được đào tạo chuyên sâu về luật bản quyền kỹ thuật số</li>
  <li>Bảo hiểm đầy đủ theo quy định</li>
  <li>Cơ hội thăng tiến lên vị trí Copyright Manager</li>
</ul>

<p>Ứng tuyển: <strong>hr@wonmedia.vn</strong> | <code>[COPYRIGHT SPECIALIST] Họ tên</code></p>`,
      en: `<h2>Job Description</h2>
<p>This is an important position in WON Media's Copyright department, directly ensuring revenue rights and protecting digital assets for artists and partners.</p>

<h3>Requirements</h3>
<ul>
  <li>Degree in Law, Cultural Management, or related field</li>
  <li>Understanding of Vietnamese and international Intellectual Property Law</li>
  <li>Proficient English (reading, writing legal documents)</li>
</ul>

<h2>Benefits</h2>
<ul>
  <li>Salary: <strong>10 – 16 million VND</strong> + performance bonus</li>
  <li>Full insurance benefits</li>
</ul>

<p>Apply: <strong>hr@wonmedia.vn</strong></p>`,
      ko: '', ja: '', zh: '',
    },
  },
]

// ─── Seed ─────────────────────────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(MONGODB_URI)
  console.log('✅ Connected to MongoDB')

  const ALL_POSTS = [...BLOG_POSTS, ...TUYEN_DUNG_POSTS]
  let created = 0, skipped = 0

  for (const post of ALL_POSTS) {
    const exists = await PostModel.findOne({ slug: post.slug })
    if (exists) {
      if (process.argv.includes('--force')) {
        await PostModel.deleteOne({ slug: post.slug })
      } else {
        console.log(`  ⏭  Bỏ qua (đã có): ${post.slug}`)
        skipped++; continue
      }
    }
    await PostModel.create({ ...post, active: true })
    console.log(`  ✅ ${post.type === 'blog' ? '📰' : '💼'} ${post.title.vi}`)
    created++
  }

  console.log(`\n✅ Hoàn tất! Đã tạo: ${created}, Bỏ qua: ${skipped}`)
  console.log('   Dùng --force để ghi đè tất cả.')
  await mongoose.disconnect()
}

seed().catch(e => { console.error('❌', e); process.exit(1) })
