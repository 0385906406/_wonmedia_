import { config } from 'dotenv'
config({ path: '.env.local' })
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

// ─── Inline schemas (avoid import issues in scripts) ─────────────────────────
const ML = { vi: String, en: String, ko: String, ja: String, zh: String }

const HeroModel = mongoose.models.HomepageHero ||
  mongoose.model('HomepageHero', new mongoose.Schema({
    key: { type: String, default: 'main', unique: true },
    title: ML, title2: ML, subtitle: ML,
  }, { timestamps: true }))

const ServiceModel = mongoose.models.HomepageService ||
  mongoose.model('HomepageService', new mongoose.Schema({
    order: Number, iconKey: String,
    title: ML, desc: ML, active: { type: Boolean, default: true },
  }, { timestamps: true }))

const AchievementModel = mongoose.models.HomepageAchievement ||
  mongoose.model('HomepageAchievement', new mongoose.Schema({
    order: Number, value: Number, label: ML, active: { type: Boolean, default: true },
  }, { timestamps: true }))

const PartnerModel = mongoose.models.HomepagePartner ||
  mongoose.model('HomepagePartner', new mongoose.Schema({
    order: Number, name: String, logo: String, active: { type: Boolean, default: true },
  }, { timestamps: true }))

const PostModel = mongoose.models.Post ||
  mongoose.model('Post', new mongoose.Schema({
    slug: { type: String, unique: true }, type: String, thumbnail: String,
    date: String, showOnHomepage: Boolean,
    category: ML, title: ML, excerpt: ML, content: ML,
    active: { type: Boolean, default: true },
  }, { timestamps: true }))

