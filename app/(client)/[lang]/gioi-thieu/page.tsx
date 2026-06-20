import { notFound } from 'next/navigation'
import { hasLocale } from '../dictionaries'
import { AboutClient, type AboutT } from '@/components/client/about/AboutClient'
import type { LocaleKey } from '@/types/multilang'
import { connectDB } from '@/lib/mongodb'
import AboutConfig from '@/models/AboutConfig'
import type { Metadata } from 'next'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://wonmedia.vn'

const SEO_ABOUT: Record<LocaleKey, { title: string; desc: string }> = {
  vi: { title: 'Về chúng tôi – WON Media',     desc: 'Tìm hiểu về WON Media – đơn vị truyền thông sáng tạo, chuyên nghiệp hàng đầu tại Việt Nam.' },
  en: { title: 'About Us – WON Media',          desc: 'Learn about WON Media – a leading creative and professional media company in Vietnam.' },
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const lk = lang as LocaleKey
  const { title, desc } = SEO_ABOUT[lk]
  const url = `${SITE}/${lang}/gioi-thieu`
  return {
    title,
    description: desc,
    alternates: {
      canonical: url,
      languages: { vi: `${SITE}/vi/gioi-thieu`, en: `${SITE}/en/gioi-thieu`, ko: `${SITE}/ko/gioi-thieu`, ja: `${SITE}/ja/gioi-thieu`, zh: `${SITE}/zh/gioi-thieu` },
    },
    openGraph: { title, description: desc, url, type: 'website', siteName: 'WON Media', locale: lk },
    twitter: { card: 'summary_large_image', title, description: desc },
  }
}

type Cfg = Record<string, unknown>

function ml(cfg: Cfg, key: string, lang: string): string {
  const field = cfg[key] as Record<string, string> | undefined
  return field?.[lang] || field?.['vi'] || ''
}

function mlArr<T>(cfg: Cfg, key: string): T[] {
  const v = cfg[key]
  return Array.isArray(v) && v.length > 0 ? (v as T[]) : []
}

type L = Record<string, string>
const t = (vi: string, en: string, ko?: string, ja?: string, zh?: string): L => ({ vi, en, ...(ko ? { ko } : {}), ...(ja ? { ja } : {}), ...(zh ? { zh } : {}) })

