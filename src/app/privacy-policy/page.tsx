'use client';

import { ArrowLeft, Shield } from 'lucide-react';
import { Logo } from '@/components/luxury/logo';
import { useStore } from '@/lib/store';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
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
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className={`font-serif-lux text-3xl font-bold text-gold-gradient ${lang === 'ta' ? 'font-tamil' : ''}`}>
              {lang === 'ta' ? 'தனியுரிமை கொள்கை' : 'Privacy Policy'}
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
  { title: '1. Introduction', body: 'Rameez Jewellerz ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you visit our website or use our services. We are located at Valliyur, Tirunelveli, Tamil Nadu, and have been serving customers since 1991.' },
  { title: '2. Information We Collect', body: 'We collect the following information when you register or place an order: your name, email address, phone number, delivery address (including city and pincode), and order details. We also collect browsing data such as pages visited and products viewed to improve your shopping experience.' },
  { title: '3. How We Use Your Information', body: 'Your personal information is used to: process and deliver your orders, contact you regarding your bookings, provide customer support, send promotional offers (with your consent), and improve our products and services. We do not sell or rent your personal information to third parties.' },
  { title: '4. Data Security', body: 'We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. Your data is stored securely in our database with encrypted passwords. However, no method of transmission over the internet is 100% secure.' },
  { title: '5. Cookies', body: 'Our website uses cookies to enhance your browsing experience, remember your cart and wishlist items, and analyze website traffic. You can disable cookies in your browser settings, but some features may not function properly.' },
  { title: '6. Your Rights', body: 'You have the right to: access your personal data, update or correct your information, request deletion of your account, and opt-out of marketing communications. To exercise these rights, contact us at care@rameezjewellerz.com.' },
  { title: '7. Children\'s Privacy', body: 'Our website is not intended for children under 18 years of age. We do not knowingly collect personal information from minors. If you believe we have collected data from a minor, please contact us immediately.' },
  { title: '8. Changes to This Policy', body: 'We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.' },
  { title: '9. Contact Us', body: 'If you have any questions about this Privacy Policy, please contact us at: Rameez Jewellerz, Valliyur, Tirunelveli, Tamil Nadu 627117. Phone: +91 90000 00000. Email: care@rameezjewellerz.com.' },
];

