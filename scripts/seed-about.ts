import { config } from 'dotenv'
config({ path: '.env.local' })
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

const ML = { vi: String, en: String, ko: String, ja: String, zh: String }
const MLArr = { title: ML, line1: ML, line2: ML }
const MLPair = { title: ML, desc: ML }

const AboutConfigModel = mongoose.models.AboutConfig ||
  mongoose.model('AboutConfig', new mongoose.Schema({
    key:               { type: String, default: 'global', unique: true },
    bannerSubtitle:    ML, bannerTitle: ML,
    aboutLabel:        ML, aboutTitleLine1: ML, aboutTitleHighlight: ML,
    aboutDesc1Prefix:  ML, aboutDesc1Year: ML, aboutDesc1Suffix: ML,
    aboutDesc2:        ML, aboutExpValue: ML, aboutExpText: ML, aboutButton: ML,
    timelineHeading:   ML,
    timelineMilestones:[MLArr],
    whyUsHeading:      ML,
    whyUsReasons:      [MLPair],
    servicesHeading:   ML,
    servicesItems:     [MLPair],
  }, { strict: false, timestamps: true }))

async function seed() {
  await mongoose.connect(MONGODB_URI)
  console.log('✅ Connected to MongoDB')

  const existing = await AboutConfigModel.findOne({ key: 'global' })
  if (existing) {
    console.log('ℹ️  AboutConfig đã tồn tại — bỏ qua (dùng --force để ghi đè)')
    const force = process.argv.includes('--force')
    if (!force) { await mongoose.disconnect(); return }
    console.log('⚠️  --force: ghi đè dữ liệu cũ...')
    await AboutConfigModel.deleteOne({ key: 'global' })
  }

  await AboutConfigModel.create({
    key: 'global',

    // ── Banner ────────────────────────────────────────────────────────────────
    bannerSubtitle: {
      vi: 'Tiên phong trong lĩnh vực nội dung số',
      en: 'Pioneering the digital content industry',
      ko: '디지털 콘텐츠 산업의 선구자',
      ja: 'デジタルコンテンツ業界のパイオニア',
      zh: '数字内容行业的先驱',
    },
    bannerTitle: {
      vi: 'Về WON Media',
      en: 'About WON Media',
      ko: 'WON Media 소개',
      ja: 'WON Mediaについて',
      zh: '关于WON Media',
    },

    // ── About section ─────────────────────────────────────────────────────────
    aboutLabel: {
      vi: 'Về chúng tôi', en: 'About Us',
      ko: '회사 소개',     ja: '会社紹介', zh: '关于我们',
    },
    aboutTitleLine1: {
      vi: 'CÔNG TY TNHH', en: 'LIMITED LIABILITY COMPANY',
      ko: '유한책임회사', ja: '有限責任会社', zh: '有限责任公司',
    },
    aboutTitleHighlight: {
      vi: 'WON MEDIA', en: 'WON MEDIA',
      ko: 'WON MEDIA', ja: 'WON MEDIA', zh: 'WON MEDIA',
    },
    aboutDesc1Prefix: {
      vi: 'Được thành lập từ năm', en: 'Founded in',
      ko: '설립 연도',             ja: '設立年',    zh: '成立于',
    },
    aboutDesc1Year: {
      vi: '2023', en: '2023', ko: '2023년', ja: '2023', zh: '2023年',
    },
    aboutDesc1Suffix: {
      vi: ' Won Media là đơn vị tiên phong trong lĩnh vực nội dung số, cung cấp giải pháp truyền thông toàn diện tại Việt Nam.',
      en: ' Won Media is a pioneer in digital content, providing comprehensive media solutions in Vietnam.',
      ko: ' WON Media는 베트남에서 종합 미디어 솔루션을 제공하는 디지털 콘텐츠 분야의 선구자입니다.',
      ja: '、WON Mediaはベトナムで総合的なメディアソリューションを提供するデジタルコンテンツのパイオニアです。',
      zh: '，WON Media是越南数字内容领域的先驱，提供全面的媒体解决方案。',
    },
    aboutDesc2: {
      vi: 'Chúng tôi tự hào sở hữu đội ngũ sáng tạo trẻ trung, kết hợp cùng những chuyên gia dày dặn kinh nghiệm để mang lại giá trị tối ưu nhất cho đối tác.',
      en: 'We take pride in our young creative team combined with experienced professionals to deliver the best value for our partners.',
      ko: '우리는 젊고 창의적인 팀과 풍부한 경험을 가진 전문가들을 결합하여 파트너에게 최상의 가치를 제공합니다.',
      ja: '私たちは若くクリエイティブなチームと豊富な経験を持つ専門家を組み合わせ、パートナーに最高の価値を提供します。',
      zh: '我们拥有充满活力的年轻创意团队与经验丰富的专业人士，为合作伙伴提供最优质的价值。',
    },
    aboutExpValue: {
      vi: '03+', en: '03+', ko: '03+', ja: '03+', zh: '03+',
    },
    aboutExpText: {
      vi: 'Năm kinh nghiệm trong ngành', en: 'Years of industry experience',
      ko: '업계 경력 연수',             ja: '業界経験年数', zh: '年行业经验',
    },
    aboutButton: {
      vi: 'Tìm hiểu thêm về chúng tôi', en: 'Learn more about us',
      ko: 'WON Media 더 알아보기',       ja: 'WON Mediaについてもっと詳しく', zh: '了解更多关于WON Media',
    },

    // ── Timeline ──────────────────────────────────────────────────────────────
    timelineHeading: {
      vi: 'CHẶNG ĐƯỜNG PHÁT TRIỂN', en: 'OUR GROWTH JOURNEY',
      ko: '성장 여정',               ja: '成長の歩み', zh: '发展历程',
    },
    timelineMilestones: [
      {
        title: { vi: 'THÀNH LẬP CÔNG TY', en: 'COMPANY ESTABLISHMENT', ko: '회사 설립', ja: '会社設立', zh: '公司成立' },
        line1: { vi: 'Công ty TNHH WON Media chính thức thành lập (07/2023)', en: 'WON Media Co., Ltd. officially established (July 2023)', ko: 'WON Media 유한책임회사 공식 설립 (2023년 7월)', ja: 'WON Media有限責任会社が正式設立（2023年7月）', zh: 'WON Media有限责任公司正式成立（2023年7月）' },
        line2: { vi: 'Điểm khởi đầu của hành trình nội dung số', en: 'The starting point of our digital content journey', ko: '디지털 콘텐츠 여정의 출발점', ja: 'デジタルコンテンツの旅の始まり', zh: '数字内容旅程的起点' },
      },
      {
        title: { vi: 'MỞ RỘNG HỆ THỐNG', en: 'SYSTEM EXPANSION', ko: '시스템 확장', ja: 'システム拡大', zh: '系统扩展' },
        line1: { vi: 'Quy mô đội ngũ & số kênh tăng trưởng', en: 'Growth in team size and number of channels', ko: '팀 규모 및 채널 수 성장', ja: 'チーム規模とチャンネル数の成長', zh: '团队规模与频道数量增长' },
        line2: { vi: 'Gia tăng đối tác MXH & nội dung', en: 'Expanding social media & content partnerships', ko: '소셜 미디어 및 콘텐츠 파트너십 확대', ja: 'SNS・コンテンツパートナーシップの拡大', zh: '社交媒体与内容合作伙伴扩展' },
      },
      {
        title: { vi: 'BẢO VỆ BẢN QUYỀN', en: 'COPYRIGHT PROTECTION', ko: '저작권 보호', ja: '著作権保護', zh: '版权保护' },
        line1: { vi: 'Bảo vệ bản quyền nội dung số cho đối tác', en: 'Digital content copyright protection for partners', ko: '파트너를 위한 디지털 콘텐츠 저작권 보호', ja: 'パートナーのデジタルコンテンツ著作権保護', zh: '为合作伙伴提供数字内容版权保护' },
        line2: { vi: 'Quản lý phân phối và xử lý vi phạm', en: 'Distribution management and violation handling', ko: '배포 관리 및 침해 처리', ja: '配信管理と侵害対応', zh: '内容分发管理与侵权处理' },
      },
      {
        title: { vi: 'MỞ RỘNG QUỐC TẾ', en: 'INTERNATIONAL EXPANSION', ko: '국제 확장', ja: '国際展開', zh: '国际拓展' },
        line1: { vi: 'Phát triển nội dung & phân phối quốc tế', en: 'Global content development and distribution', ko: '글로벌 콘텐츠 개발 및 배포', ja: 'グローバルコンテンツの開発と配信', zh: '全球内容开发与分发' },
        line2: { vi: 'Hợp tác với đối tác nội dung lớn', en: 'Collaboration with major content partners', ko: '주요 콘텐츠 파트너와의 협력', ja: '主要コンテンツパートナーとの連携', zh: '与主要内容合作伙伴合作' },
      },
      {
        title: { vi: 'MỤC TIÊU KÊNH YOUTUBE', en: 'YOUTUBE CHANNEL GOALS', ko: 'YouTube 채널 목표', ja: 'YouTubeチャンネル目標', zh: 'YouTube频道目标' },
        line1: { vi: 'Tiếp tục gia tăng số lượng nút & kênh lớn', en: 'Increasing the number of Gold & Silver buttons', ko: '골드·실버 버튼 수 증가', ja: 'ゴールド・シルバーボタン数の増加', zh: '增加金银按钮数量' },
        line2: { vi: 'Đẩy mạnh hiệu suất nội dung trên YouTube', en: 'Boosting content performance on YouTube', ko: 'YouTube 콘텐츠 성과 향상', ja: 'YouTubeのコンテンツパフォーマンス向上', zh: '提升YouTube内容表现' },
      },
      {
        title: { vi: 'TĂNG TRƯỞNG & ĐỊNH VỊ THƯƠNG HIỆU', en: 'GROWTH & BRAND POSITIONING', ko: '성장 및 브랜드 포지셔닝', ja: '成長とブランドポジショニング', zh: '增长与品牌定位' },
        line1: { vi: 'Củng cố vị thế trong lĩnh vực nội dung số', en: 'Strengthening position in the digital content space', ko: '디지털 콘텐츠 분야에서의 위상 강화', ja: 'デジタルコンテンツ分野での地位強化', zh: '巩固在数字内容领域的地位' },
        line2: { vi: 'Xây dựng hệ sinh thái kênh & đối tác bền vững', en: 'Building a sustainable channel & partner ecosystem', ko: '지속 가능한 채널 및 파트너 생태계 구축', ja: '持続可能なチャンネル・パートナーエコシステム構築', zh: '建立可持续的频道与合作伙伴生态系统' },
      },
    ],

    // ── Why Us ────────────────────────────────────────────────────────────────
    whyUsHeading: {
      vi: 'Tại sao chọn chúng tôi', en: 'Why Choose Us',
      ko: '왜 우리를 선택하나요',   ja: 'なぜ私たちを選ぶのか', zh: '为什么选择我们',
    },
    whyUsReasons: [
      {
        title: { vi: 'Đội ngũ nhân viên chuyên nghiệp', en: 'Professional Team', ko: '전문적인 팀', ja: 'プロフェッショナルなチーム', zh: '专业团队' },
        desc:  { vi: 'Công ty sở hữu đội ngũ nhân viên trẻ, đầy nhiệt huyết và luôn sẵn sàng học hỏi. Môi trường làm việc cởi mở, thân thiện, đề cao sự thoải mái và tinh thần đồng đội. Không gò bó cấp bậc, mọi ý tưởng đều được lắng nghe và tôn trọng.', en: 'Our young, enthusiastic team is always eager to learn. The open and friendly environment values comfort and teamwork. No rigid hierarchy — all ideas are heard and respected.', ko: '젊고 열정적인 직원들로 구성되어 있으며, 항상 배우려는 자세를 갖추고 있습니다. 열린 문화 속에서 모든 아이디어가 존중받습니다.', ja: '若く情熱的なスタッフが常に学ぶ姿勢で取り組んでいます。オープンで友好的な環境の中で、すべてのアイデアが尊重されます。', zh: '公司拥有年轻、充满热情的员工团队，始终保持学习的态度。开放友好的工作环境中，所有创意都受到尊重。' },
      },
      {
        title: { vi: 'Con người là yếu tố quyết định', en: 'People Are the Key Factor', ko: '사람이 핵심 요소', ja: '人材が鍵となる要素', zh: '人才是决定性因素' },
        desc:  { vi: 'Won Media luôn chú trọng tạo ra môi trường làm việc năng động, thân thiện để mỗi cá nhân phát huy hết năng lực.', en: 'Won Media focuses on building a dynamic and friendly working environment where every individual can maximize their potential.', ko: 'WON Media는 각 개인이 역량을 최대한 발휘할 수 있는 역동적이고 친근한 근무 환경 조성에 주력합니다.', ja: 'WON Mediaは、各個人が能力を最大限に発揮できるダイナミックで友好的な職場環境づくりに注力しています。', zh: 'WON Media注重打造充满活力、友好的工作环境，让每个人都能充分发挥潜能。' },
      },
      {
        title: { vi: 'Won Media là một tập thể thống nhất', en: 'One United Organization', ko: '하나의 통합된 조직', ja: '一つの統一された組織', zh: 'WON Media是一个统一的集体' },
        desc:  { vi: 'Gắn kết qua các hoạt động teambuilding và văn hóa doanh nghiệp đặc sắc, tạo nên sức mạnh tổng thể.', en: 'Connected through teambuilding activities and strong corporate culture, creating collective strength.', ko: '팀빌딩 활동과 강력한 기업 문화를 통해 연결되어 집단적 강점을 형성합니다.', ja: 'チームビルディング活動と強力な企業文化を通じてつながり、集合的な強みを形成します。', zh: '通过团队建设活动和独特的企业文化相互联结，形成整体合力。' },
      },
      {
        title: { vi: 'Chúng tôi không ngừng thay đổi', en: 'Continuous Innovation', ko: '끊임없는 혁신', ja: '絶え間ない革新', zh: '我们不断创新' },
        desc:  { vi: 'Luôn dẫn đầu xu hướng truyền thông và công nghệ để mang lại giá trị bền vững cho đối tác.', en: 'Always leading media and technology trends to deliver sustainable value to partners.', ko: '미디어와 기술 트렌드를 항상 선도하여 파트너에게 지속 가능한 가치를 제공합니다.', ja: 'メディアと技術のトレンドを常にリードし、パートナーに持続可能な価値を提供します。', zh: '始终引领媒体与技术趋势，为合作伙伴创造持续的价值。' },
      },
    ],

    // ── Services ──────────────────────────────────────────────────────────────
    servicesHeading: {
      vi: 'DỊCH VỤ CỦA CHÚNG TÔI', en: 'OUR SERVICES',
      ko: '우리의 서비스',          ja: '私たちのサービス', zh: '我们的服务',
    },
    servicesItems: [
      {
        title: { vi: 'Kinh doanh trên mạng xã hội', en: 'Social Media Business', ko: '소셜 미디어 비즈니스', ja: 'ソーシャルメディアビジネス', zh: '社交媒体业务' },
        desc:  { vi: 'WON Media là đối tác chính thức của YouTube, Facebook và TikTok tại Việt Nam, cung cấp dịch vụ marketing và xây dựng kênh MXH cho nghệ sĩ, doanh nghiệp trong và ngoài nước.', en: 'WON Media is an official partner of YouTube, Facebook, and TikTok in Vietnam, providing marketing services and building strong social channels for artists and businesses.', ko: 'WON Media는 베트남에서 YouTube, Facebook, TikTok의 공식 파트너로서 아티스트와 기업을 위한 마케팅 서비스를 제공합니다.', ja: 'WON MediaはベトナムにおけるYouTube、Facebook、TikTokの公式パートナーとして、アーティストや企業向けにマーケティングサービスを提供しています。', zh: 'WON Media是越南YouTube、Facebook和TikTok的官方合作伙伴，为艺术家和企业提供营销服务及社交媒体频道建设。' },
      },
      {
        title: { vi: 'Phát hành âm nhạc', en: 'Music Distribution', ko: '음악 배급', ja: '音楽配信', zh: '音乐发行' },
        desc:  { vi: 'Triển khai phát hành nhạc tới các nền tảng toàn cầu như Spotify, Apple Music, YouTube Music, Facebook, TikTok, Deezer, Amazon Music, v.v.', en: 'Distribute music to global platforms such as Spotify, Apple Music, YouTube Music, TikTok, Deezer, Amazon Music, etc.', ko: 'Spotify, Apple Music, YouTube Music, TikTok, Deezer, Amazon Music 등 글로벌 플랫폼에 음악을 배급합니다.', ja: 'Spotify、Apple Music、YouTube Music、TikTok、Deezer、Amazon Musicなどのグローバルプラットフォームへ音楽を配信します。', zh: '将音乐发行至Spotify、Apple Music、YouTube Music、TikTok、Deezer、Amazon Music等全球平台。' },
      },
      {
        title: { vi: 'Khai thác nội dung có bản quyền', en: 'Copyright Content Exploitation', ko: '저작권 콘텐츠 활용', ja: '著作権コンテンツ活用', zh: '版权内容运营' },
        desc:  { vi: 'Phân phối nội dung có bản quyền thuộc nhiều thể loại (phim truyện, ca nhạc, thiếu nhi, tin tức, thể thao…) trên các nền tảng online và truyền hình.', en: 'Distribute copyrighted content across various genres (movies, music, kids, news, sports…) on online platforms and television.', ko: '영화, 음악, 어린이, 뉴스, 스포츠 등 다양한 장르의 저작권 콘텐츠를 온라인 플랫폼 및 TV에 배포합니다.', ja: '映画、音楽、子供向け、ニュース、スポーツなど様々なジャンルの著作権コンテンツをオンラインプラットフォームやテレビに配信します。', zh: '在在线平台和电视上分发多种类型（电影、音乐、儿童、新闻、体育等）的版权内容。' },
      },
      {
        title: { vi: 'Dịch vụ bản quyền', en: 'Copyright Services', ko: '저작권 서비스', ja: '著作権サービス', zh: '版权服务' },
        desc:  { vi: 'Bảo vệ bản quyền nội dung cho các đối tác trên môi trường số; quản lý bản quyền tác giả âm nhạc.', en: 'Protect digital content copyrights for partners and manage music copyright ownership.', ko: '파트너의 디지털 콘텐츠 저작권을 보호하고 음악 저작권 관리를 수행합니다.', ja: 'パートナーのデジタルコンテンツ著作権を保護し、音楽著作権の管理を行います。', zh: '为合作伙伴保护数字内容版权，管理音乐版权。' },
      },
    ],
  })

  console.log('✅ Đã tạo AboutConfig!')
  await mongoose.disconnect()
}

seed().catch(e => { console.error('❌', e); process.exit(1) })