const FALLBACK_WHY = [
  {
    title: t('Đội ngũ chuyên nghiệp','Professional Team','전문 팀','プロフェッショナルチーム','专业团队'),
    desc:  t(
      'Hơn 30 chuyên gia âm nhạc, công nghệ và pháp lý với nhiều năm kinh nghiệm trong ngành công nghiệp âm nhạc số tại Việt Nam và quốc tế.',
      'Over 30 music, technology and legal experts with years of experience in the digital music industry in Vietnam and internationally.',
      '베트남과 해외 디지털 음악 산업에서 수년간의 경험을 보유한 30명 이상의 음악, 기술, 법률 전문가.',
      'ベトナムと国際的なデジタル音楽業界で長年の経験を持つ、音楽・技術・法律の専門家30名以上が在籍。',
      '拥有30余名音乐、技术和法律专家，在越南及国际数字音乐行业拥有多年丰富经验。',
    ),
  },
  {
    title: t('Công nghệ tiên tiến','Advanced Technology','첨단 기술','先進技術','先进技术'),
    desc:  t(
      'Hệ thống quản lý bản quyền và phân phối âm nhạc được xây dựng trên nền tảng AI, cho phép theo dõi doanh thu và bảo vệ nội dung theo thời gian thực.',
      'AI-powered copyright management and music distribution system enabling real-time revenue tracking and content protection.',
      'AI 기반 저작권 관리 및 음악 배급 시스템으로 실시간 수익 추적 및 콘텐츠 보호가 가능합니다.',
      'AIを基盤とした著作権管理・音楽配信システムにより、リアルタイムでの収益追跡とコンテンツ保護を実現。',
      '基于AI构建的版权管理与音乐发行系统，实现实时收益追踪与内容保护。',
    ),
  },
  {
    title: t('Tận tâm với nghệ sĩ','Dedicated to Artists','아티스트 전념','アーティストへの献身','专注于艺术家'),
    desc:  t(
      'Chúng tôi đặt lợi ích của nghệ sĩ lên hàng đầu — minh bạch về doanh thu, hỗ trợ tận tình và luôn sẵn sàng đồng hành trong mọi giai đoạn sự nghiệp.',
      'We put artists first — transparent revenue sharing, dedicated support, and always ready to accompany you at every stage of your career.',
      '우리는 아티스트를 최우선으로 생각합니다 — 투명한 수익 배분, 헌신적인 지원, 경력의 모든 단계에서 동반.',
      'アーティストを最優先に — 透明な収益分配、献身的なサポート、キャリアのあらゆる段階で寄り添います。',
      '我们将艺术家利益放在首位——透明的收益分配、贴心的支持，始终陪伴您职业生涯的每个阶段。',
    ),
  },
  {
    title: t('Mạng lưới toàn cầu','Global Network','글로벌 네트워크','グローバルネットワーク','全球网络'),
    desc:  t(
      'Quan hệ đối tác chiến lược với hơn 150 nền tảng phân phối âm nhạc số trên toàn thế giới, đảm bảo âm nhạc của bạn tiếp cận hàng tỷ người nghe.',
      'Strategic partnerships with over 150 digital music distribution platforms worldwide, ensuring your music reaches billions of listeners.',
      '전 세계 150개 이상의 디지털 음악 배급 플랫폼과 전략적 파트너십을 통해 수십억 명의 청취자에게 음악을 전달.',
      '世界150以上のデジタル音楽配信プラットフォームと戦略的パートナーシップを結び、何十億人ものリスナーへ届けます。',
      '与全球150余个数字音乐发行平台建立战略合作关系，确保您的音乐触达数十亿听众。',
    ),
  },
  {
    title: t('Minh bạch doanh thu','Revenue Transparency','수익 투명성','収益の透明性','收益透明'),
    desc:  t(
      'Báo cáo doanh thu chi tiết theo thời gian thực, phân tích từng nền tảng, từng khu vực địa lý — nghệ sĩ luôn nắm rõ từng đồng doanh thu của mình.',
      'Real-time detailed revenue reports broken down by platform and region — artists always know exactly where every dollar comes from.',
      '플랫폼 및 지역별로 세분화된 실시간 상세 수익 보고서 — 아티스트는 항상 모든 수익을 정확히 파악할 수 있습니다.',
      'プラットフォームや地域ごとに細分化されたリアルタイムの詳細収益レポート — アーティストは常に全収益を把握できます。',
      '按平台和地区细分的实时详细收益报告——艺术家始终清晰掌握每一笔收益的来源。',
    ),
  },
  {
    title: t('Hỗ trợ 24/7','24/7 Support','24/7 지원','24時間サポート','全天候支持'),
    desc:  t(
      'Đội ngũ hỗ trợ luôn sẵn sàng 24/7 qua chat, email và hotline, giải quyết mọi vấn đề phát sinh nhanh chóng và chuyên nghiệp.',
      'Support team available 24/7 via chat, email and hotline, resolving any issues quickly and professionally.',
      '채팅, 이메일, 핫라인을 통해 24/7 대기 중인 지원팀이 모든 문제를 신속하고 전문적으로 해결합니다.',
      'チャット・メール・ホットラインで24時間365日対応のサポートチームが、あらゆる問題を迅速かつプロフェッショナルに解決します。',
      '支持团队全天候通过聊天、邮件和热线随时待命，迅速专业地解决一切问题。',
    ),
  },
]

