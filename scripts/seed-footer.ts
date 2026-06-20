import { config } from 'dotenv'
config({ path: '.env.local' })
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!
const ML = { vi: String, en: String, ko: String, ja: String, zh: String }

const FooterConfigModel = mongoose.models.FooterConfig ||
  mongoose.model('FooterConfig', new mongoose.Schema({
    key: { type: String, default: 'global', unique: true },
    companyName: ML,
    navAbout: ML, navServices: ML, navCareers: ML, navBlog: ML, navContact: ML,
    servicesHeading: ML, service1: ML, service2: ML, service3: ML, service4: ML,
    locationHeading: ML, locationCity: ML,
    phoneLabel: ML, emailLabel: ML, legalRepLabel: ML,
    copyright: ML,
  }, { strict: false, timestamps: true }))

async function seed() {
  await mongoose.connect(MONGODB_URI)
  console.log('✅ Connected')

  const existing = await FooterConfigModel.findOne({ key: 'global' })
  if (existing && !process.argv.includes('--force')) {
    console.log('ℹ️  FooterConfig đã tồn tại — dùng --force để ghi đè')
    await mongoose.disconnect(); return
  }
  if (existing) { await FooterConfigModel.deleteOne({ key: 'global' }); console.log('⚠️  Ghi đè...') }

  await FooterConfigModel.create({
    key: 'global',
    companyName:     { vi: 'CÔNG TY TNHH WON MEDIA',    en: 'WON MEDIA COMPANY LIMITED', ko: '원미디어 유한책임회사', ja: 'ウォンメディア有限会社', zh: 'WON MEDIA有限责任公司' },
    navAbout:        { vi: 'Giới thiệu',   en: 'About Us',  ko: '소개',     ja: '会社紹介', zh: '关于我们' },
    navServices:     { vi: 'Dịch vụ',      en: 'Services',  ko: '서비스',   ja: 'サービス', zh: '服务' },
    navCareers:      { vi: 'Tuyển dụng',   en: 'Careers',   ko: '채용',     ja: '採用',     zh: '招聘' },
    navBlog:         { vi: 'Blog',          en: 'Blog',      ko: '블로그',   ja: 'ブログ',   zh: '博客' },
    navContact:      { vi: 'Liên hệ',      en: 'Contact',   ko: '문의',     ja: 'お問い合わせ', zh: '联系我们' },
    servicesHeading: { vi: 'Dịch vụ',      en: 'Our Services', ko: '서비스', ja: 'サービス', zh: '我们的服务' },
    service1:        { vi: 'Kinh doanh nội dung trên mạng xã hội', en: 'Content business on social media', ko: '소셜 미디어 콘텐츠 비즈니스', ja: 'ソーシャルメディアコンテンツビジネス', zh: '社交媒体内容业务' },
    service2:        { vi: 'Phân phối âm nhạc', en: 'Music distribution', ko: '음악 배급', ja: '音楽配信', zh: '音乐发行' },
    service3:        { vi: 'Khai thác nội dung có bản quyền', en: 'Licensed-content exploitation', ko: '저작권 콘텐츠 활용', ja: '著作権コンテンツ活用', zh: '版权内容运营' },
    service4:        { vi: 'Bảo vệ bản quyền', en: 'Copyright protection', ko: '저작권 보호', ja: '著作権保護', zh: '版权保护' },
    locationHeading: { vi: 'Trụ sở:', en: 'Headquarter:', ko: '본사:', ja: '本社:', zh: '总部:' },
    locationCity:    { vi: 'HÀ NỘI, VIỆT NAM', en: 'HANOI, VIETNAM', ko: '하노이, 베트남', ja: 'ハノイ、ベトナム', zh: '河内，越南' },
    phoneLabel:      { vi: 'Điện thoại:', en: 'Phone:', ko: '전화:', ja: '電話:', zh: '电话:' },
    emailLabel:      { vi: 'Email:', en: 'Email:', ko: '이메일:', ja: 'メール:', zh: '邮箱:' },
    legalRepLabel:   { vi: 'Người đại diện:', en: 'Legal Representative:', ko: '법인 대표:', ja: '法人代表:', zh: '法人代表:' },
    copyright:       { vi: '© 2023 – 2026 WON MEDIA. Bản quyền thuộc về WON Media.', en: '© 2023 – 2026 WON MEDIA. All rights reserved.', ko: '© 2023 – 2026 WON MEDIA. 모든 권리 보유.', ja: '© 2023 – 2026 WON MEDIA. 全著作権所有。', zh: '© 2023 – 2026 WON MEDIA. 版权所有。' },
    facebookUrl: 'https://www.facebook.com/wonmediavn',
    youtubeUrl:  'https://www.youtube.com/@wonmedia',
    tiktokUrl:   'https://www.tiktok.com/@wonmedia',
  })

  console.log('✅ Đã tạo FooterConfig!')
  await mongoose.disconnect()
}

seed().catch(e => { console.error('❌', e); process.exit(1) })
