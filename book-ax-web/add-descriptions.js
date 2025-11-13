#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const descriptions = {
  de: {
    bestPriceGuaranteeDesc: "Finden Sie die besten Preise oder wir erstatten die Differenz",
    noCreditCardFeesDesc: "Keine versteckten Gebühren, zahlen Sie genau das, was Sie sehen",
    freeChangesCancellationDesc: "Flexible Buchung mit kostenloser Stornierung"
  },
  en: {
    bestPriceGuaranteeDesc: "Find the best prices or we'll refund the difference",
    noCreditCardFeesDesc: "No hidden fees, pay exactly what you see",
    freeChangesCancellationDesc: "Flexible booking with free cancellation"
  },
  es: {
    bestPriceGuaranteeDesc: "Encuentra los mejores precios o te devolvemos la diferencia",
    noCreditCardFeesDesc: "Sin tarifas ocultas, paga exactamente lo que ves",
    freeChangesCancellationDesc: "Reserva flexible con cancelación gratuita"
  },
  fr: {
    bestPriceGuaranteeDesc: "Trouvez les meilleurs prix ou nous remboursons la différence",
    noCreditCardFeesDesc: "Pas de frais cachés, payez exactement ce que vous voyez",
    freeChangesCancellationDesc: "Réservation flexible avec annulation gratuite"
  },
  tr: {
    bestPriceGuaranteeDesc: "En iyi fiyatları bulun veya farkı iade ederiz",
    noCreditCardFeesDesc: "Gizli ücret yok, gördüğünüz fiyatı ödersiniz",
    freeChangesCancellationDesc: "Ücretsiz iptal ile esnek rezervasyon"
  },
  ru: {
    bestPriceGuaranteeDesc: "Найдите лучшие цены или мы вернем разницу",
    noCreditCardFeesDesc: "Никаких скрытых комиссий, платите только то, что видите",
    freeChangesCancellationDesc: "Гибкое бронирование с бесплатной отменой"
  },
  zh: {
    bestPriceGuaranteeDesc: "找到最优惠的价格，否则我们将退还差价",
    noCreditCardFeesDesc: "没有隐藏费用，所见即所付",
    freeChangesCancellationDesc: "灵活预订，免费取消"
  },
  hi: {
    bestPriceGuaranteeDesc: "सर्वोत्तम मूल्य खोजें या हम अंतर वापस करेंगे",
    noCreditCardFeesDesc: "कोई छिपी हुई फीस नहीं, जो देखें वही भुगतान करें",
    freeChangesCancellationDesc: "निःशुल्क रद्दीकरण के साथ लचीली बुकिंग"
  },
  ar: {
    bestPriceGuaranteeDesc: "اعثر على أفضل الأسعار أو سنرد الفرق",
    noCreditCardFeesDesc: "لا توجد رسوم مخفية، ادفع بالضبط ما تراه",
    freeChangesCancellationDesc: "حجز مرن مع إلغاء مجاني"
  },
  it: {
    bestPriceGuaranteeDesc: "Trova i migliori prezzi o rimborsiamo la differenza",
    noCreditCardFeesDesc: "Nessun costo nascosto, paghi esattamente quello che vedi",
    freeChangesCancellationDesc: "Prenotazione flessibile con cancellazione gratuita"
  },
  ja: {
    bestPriceGuaranteeDesc: "最安値を見つけるか、差額を返金します",
    noCreditCardFeesDesc: "隠れた手数料なし、表示価格のみお支払い",
    freeChangesCancellationDesc: "無料キャンセル可能な柔軟な予約"
  },
  ko: {
    bestPriceGuaranteeDesc: "최저 가격을 찾거나 차액을 환불해 드립니다",
    noCreditCardFeesDesc: "숨겨진 수수료 없이 표시된 가격만 지불",
    freeChangesCancellationDesc: "무료 취소 가능한 유연한 예약"
  },
  pt: {
    bestPriceGuaranteeDesc: "Encontre os melhores preços ou reembolsamos a diferença",
    noCreditCardFeesDesc: "Sem taxas ocultas, pague exatamente o que vê",
    freeChangesCancellationDesc: "Reserva flexível com cancelamento gratuito"
  },
  nl: {
    bestPriceGuaranteeDesc: "Vind de beste prijzen of we betalen het verschil terug",
    noCreditCardFeesDesc: "Geen verborgen kosten, betaal precies wat u ziet",
    freeChangesCancellationDesc: "Flexibel boeken met gratis annulering"
  },
  pl: {
    bestPriceGuaranteeDesc: "Znajdź najlepsze ceny lub zwrócimy różnicę",
    noCreditCardFeesDesc: "Brak ukrytych opłat, płacisz dokładnie to, co widzisz",
    freeChangesCancellationDesc: "Elastyczna rezerwacja z darmową anulacją"
  },
  th: {
    bestPriceGuaranteeDesc: "ค้นหาราคาที่ดีที่สุดหรือเราจะคืนเงินส่วนต่าง",
    noCreditCardFeesDesc: "ไม่มีค่าธรรมเนียมที่ซ่อนอยู่ จ่ายตามที่คุณเห็น",
    freeChangesCancellationDesc: "การจองที่ยืดหยุ่นพร้อมการยกเลิกฟรี"
  },
  vi: {
    bestPriceGuaranteeDesc: "Tìm giá tốt nhất hoặc chúng tôi sẽ hoàn lại tiền chênh lệch",
    noCreditCardFeesDesc: "Không có phí ẩn, thanh toán chính xác những gì bạn thấy",
    freeChangesCancellationDesc: "Đặt phòng linh hoạt với hủy miễn phí"
  }
};

console.log('🔄 Füge Beschreibungs-Übersetzungen hinzu...\n');

const messagesDir = path.join(__dirname, 'messages');
const locales = fs.readdirSync(messagesDir).filter(f => f.endsWith('.json')).map(f => f.replace('.json', ''));

let count = 0;
locales.forEach(locale => {
  const filePath = path.join(messagesDir, `${locale}.json`);
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Füge Beschreibungen zum home Objekt hinzu
    if (!data.home) data.home = {};
    
    const desc = descriptions[locale] || descriptions.en;
    data.home.bestPriceGuaranteeDesc = desc.bestPriceGuaranteeDesc;
    data.home.noCreditCardFeesDesc = desc.noCreditCardFeesDesc;
    data.home.freeChangesCancellationDesc = desc.freeChangesCancellationDesc;
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    count++;
  } catch (error) {
    console.error(`❌ Fehler bei ${locale}.json:`, error.message);
  }
});

console.log(`✅ ${count} Dateien aktualisiert`);
console.log('✨ Beschreibungs-Übersetzungen erfolgreich hinzugefügt!');