function getFallbackAbout(lang: LocaleKey): AboutT {
  const l = (o: L) => o[lang] || o.vi
  return {
    banner: {
      subtitle: l(t('Về chúng tôi','About Us','회사 소개','会社概要','关于我们')),
      title: 'WON MEDIA',
    },
    about: {
      label:          l(t('Giới thiệu','About','소개','紹介','关于')),
      titleLine1:     l(t('Đơn vị phát hành âm nhạc','Music Distribution Company','음악 배급사','音楽配信会社','音乐发行公司')),
      titleHighlight: l(t('hàng đầu Việt Nam','Leading in Vietnam','베트남 최고','ベトナムNo.1','越南领先')),
      description1: {
        prefix: l(t('Thành lập từ năm','Founded in','설립 연도','設立年','成立于')),
        year:   '2023',
        suffix: l(t(
          ', WON Media là đơn vị tiên phong trong lĩnh vực phát hành âm nhạc số và khai thác bản quyền tại Việt Nam.',
          ', WON Media is a pioneer in digital music distribution and copyright management in Vietnam.',
          ', WON Media는 베트남의 디지털 음악 배급 및 저작권 관리 분야의 선구자입니다.',
          ', WON Mediaはベトナムのデジタル音楽配信と著作権管理のパイオニアです。',
          '，WON Media是越南数字音乐发行和版权管理领域的先驱。',
        )),
      },
      description2: l(t(
        'Chúng tôi đồng hành cùng hàng trăm nghệ sĩ trong hành trình đưa âm nhạc Việt Nam vươn ra thế giới qua hơn 150 nền tảng số toàn cầu.',
        'We accompany hundreds of artists in bringing Vietnamese music to the world through 150+ global digital platforms.',
        '우리는 수백 명의 아티스트와 함께 150개 이상의 글로벌 디지털 플랫폼을 통해 베트남 음악을 세계로 알리고 있습니다.',
        '私たちは何百人ものアーティストとともに、150以上のグローバルデジタルプラットフォームを通じてベトナム音楽を世界へ届けています。',
        '我们与数百位艺术家携手，通过150余个全球数字平台将越南音乐传播到世界各地。',
      )),
      experience: {
        value: '2+',
        text:  l(t('Năm kinh nghiệm','Years of experience','년 경력','年の経験','年经验')),
      },
      button: l(t('Khám phá dịch vụ','Explore Services','서비스 탐색','サービスを見る','探索服务')),
    },
    timeline: {
      heading: l(t('Hành trình phát triển','Our Journey','발전 여정','成長の軌跡','发展历程')),
      milestones: [
        { title: l(t('Thành lập WON Media','WON Media Founded','WON Media 설립','WON Media設立','WON Media成立')),           content: [l(t('Ra mắt với đội ngũ sáng lập 10 người','Launched with 10 founding members','창립 멤버 10명으로 출범','創業メンバー10名でスタート','以10名创始成员启动')), l(t('Ký kết hợp tác với 3 nền tảng số đầu tiên','Signed partnerships with 3 first digital platforms','첫 3개 디지털 플랫폼과 계약','最初の3つのデジタルプラットフォームと提携','与首批3个数字平台签署合作'))] },
        { title: l(t('Mở rộng đối tác quốc tế','International Expansion','국제 파트너 확장','国際パートナー拡大','国际合作扩张')),    content: [l(t('Hợp tác YouTube Content ID','YouTube Content ID partnership','YouTube Content ID 파트너십','YouTube Content IDとの提携','YouTube Content ID合作')), l(t('Phát hành trên 50+ DSP toàn cầu','Distribution on 50+ global DSPs','50개 이상 글로벌 DSP 배급','50以上のグローバルDSPで配信','在50+个全球DSP发行'))] },
        { title: l(t('Ra mắt dịch vụ bản quyền','Copyright Service Launch','저작권 서비스 출시','著作権サービス開始','版权服务上线')),    content: [l(t('Hệ thống khai thác bản quyền tự động','Automated copyright management system','자동 저작권 관리 시스템','自動著作権管理システム','自动版权管理系统')), l(t('Bảo vệ 10.000+ tác phẩm','Protecting 10,000+ works','10,000개 이상 작품 보호','1万作品以上を保護','保护10,000余部作品'))] },
        { title: l(t('Cộng đồng nghệ sĩ','Artist Community','아티스트 커뮤니티','アーティストコミュニティ','艺术家社区')),           content: [l(t('Đồng hành 200+ nghệ sĩ độc lập','Partnering with 200+ indie artists','200명 이상 인디 아티스트 파트너','200以上のインディーアーティストと提携','与200+独立艺术家合作')), l(t('Mở rộng thị trường Hàn & Nhật','Expanding to Korean & Japanese markets','한국 & 일본 시장 진출','韓国・日本市場への進出','拓展韩日市场'))] },
        { title: l(t('Nền tảng quản lý nghệ sĩ','Artist Management Platform','아티스트 관리 플랫폼','アーティスト管理プラットフォーム','艺术家管理平台')),  content: [l(t('Portal quản lý doanh thu số','Digital revenue management portal','디지털 수익 관리 포털','デジタル収益管理ポータル','数字收益管理平台')), l(t('Báo cáo thời gian thực','Real-time reporting','실시간 보고','リアルタイムレポート','实时报告'))] },
        { title: l(t('Tầm nhìn 2026','Vision 2026','2026 비전','2026年のビジョン','2026愿景')),                               content: [l(t('Top 3 đơn vị phát hành ĐNÁ','Top 3 distributor in SEA','동남아 상위 3개 배급사','東南アジアトップ3のディストリビューター','东南亚前三大发行商')), l(t('200+ thị trường toàn cầu','200+ global markets','200개 이상 글로벌 시장','200以上のグローバル市場','200+个全球市场'))] },
      ],
    },
    whyUs: {
      heading: l(t('Tại sao chọn WON Media','Why Choose WON Media','왜 WON Media인가','なぜWON Mediaを選ぶのか','为何选择WON Media')),
      reasons: FALLBACK_WHY.map(r => ({ title: l(r.title), desc: l(r.desc) })),
    },
    services: {
      heading: l(t('Dịch vụ của chúng tôi','Our Services','서비스','サービス','我们的服务')),
      items: [
        { title: l(t('Phát hành âm nhạc số','Digital Music Distribution','디지털 음악 배급','デジタル音楽配信','数字音乐发行')), desc: l(t('Đưa âm nhạc lên 150+ nền tảng toàn cầu chỉ trong 24–48 giờ.','Distribute your music to 150+ global platforms in just 24–48 hours.','24~48시간 내에 150개 이상의 글로벌 플랫폼에 음악을 배급.','24〜48時間以内に150以上のグローバルプラットフォームへ配信。','在24-48小时内将音乐发行至150余个全球平台。')) },
        { title: l(t('Khai thác bản quyền','Copyright Monetization','저작권 수익화','著作権収益化','版权变现')),             desc: l(t('Content ID tự động thu hồi doanh thu trên YouTube và các nền tảng số.','Automatically claim revenue on YouTube and digital platforms via Content ID.','Content ID로 YouTube 및 디지털 플랫폼에서 자동 수익 청구.','Content IDでYouTubeおよびデジタルプラットフォームの収益を自動請求。','通过Content ID自动在YouTube及数字平台索取收益。')) },
        { title: l(t('Quản lý nghệ sĩ','Artist Management','아티스트 매니지먼트','アーティストマネジメント','艺术家管理')),        desc: l(t('Chiến lược thương hiệu, kế hoạch phát hành, phân tích dữ liệu toàn diện.','Brand strategy, release planning, and comprehensive data analytics.','브랜드 전략, 출시 계획, 포괄적인 데이터 분석.','ブランド戦略、リリース計画、包括的なデータ分析。','品牌战略、发行计划与全面的数据分析。')) },
        { title: l(t('Tư vấn bản quyền','Copyright Consulting','저작권 컨설팅','著作権コンサルティング','版权咨询')),           desc: l(t('Đội ngũ pháp lý tư vấn sở hữu trí tuệ và tranh chấp bản quyền quốc tế.','Legal team advising on intellectual property and international copyright disputes.','지식재산권 및 국제 저작권 분쟁 자문 법률팀.','知的財産権と国際著作権紛争を専門とする法律チーム。','专注于知识产权及国际版权纠纷的法律顾问团队。')) },
      ],
    },
  }
}

