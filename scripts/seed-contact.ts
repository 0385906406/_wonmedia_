import { config } from 'dotenv'
config({ path: '.env.local' })
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!
const ML = { vi: String, en: String, ko: String, ja: String, zh: String }

const ContactConfigModel = mongoose.models.ContactConfig ||
  mongoose.model('ContactConfig', new mongoose.Schema({
    key: { type: String, default: 'global', unique: true },
    bannerSubtitle: ML, bannerTitle: ML,
    address: ML, phone: String, hotline: String,
    email: String, zalo: String,
    googleMapsUrl: String, googleMapsEmbed: String,
    formTitle: ML, formSubtitle: ML,
  }, { strict: false, timestamps: true }))

async function seed() {
  await mongoose.connect(MONGODB_URI)
  console.log('✅ Connected to MongoDB')

  const existing = await ContactConfigModel.findOne({ key: 'global' })
  if (existing && !process.argv.includes('--force')) {
    console.log('ℹ️  ContactConfig đã tồn tại — dùng --force để ghi đè')
    await mongoose.disconnect(); return
  }
  if (existing) { await ContactConfigModel.deleteOne({ key: 'global' }); console.log('⚠️  Ghi đè...') }

  await ContactConfigModel.create({
    key: 'global',
    bannerSubtitle: { vi: 'Kết nối & Tư vấn dịch vụ', en: 'Service Connection & Consulting', ko: '서비스 연결 및 상담', ja: 'サービス接続・コンサルティング', zh: '服务连接与咨询' },
    bannerTitle:    { vi: 'LIÊN HỆ VỚI CHÚNG TÔI', en: 'CONTACT US', ko: '문의하기', ja: 'お問い合わせ', zh: '联系我们' },
    address: {
      vi: 'Tầng 2 tòa nhà Audi, số 8 đường Phạm Hùng, Phường Yên Hòa, Thành phố Hà Nội, Việt Nam.',
      en: '2nd Floor, Audi Building, No. 8 Pham Hung Street, Yen Hoa Ward, Ha Noi City, Vietnam.',
      ko: '베트남 하노이시 옌호아 8 팜훙 거리, 아우디 빌딩 2층.',
      ja: 'ベトナム・ハノイ市イェンホア区ファムフン通り8番地、アウディビル2階。',
      zh: '越南河内市燕和坊范雄街8号奥迪大厦2楼。',
    },
    phone:           '0347835103',
    hotline:         '0347835103',
    email:           'duongnv10504@gmail.com',
    zalo:            '0347835103',
    googleMapsUrl:   'https://maps.app.goo.gl/DqaY4ULEUoSxgYi8A',
    googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.0965800432!2d105.78148157597976!3d21.028234088625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab5967da8865%3A0x86cbf64e9a0d0b7f!2sPham%20Hung%2C%20Me%20Tri%2C%20Nam%20Tu%20Liem!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s',
    formTitle:    { vi: 'Gửi tin nhắn cho chúng tôi', en: 'Get in touch with us', ko: '메시지 보내기', ja: 'メッセージを送る', zh: '给我们发消息' },
    formSubtitle: { vi: "Đừng ngần ngại liên hệ! Chúng tôi luôn sẵn sàng lắng nghe và hợp tác cùng bạn.", en: "Don't hesitate to reach out! We are always ready to listen and collaborate.", ko: "망설이지 마세요! 언제든지 연락 주시면 성심껏 도와드리겠습니다.", ja: "遠慮なくご連絡ください！いつでもご相談をお待ちしています。", zh: "请随时联系我们！我们随时准备倾听和合作。" },
  })

  console.log('✅ Đã tạo ContactConfig!')
  await mongoose.disconnect()
}

seed().catch(e => { console.error('❌', e); process.exit(1) })
