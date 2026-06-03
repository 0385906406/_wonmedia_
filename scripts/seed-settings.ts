import { config } from 'dotenv'
config({ path: '.env.local' })
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

const ML = { vi: String, en: String, ko: String, ja: String, zh: String }

const SettingModel = mongoose.models.Setting ||
  mongoose.model('Setting', new mongoose.Schema({
    key: { type: String, unique: true, default: 'global' },
    general: {
      portalName: String, tagline: String, publicDomain: String, systemEmail: String,
    },
    header: {
      navDisplayName: String, faviconUrl: String, logoEn: String, logoVi: String, logoImageUrl: String,
    },
  }, { strict: false, timestamps: true }))

const FooterModel = mongoose.models.FooterConfig ||
  mongoose.model('FooterConfig', new mongoose.Schema({
    key: { type: String, unique: true, default: 'global' },
    companyName: ML,
    navAbout: ML, navServices: ML, navCareers: ML, navBlog: ML, navContact: ML,
    servicesHeading: ML, service1: ML, service2: ML, service3: ML, service4: ML,
    locationHeading: ML, locationCity: ML,
    phoneLabel: ML, emailLabel: ML, legalRepLabel: ML,
    copyright: ML,
  }, { strict: false, timestamps: true }))

// ─── Settings data ─────────────────────────────────────────────────────────────
const SETTINGS = {
  key: 'global',
  general: {
    portalName: 'WonMedia',
    tagline: 'Đơn vị hàng đầu trong lĩnh vực quản lý nội dung số và phát hành âm nhạc tại Việt Nam',
    publicDomain: 'https://wonmedia.vercel.app',
    systemEmail: 'info@wonmedia.com',
  },
  header: {
    navDisplayName: '',
    logoEn: 'Won Media',
    logoVi: 'Won Media',
    faviconUrl: '/logo.png',
    logoImageUrl: '/logo.png',
  },
}

// ─── Footer data (đa ngôn ngữ) ────────────────────────────────────────────────
const FOOTER = {
  key: 'global',
  companyName: {
    vi: 'CÔNG TY TNHH WON MEDIA',
    en: 'WON MEDIA CO., LTD.',
    ko: '원미디어 주식회사',
    ja: 'ウォンメディア株式会社',
    zh: '旺传媒有限公司',
  },
  navAbout: {
    vi: 'Giới thiệu', en: 'About Us', ko: '회사 소개', ja: '会社概要', zh: '关于我们',
  },
  navServices: {
    vi: 'Dịch vụ', en: 'Services', ko: '서비스', ja: 'サービス', zh: '服务',
  },
  navCareers: {
    vi: 'Tuyển dụng', en: 'Careers', ko: '채용', ja: '採用情報', zh: '招聘',
  },
  navBlog: {
    vi: 'Tin tức', en: 'News', ko: '뉴스', ja: 'ニュース', zh: '新闻',
  },
  navContact: {
    vi: 'Liên hệ', en: 'Contact', ko: '연락처', ja: 'お問い合わせ', zh: '联系我们',
  },
  servicesHeading: {
    vi: 'Dịch vụ', en: 'Services', ko: '서비스', ja: 'サービス', zh: '服务',
  },
  service1: {
    vi: 'Phân phối âm nhạc số', en: 'Digital Music Distribution',
    ko: '디지털 음악 배급', ja: 'デジタル音楽配信', zh: '数字音乐发行',
  },
  service2: {
    vi: 'Quản lý bản quyền', en: 'Copyright Management',
    ko: '저작권 관리', ja: '著作権管理', zh: '版权管理',
  },
  service3: {
    vi: 'Marketing âm nhạc', en: 'Music Marketing',
    ko: '음악 마케팅', ja: '音楽マーケティング', zh: '音乐营销',
  },
  service4: {
    vi: 'Sản xuất nội dung', en: 'Content Production',
    ko: '콘텐츠 제작', ja: 'コンテンツ制作', zh: '内容制作',
  },
  locationHeading: {
    vi: 'Trụ sở:', en: 'Headquarters:', ko: '본사:', ja: '本社:', zh: '总部:',
  },
  locationCity: {
    vi: 'HÀ NỘI, VIỆT NAM', en: 'HANOI, VIETNAM',
    ko: '하노이, 베트남', ja: 'ハノイ、ベトナム', zh: '河内，越南',
  },
  phoneLabel: {
    vi: 'Điện thoại:', en: 'Phone:', ko: '전화:', ja: '電話:', zh: '电话:',
  },
  emailLabel: {
    vi: 'Email:', en: 'Email:', ko: '이메일:', ja: 'メール:', zh: '邮箱:',
  },
  legalRepLabel: {
    vi: 'Người đại diện:', en: 'Legal Rep:', ko: '대표자:', ja: '代表者:', zh: '法人代表:',
  },
  copyright: {
    vi: '© 2025 WonMedia. Bảo lưu mọi quyền.',
    en: '© 2025 WonMedia. All rights reserved.',
    ko: '© 2025 WonMedia. 모든 권리 보유.',
    ja: '© 2025 WonMedia. All rights reserved.',
    zh: '© 2025 WonMedia. 保留所有权利。',
  },
}

async function run() {
  await mongoose.connect(MONGODB_URI)
  console.log('[seed-settings] Connected to MongoDB')

  // Upsert settings
  await SettingModel.findOneAndUpdate(
    { key: 'global' },
    { $setOnInsert: SETTINGS },
    { upsert: true, new: true }
  )
  console.log('[seed-settings] ✓ Settings upserted')

  // Upsert footer
  await FooterModel.findOneAndUpdate(
    { key: 'global' },
    { $setOnInsert: FOOTER },
    { upsert: true, new: true }
  )
  console.log('[seed-settings] ✓ Footer upserted')

  console.log('\n✓ Done — settings và footer đã được seed!')
  await mongoose.disconnect()
}

run().catch(e => { console.error(e); process.exit(1) })
