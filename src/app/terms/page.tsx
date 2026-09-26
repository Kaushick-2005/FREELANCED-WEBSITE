'use client';

import { ArrowLeft, FileText } from 'lucide-react';
import { Logo } from '@/components/luxury/logo';
import { useStore } from '@/lib/store';
import Link from 'next/link';

export default function TermsPage() {
  const { lang, setLang } = useStore();

  const content = lang === 'ta' ? tamilContent : englishContent;

  return (
    <div className="min-h-screen marble-bg">
      <header className="sticky top-0 z-50 border-b border-gold/20 glass-dark">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 text-gold-light hover:text-gold">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">{lang === 'ta' ? 'முகப்பிற்கு திரும்பு' : 'Back to Home'}</span>
          </Link>
          <Logo size={36} />
          <button
            onClick={() => setLang(lang === 'ta' ? 'en' : 'ta')}
            className="rounded-full border border-gold/40 px-3 py-1 text-xs font-semibold text-gold-light hover:bg-gold/15"
          >
            {lang === 'ta' ? 'EN' : 'தமிழ்'}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-gold">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className={`font-serif-lux text-3xl font-bold text-gold-gradient ${lang === 'ta' ? 'font-tamil' : ''}`}>
              {lang === 'ta' ? 'விதிமுறைகள்' : 'Terms & Conditions'}
            </h1>
            <p className="text-xs text-foreground/50">Rameez Jewellerz · {lang === 'ta' ? 'கடைசியாக புதுப்பிக்கப்பட்டது: ஜனவரி 2026' : 'Last updated: January 2026'}</p>
          </div>
        </div>

        <div className="space-y-6 rounded-2xl glass p-6 md:p-8">
          {content.map((section, i) => (
            <div key={i}>
              <h2 className={`mb-2 text-lg font-semibold text-gold-light ${lang === 'ta' ? 'font-tamil' : ''}`}>
                {section.title}
              </h2>
              <p className={`text-sm leading-relaxed text-foreground/70 ${lang === 'ta' ? 'font-tamil' : ''}`}>
                {section.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-foreground/40">
            {lang === 'ta' ? 'கேள்விகள் இருந்தால் தொடர்பு கொள்ளவும்: care@rameezjewellerz.com' : 'For questions, contact: care@rameezjewellerz.com'}
          </p>
        </div>
      </main>
    </div>
  );
}

const englishContent = [
  { title: '1. Acceptance of Terms', body: 'By accessing and using the Rameez Jewellerz website, you accept and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our website or services.' },
  { title: '2. About Us', body: 'Rameez Jewellerz is a jewellery retailer located at Valliyur, Tirunelveli, Tamil Nadu, India. We have been serving customers since 1991 with BIS 916 Hallmark certified gold, silver, rose gold, and diamond jewellery.' },
  { title: '3. Products & Pricing', body: 'All products displayed on our website are subject to availability. Prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes. We reserve the right to modify prices without prior notice. The weight and purity of jewellery may vary slightly from the displayed specifications.' },
  { title: '4. Ordering & Booking', body: 'When you place an order on our website, it is treated as a "Booking Request" and not an immediate purchase. Our team will contact you by phone to confirm the order details. Payment for jewellery is made at our physical store (onsite), not online. We do not collect online payments through this website.' },
  { title: '5. BIS Hallmark Certification', body: 'All gold jewellery sold by Rameez Jewellerz is BIS 916 Hallmark certified, ensuring the purity and authenticity of gold. Each piece comes with a hallmark certificate as per Bureau of Indian Standards guidelines.' },
  { title: '6. Custom Jewellery Orders', body: 'For customised jewellery requests, you can submit your design through our website. Our team will review your request and contact you with a quote. Custom orders may take 2-4 weeks for completion depending on the complexity of the design.' },
  { title: '7. Exchange & Buyback Policy', body: 'We offer exchange and buyback facilities for jewellery purchased from our store. Exchange is subject to the condition of the jewellery and current market rates. Please visit our store with the original invoice for any exchange or buyback requests.' },
  { title: '8. Warranty & Guarantee', body: 'All our products come with a guarantee of authenticity and purity. Manufacturing defects will be repaired free of charge within 30 days of purchase. Damage caused by misuse or wear and tear is not covered under warranty.' },
  { title: '9. User Accounts', body: 'When you create an account on our website, you are responsible for maintaining the confidentiality of your login credentials. You agree to provide accurate and complete information during registration and to update your information as needed.' },
  { title: '10. Limitation of Liability', body: 'Rameez Jewellerz shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or services. Our maximum liability shall not exceed the value of the product purchased.' },
  { title: '11. Governing Law', body: 'These Terms and Conditions are governed by the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Tirunelveli, Tamil Nadu.' },
  { title: '12. Contact Information', body: 'For any questions regarding these Terms and Conditions, please contact us at: Rameez Jewellerz, Valliyur, Tirunelveli, Tamil Nadu 627117. Phone: +91 90000 00000. Email: care@rameezjewellerz.com.' },
];

const tamilContent = [
  { title: '1. விதிமுறைகளை ஏற்றுக்கொள்வது', body: 'ரமீஸ் ஜுவெல்லர்ஸ் வலைத்தளத்தை அணுகி பயன்படுத்துவதன் மூலம், நீங்கள் இந்த விதிமுறைகளை ஏற்றுக்கொள்கிறீர்கள். இந்த விதிமுறைகளின் எந்தப் பகுதியுடன் நீங்கள் உடன்படவில்லையானால், தயவுசெய்து எங்கள் வலைத்தளத்தை அல்லது சேவைகளை பயன்படுத்த வேண்டாம்.' },
  { title: '2. எங்களை பற்றி', body: 'ரமீஸ் ஜுவெல்லர்ஸ் என்பது தமிழ்நாட்டின் திருநெல்வேலி, வள்ளியூரில் அமைந்துள்ள ஒரு நகை சில்லறை விற்பனையாளர். நாங்கள் 1991 முதல் BIS 916 ஹால்மார்க் சான்றளிக்கப்பட்ட தங்கம், வெள்ளி, ரோஸ் கோல்ட் மற்றும் வைர நகைகளுடன் வாடிக்கையாளர்களுக்கு சேவை செய்து வருகிறோம்.' },
  { title: '3. தயாரிப்புகள் மற்றும் விலை நிர்ணயம்', body: 'எங்கள் வலைத்தளத்தில் காட்டப்படும் அனைத்து தயாரிப்புகளும் கிடைக்கும் தன்மைக்கு உட்பட்டவை. விலைகள் இந்திய ரூபாயில் (₹) பட்டியலிடப்பட்டுள்ளன மற்றும் செலுத்த வேண்டிய வரிகள் உட்பட. முன்னறிவிப்பு இல்லாமல் விலைகளை மாற்ற உரிமையை நாங்கள் வைத்திருக்கிறோம். நகைகளின் எடை மற்றும் தூய்மை காட்டப்பட்ட விவரக்குறிப்புகளிலிருந்து சற்று வேறுபடலாம்.' },
  { title: '4. ஆர்டர் மற்றும் பதிவு', body: 'நீங்கள் எங்கள் வலைத்தளத்தில் ஆர்டர் செய்யும்போது, அது "பதிவு கோரிக்கை" என கருதப்படுகிறது, உடனடி வாங்குதல் அல்ல. எங்கள் குழு ஆர்டர் விவரங்களை உறுதிப்படுத்த உங்களை தொலைபேசி மூலம் தொடர்பு கொள்ளும். நகைகளுக்கான கட்டணம் எங்கள் பருநிலை கடையில் (onsite) செலுத்தப்படுகிறது, ஆன்லைனில் அல்ல. இந்த வலைத்தளம் மூலம் நாங்கள் ஆன்லைன் கட்டணங்களை சேகரிக்கவில்லை.' },
  { title: '5. BIS ஹால்மார்க் சான்றிதழ்', body: 'ரமீஸ் ஜுவெல்லர்ஸ் விற்கும் அனைத்து தங்க நகைகளும் BIS 916 ஹால்மார்க் சான்றளிக்கப்பட்டவை, இது தங்கத்தின் தூய்மை மற்றும் நம்பகத்தன்மையை உறுதிப்படுத்துகிறது. ஒவ்வொரு நகையும் இந்திய தரநிர்ணய பணியகத்தின் வழிகாட்டுதல்களின்படி ஹால்மார்க் சான்றிதழுடன் வருகிறது.' },
  { title: '6. தனிப்பயன் நகை ஆர்டர்கள்', body: 'தனிப்பயனாக்கப்பட்ட நகை கோரிக்கைகளுக்கு, நீங்கள் எங்கள் வலைத்தளம் மூலம் உங்கள் வடிவமைப்பை சமர்ப்பிக்கலாம். எங்கள் குழு உங்கள் கோரிக்கையை மதிப்பாய்வு செய்து, விலைப்புள்ளியுடன் உங்களை தொடர்பு கொள்ளும். தனிப்பயன் ஆர்டர்களுக்கு வடிவமைப்பின் சிக்கலைப் பொறுத்து 2-4 வாரங்கள் ஆகலாம்.' },
  { title: '7. பரிமாற்றம் மற்றும் மீள் கொள்முதல் கொள்கை', body: 'எங்கள் கடையில் வாங்கிய நகைகளுக்கு பரிமாற்றம் மற்றும் மீள் கொள்முதல் வசதிகளை வழங்குகிறோம். பரிமாற்றம் நகையின் நிலை மற்றும் தற்போதைய சந்தை விலைகளைப் பொறுத்தது. பரிமாற்றம் அல்லது மீள் கொள்முதல் கோரிக்கைகளுக்கு அசல் பில்லுடன் எங்கள் கடைக்கு வரவும்.' },
  { title: '8. உத்தரவாதம் மற்றும் பொறுப்பு', body: 'எங்கள் அனைத்து தயாரிப்புகளும் நம்பகத்தன்மை மற்றும் தூய்மைக்கான உத்தரவாதத்துடன் வருகின்றன. உற்பத்தி குறைபாடுகள் வாங்கிய 30 நாட்களுக்குள் இலவசமாக பழுதுபார்க்கப்படும். தவறான பயன்பாடு அல்லது அரிப்பு காரணமாக ஏற்படும் சேதம் உத்தரவாதத்தின் கீழ் வராது.' },
  { title: '9. பயனர் கணக்குகள்', body: 'நீங்கள் எங்கள் வலைத்தளத்தில் கணக்கை உருவாக்கும்போது, உங்கள் உள்நுழைவு சான்றுகளின் ரகசியத்தை பராமரிக்க பொறுப்பாவீர்கள். பதிவு செய்யும்போது துல்லியமான மற்றும் முழுமையான தகவல்களை வழங்கவும், தேவையெனில் உங்கள் தகவல்களை புதுப்பிக்கவும் ஒப்புக்கொள்கிறீர்கள்.' },
  { title: '10. பொறுப்பு வரம்பு', body: 'ரமீஸ் ஜுவெல்லர்ஸ் எங்கள் வலைத்தளம் அல்லது சேவைகளை பயன்படுத்துவதிலிருந்து எழும் எந்தவொரு மறைமுக, சம்பவ, அல்லது விளைவு சேதங்களுக்கும் பொறுப்பாக மாட்டார். எங்கள் அதிகபட்ச பொறுப்பு வாங்கிய தயாரிப்பின் மதிப்பை தாண்டாது.' },
  { title: '11. சட்டம்', body: 'இந்த விதிமுறைகள் இந்திய சட்டங்களால் நிர்வகிக்கப்படுகின்றன. இந்த விதிமுறைகளிலிருந்து எழும் எந்தவொரு தகராறும் தமிழ்நாடு, திருநெல்வேலி நீதிமன்றங்களின் தனி அதிகார வரம்பிற்கு உட்பட்டதாக இருக்கும்.' },
  { title: '12. தொடர்பு தகவல்', body: 'இந்த விதிமுறைகள் தொடர்பான கேள்விகளுக்கு, தயவுசெய்து எங்களை தொடர்பு கொள்ளவும்: ரமீஸ் ஜுவெல்லர்ஸ், வள்ளியூர், திருநெல்வேலி, தமிழ்நாடு 627117. தொலைபேசி: +91 90000 00000. மின்னஞ்சல்: care@rameezjewellerz.com.' },
];