const tamilContent = [
  { title: '1. அறிமுகம்', body: 'ரமீஸ் ஜுவெல்லர்ஸ் உங்கள் தனியுரிமையை பாதுகாக்க உறுதிபூண்டுள்ளோம். இந்த தனியுரிமை கொள்கை, நீங்கள் எங்கள் வலைத்தளத்தை பார்வையிடும்போது அல்லது எங்கள் சேவைகளை பயன்படுத்தும்போது நாங்கள் உங்கள் தனிப்பட்ட தகவல்களை எவ்வாறு சேகரிக்கிறோம், பயன்படுத்துகிறோம் மற்றும் பாதுகாக்கிறோம் என்பதை விளக்குகிறது. நாங்கள் திருநெல்வேலி, வள்ளியூரில் அமைந்துள்ளோம் மற்றும் 1991 முதல் வாடிக்கையாளர்களுக்கு சேவை செய்து வருகிறோம்.' },
  { title: '2. நாங்கள் சேகரிக்கும் தகவல்கள்', body: 'நீங்கள் பதிவு செய்யும்போது அல்லது ஆர்டர் செய்யும்போது பின்வரும் தகவல்களை சேகரிக்கிறோம்: உங்கள் பெயர், மின்னஞ்சல் முகவரி, தொலைபேசி எண், டெலிவரி முகவரி (நகரம் மற்றும் பின்கோடு உட்பட), மற்றும் ஆர்டர் விவரங்கள். உங்கள் ஷாப்பிங் அனுபவத்தை மேம்படுத்த பார்வையிட்ட பக்கங்கள் மற்றும் தயாரிப்புகள் போன்ற உலாவல் தரவையும் சேகரிக்கிறோம்.' },
  { title: '3. உங்கள் தகவல்களை நாங்கள் எவ்வாறு பயன்படுத்துகிறோம்', body: 'உங்கள் தனிப்பட்ட தகவல்கள் பின்வரும் நோக்கங்களுக்காக பயன்படுத்தப்படுகிறது: உங்கள் ஆர்டர்களை செயலாக்கவும் டெலிவரி செய்யவும், உங்கள் பதிவுகள் குறித்து தொடர்பு கொள்ள, வாடிக்கையாளர் ஆதரவு வழங்க, விளம்பர சலுகைகளை அனுப்ப (உங்கள் சம்மதத்துடன்), மற்றும் எங்கள் தயாரிப்புகள் மற்றும் சேவைகளை மேம்படுத்த. நாங்கள் உங்கள் தனிப்பட்ட தகவல்களை மூன்றாம் தரப்பினருக்கு விற்கவோ அல்லது வாடகைக்கு விடவோ மாட்டோம்.' },
  { title: '4. தரவு பாதுகாப்பு', body: 'உங்கள் தனிப்பட்ட தகவல்களை அங்கீகரிக்கப்படாத அணுகல், மாற்றம், வெளிப்படுத்தல் அல்லது அழிப்பிலிருந்து பாதுகாக்க பொருத்தமான பாதுகாப்பு நடவடிக்கைகளை எடுக்கிறோம். உங்கள் தரவு குறியாக்கப்பட்ட கடவாய்களுடன் எங்கள் தரவுத்தளத்தில் பாதுகாப்பாக சேமிக்கப்படுகிறது.' },
  { title: '5. குக்கீகள்', body: 'எங்கள் வலைத்தளம் உங்கள் உலாவல் அனுபவத்தை மேம்படுத்த, உங்கள் கார்ட் மற்றும் விருப்பப்பட்டியல் பொருட்களை நினைவில் கொள்ள, மற்றும் வலைத்தள போக்குவரத்தை பகுப்பாய்வு செய்ய குக்கீகளை பயன்படுத்துகிறது. உங்கள் உலாவி அமைப்புகளில் குக்கீகளை முடக்கலாம், ஆனால் சில அம்சங்கள் சரியாக செயல்படாமல் போகலாம்.' },
  { title: '6. உங்கள் உரிமைகள்', body: 'உங்களுக்கு பின்வரும் உரிமைகள் உண்டு: உங்கள் தனிப்பட்ட தரவை அணுக, உங்கள் தகவல்களை புதுப்பிக்க அல்லது திருத்த, உங்கள் கணக்கை நீக்க கோர, மற்றும் சந்தைப்படுத்தல் தகவல்தொடர்புகளிலிருந்து விலக. இந்த உரிமைகளை பயன்படுத்த, care@rameezjewellerz.com இல் எங்களை தொடர்பு கொள்ளவும்.' },
  { title: '7. குழந்தைகளின் தனியுரிமை', body: 'எங்கள் வலைத்தளம் 18 வயதிற்குட்பட்ட குழந்தைகளுக்கு வடிவமைக்கப்படவில்லை. நாங்கள் குழந்தைகளிடமிருந்து தனிப்பட்ட தகவல்களை தெரிந்தே சேகரிக்க மாட்டோம். நாங்கள் ஒரு குழந்தையிடமிருந்து தரவை சேகரித்ததாக நீங்கள் நம்பினால், தயவுசெய்து உடனடியாக எங்களை தொடர்பு கொள்ளவும்.' },
  { title: '8. இந்த கொள்கையில் மாற்றங்கள்', body: 'நாங்கள் இந்த தனியுரிமை கொள்கையை அவ்வப்போது புதுப்பிக்கலாம். ஏதேனும் மாற்றங்கள் இந்த பக்கத்தில் புதுப்பிக்கப்பட்ட தேதியுடன் வெளியிடப்படும். இந்த கொள்கையை அவ்வப்போது மதிப்பாய்வு செய்ய நாங்கள் ஊக்குவிக்கிறோம்.' },
  { title: '9. எங்களை தொடர்பு கொள்ள', body: 'இந்த தனியுரிமை கொள்கை குறித்து கேள்விகள் இருந்தால், தயவுசெய்து எங்களை தொடர்பு கொள்ளவும்: ரமீஸ் ஜுவெல்லர்ஸ், வள்ளியூர், திருநெல்வேலி, தமிழ்நாடு 627117. தொலைபேசி: +91 90000 00000. மின்னஞ்சல்: care@rameezjewellerz.com.' },
];