async function loadAbout(lang: LocaleKey): Promise<AboutT> {
  try {
    await connectDB()
    const raw = await AboutConfig.findOne({ key: 'global' }).lean()
    const c = (raw ?? {}) as Cfg

    type MilestoneRaw = { title: Record<string,string>; line1: Record<string,string>; line2: Record<string,string> }
    type ReasonRaw    = { title: Record<string,string>; desc:  Record<string,string> }

    const milestones = mlArr<MilestoneRaw>(c, 'timelineMilestones').map(m => ({
      title:   m.title?.[lang]   || m.title?.vi   || '',
      content: [
        m.line1?.[lang] || m.line1?.vi || '',
        m.line2?.[lang] || m.line2?.vi || '',
      ] as [string, string],
    }))

    const reasons = mlArr<ReasonRaw>(c, 'whyUsReasons').map(r => ({
      title: r.title?.[lang] || r.title?.vi || '',
      desc:  r.desc?.[lang]  || r.desc?.vi  || '',
    }))

    const services = mlArr<ReasonRaw>(c, 'servicesItems').map(s => ({
      title: s.title?.[lang] || s.title?.vi || '',
      desc:  s.desc?.[lang]  || s.desc?.vi  || '',
    }))

    return {
      banner: {
        subtitle: ml(c, 'bannerSubtitle', lang),
        title:    ml(c, 'bannerTitle',    lang),
      },
      about: {
        label:          ml(c, 'aboutLabel',          lang),
        titleLine1:     ml(c, 'aboutTitleLine1',     lang),
        titleHighlight: ml(c, 'aboutTitleHighlight', lang),
        description1: {
          prefix: ml(c, 'aboutDesc1Prefix', lang),
          year:   ml(c, 'aboutDesc1Year',   lang),
          suffix: ml(c, 'aboutDesc1Suffix', lang),
        },
        description2: ml(c, 'aboutDesc2',   lang),
        experience: {
          value: ml(c, 'aboutExpValue', lang),
          text:  ml(c, 'aboutExpText',  lang),
        },
        button: ml(c, 'aboutButton', lang),
      },
      timeline: { heading: ml(c, 'timelineHeading', lang), milestones },
      whyUs:    { heading: ml(c, 'whyUsHeading',    lang), reasons   },
      services: { heading: ml(c, 'servicesHeading', lang), items: services },
    }
  } catch {
    return getFallbackAbout(lang)
  }
}

export default async function GioiThieuPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const t = await loadAbout(lang as LocaleKey)
  return <AboutClient t={t} lang={lang} />
}