// ─── Seed data ────────────────────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(MONGODB_URI)
  console.log('✅ Connected to MongoDB')

  // Hero
  const heroCount = await HeroModel.countDocuments()
  if (!heroCount) {
    await HeroModel.create({
      key: 'main',
      title:    { vi: 'BRINGING MUSIC', en: 'BRINGING MUSIC', ko: 'BRINGING MUSIC', ja: 'BRINGING MUSIC', zh: 'BRINGING MUSIC' },
      title2:   { vi: 'TO THE WORLD',   en: 'TO THE WORLD',   ko: 'TO THE WORLD',   ja: 'TO THE WORLD',   zh: 'TO THE WORLD' },
      subtitle: {
        vi: 'WON Media – Đơn vị phát hành âm nhạc & khai thác bản quyền hàng đầu Việt Nam.',
        en: 'WON Media – Vietnam\'s leading music distribution & copyright management company.',
        ko: 'WON Media – 베트남 최고의 음악 배급 및 저작권 관리 회사.',
        ja: 'WON Media – ベトナムを代表する音楽配信・著作権管理会社。',
        zh: 'WON Media – 越南领先的音乐发行与版权管理公司。',
      },
    })
    console.log('✅ Hero seeded')
  }

  // Services
  const svcCount = await ServiceModel.countDocuments()
  if (!svcCount) {
    const services = [
      {
        order: 0, iconKey: 'play',
        title:   { vi: 'Kinh doanh trên mạng xã hội', en: 'Social Media Business', ko: '소셜 미디어 비즈니스', ja: 'ソーシャルメディアビジネス', zh: '社交媒体业务' },
        desc:    { vi: 'WON Media là đối tác chính thức của YouTube, Facebook và TikTok tại Việt Nam. Chúng tôi cung cấp dịch vụ marketing và xây dựng kênh MXH cho nghệ sĩ, doanh nghiệp trong và ngoài nước.', en: 'WON Media is an official partner of YouTube, Facebook, and TikTok in Vietnam. We provide marketing services and build strong social media channels for artists and businesses worldwide.', ko: 'WON Media는 베트남의 YouTube, Facebook, TikTok 공식 파트너입니다.', ja: 'WON MediaはベトナムのYouTube、Facebook、TikTokの公式パートナーです。', zh: 'WON Media是越南YouTube、Facebook和TikTok的官方合作伙伴。' },
      },
      {
        order: 1, iconKey: 'music',
        title:   { vi: 'Phát hành âm nhạc', en: 'Music Distribution', ko: '음악 배급', ja: '音楽配信', zh: '音乐发行' },
        desc:    { vi: 'Triển khai phát hành nhạc tới các nền tảng toàn cầu như Spotify, Apple Music, YouTube Music, Facebook, TikTok, Deezer, Amazon Music, v.v.', en: 'Distribute music to global platforms such as Spotify, Apple Music, YouTube Music, Facebook, TikTok, Deezer, Amazon Music, and more.', ko: 'Spotify, Apple Music 등 글로벌 플랫폼에 음악을 배급합니다.', ja: 'Spotify、Apple Musicなどのグローバルプラットフォームへ音楽を配信します。', zh: '向Spotify、Apple Music等全球平台发行音乐。' },
      },
      {
        order: 2, iconKey: 'youtube',
        title:   { vi: 'Khai thác nội dung bản quyền', en: 'Copyright Content Exploitation', ko: '저작권 콘텐츠 활용', ja: '著作権コンテンツ活用', zh: '版权内容开发' },
        desc:    { vi: 'Phân phối nội dung có bản quyền thuộc nhiều thể loại (phim truyện, ca nhạc, thiếu nhi, tin tức, thể thao…) trên các nền tảng online và truyền hình.', en: 'Distribute copyrighted content across various genres (movies, music, kids, news, sports…) on online platforms and television.', ko: '영화, 음악 등 다양한 장르의 저작권 콘텐츠를 배급합니다.', ja: '映画、音楽など様々なジャンルの著作権コンテンツを配信します。', zh: '分发各类版权内容（电影、音乐、儿童、新闻、体育…）。' },
      },
      {
        order: 3, iconKey: 'shield',
        title:   { vi: 'Dịch vụ bản quyền', en: 'Copyright Services', ko: '저작권 서비스', ja: '著作権サービス', zh: '版权服务' },
        desc:    { vi: 'Bảo vệ bản quyền nội dung cho các đối tác trên môi trường số; quản lý bản quyền tác giả âm nhạc.', en: 'Protect digital content copyrights for partners and manage music copyright ownership in the digital environment.', ko: '디지털 환경에서 파트너의 콘텐츠 저작권을 보호하고 음악 저작권을 관리합니다.', ja: 'デジタル環境でパートナーのコンテンツ著作権を保護し、音楽著作権を管理します。', zh: '在数字环境中保护合作伙伴的内容版权，管理音乐版权。' },
      },
    ]
    await ServiceModel.insertMany(services)
    console.log('✅ Services seeded')
  }

  // Achievements
  const achCount = await AchievementModel.countDocuments()
  if (!achCount) {
    const achievements = [
      { order: 0, value: 150, label: { vi: 'Đối tác', en: 'Partners', ko: '파트너', ja: 'パートナー', zh: '合作伙伴' } },
      { order: 1, value: 25,  label: { vi: 'Nút vàng', en: 'Gold Buttons', ko: '골든 버튼', ja: 'ゴールドボタン', zh: '金牌按钮' } },
      { order: 2, value: 100, label: { vi: 'Nút bạc YouTube', en: 'Silver YouTube Buttons', ko: '실버 유튜브 버튼', ja: 'シルバーYouTubeボタン', zh: '银牌YouTube按钮' } },
      { order: 3, value: 250, label: { vi: 'Kênh trong hệ thống', en: 'Channels in System', ko: '시스템 내 채널', ja: 'システム内チャンネル', zh: '系统内频道' } },
    ]
    await AchievementModel.insertMany(achievements)
    console.log('✅ Achievements seeded')
  }

  // Partners
  const partnerCount = await PartnerModel.countDocuments()
  if (!partnerCount) {
    const partners = [
      { order: 0, name: 'YouTube',    logo: '/partners/youtube.png' },
      { order: 1, name: 'Facebook',   logo: '/partners/facebook.png' },
      { order: 2, name: 'Instagram',  logo: '/partners/instagram.png' },
      { order: 3, name: 'TikTok',     logo: '/partners/tiktok.png' },
      { order: 4, name: 'Spotify',    logo: '/partners/spotify.png' },
      { order: 5, name: 'Apple Music',logo: '/partners/apple-music.png' },
      { order: 6, name: 'VTV',        logo: '/partners/vtv.png' },
      { order: 7, name: 'VOV',        logo: '/partners/vov.png' },
      { order: 8, name: 'VTVcab',     logo: '/partners/vtvcab.png' },
      { order: 9, name: 'VTV News',   logo: '/partners/vtv-news.png' },
    ]
    await PartnerModel.insertMany(partners)
    console.log('✅ Partners seeded')
  }

  // Posts
  const postCount = await PostModel.countDocuments()
  if (!postCount) {
    const posts = [
      {
        slug: 'recap-year-end-party-2025', type: 'blog',
        thumbnail: '/posts/recap-yep-2025.jpg', date: '15/06/2025', showOnHomepage: true,
        category: { vi: 'Sự kiện', en: 'Events', ko: '이벤트', ja: 'イベント', zh: '活动' },
        title: { vi: 'Recap Year End Party WON Media 2025', en: 'Recap Year End Party WON Media 2025', ko: 'WON Media 2025 연말파티 리캡', ja: 'WON Media 2025年末パーティーリキャップ', zh: 'WON Media 2025年终派对回顾' },
        excerpt: { vi: 'Nhìn lại những khoảnh khắc đáng nhớ tại buổi tiệc cuối năm WON Media 2025.', en: 'Looking back at the memorable moments at WON Media Year End Party 2025.', ko: 'WON Media 2025 연말파티의 기억에 남는 순간들을 돌아봅니다.', ja: 'WON Media 2025年末パーティーの記念すべき瞬間を振り返ります。', zh: '回顾WON Media 2025年终派对的难忘时刻。' },
        content: { vi: '', en: '', ko: '', ja: '', zh: '' },
      },
      {
        slug: 'women-day-won-media-2025', type: 'blog',
        thumbnail: '/posts/women-day-won-media.jpg', date: '08/03/2025', showOnHomepage: true,
        category: { vi: 'Nội bộ', en: 'Internal', ko: '내부', ja: '社内', zh: '内部' },
        title: { vi: 'Ngày Quốc tế Phụ nữ tại WON Media 2025', en: "International Women's Day at WON Media 2025", ko: 'WON Media 2025 세계 여성의 날', ja: 'WON Media 2025国際女性デー', zh: 'WON Media 2025国际妇女节' },
        excerpt: { vi: 'WON Media tri ân và tôn vinh những người phụ nữ tài năng trong đội ngũ nhân sự.', en: 'WON Media honors and celebrates talented women in its workforce on March 8th.', ko: 'WON Media는 3월 8일 인재 여성들을 기념합니다.', ja: 'WON Mediaは3月8日に才能ある女性スタッフを称えます。', zh: 'WON Media于三月八日向公司中的优秀女性员工表示敬意。' },
        content: { vi: '', en: '', ko: '', ja: '', zh: '' },
      },
      {
        slug: 'year-end-party-2024', type: 'blog',
        thumbnail: '/posts/year-end-party-won-media.jpg', date: '20/12/2024', showOnHomepage: true,
        category: { vi: 'Sự kiện', en: 'Events', ko: '이벤트', ja: 'イベント', zh: '活动' },
        title: { vi: 'Year End Party WON Media 2024', en: 'Year End Party WON Media 2024', ko: 'WON Media 2024 연말파티', ja: 'WON Media 2024年末パーティー', zh: 'WON Media 2024年终派对' },
        excerpt: { vi: 'Bữa tiệc cuối năm rực rỡ cùng toàn thể đội ngũ WON Media.', en: 'A brilliant year-end party with the entire WON Media team.', ko: 'WON Media 전체 팀과 함께한 멋진 연말파티.', ja: 'WON Media全チームとの華やかな年末パーティー。', zh: '与WON Media全体团队共度精彩年终派对。' },
        content: { vi: '', en: '', ko: '', ja: '', zh: '' },
      },
      {
        slug: 'tuyen-dung-2026', type: 'tuyen-dung',
        thumbnail: '/posts/post_1.png', date: '01/01/2026', showOnHomepage: true,
        category: { vi: 'Tuyển dụng', en: 'Careers', ko: '채용', ja: '採用情報', zh: '招聘' },
        title: { vi: 'Tuyển dụng nhân sự WON Media 2026', en: 'WON Media Hiring 2026', ko: 'WON Media 2026 채용', ja: 'WON Media 2026採用情報', zh: 'WON Media 2026招聘' },
        excerpt: { vi: 'WON Media đang tìm kiếm những nhân tài mới để cùng phát triển.', en: 'WON Media is looking for new talent to grow together.', ko: 'WON Media는 함께 성장할 새로운 인재를 찾고 있습니다.', ja: 'WON Mediaは共に成長する新しい人材を募集しています。', zh: 'WON Media正在寻找共同发展的新人才。' },
        content: { vi: '', en: '', ko: '', ja: '', zh: '' },
      },
    ]
    await PostModel.insertMany(posts)
    console.log('✅ Posts seeded')
  }

  console.log('\n🎉 Homepage seed complete!')
  await mongoose.disconnect()
}

seed().catch((err) => { console.error(err); process.exit(1) })
