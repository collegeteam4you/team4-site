const { createElement: h } = React;

let navItems = [
  ['about', 'WHY TEAM4', 'რატომ თიმ ფორი'],
  ['book', 'I Am The Answer', '„მე ვარ პასუხი“'],
  ['programs', 'PROGRAMS', 'პროგრამები'],
  ['winspace', 'WinSpace', 'ვინსფეისი'],
  ['testimonials', 'Testimonials', 'შეფასებები'],
];

let copy = {
  ENG: {
    heroTitle: 'Sales Is Not Talent — It Is Psychology.',
    heroSubtitle: 'Sales • Negotiation • NLP • Digital Marketing',
    heroText: 'If your team works hard, but sales still are not growing —\nthe problem is not the product, it is communication.\n\nBook a free consultation and see where you are losing sales.',
    book: 'Book Consultation',
    openDoor: 'GO TO WINSPACE',
    resumeTitle: 'Short Resume',
    resumeText: [
      'Lasha Khurtsidze is a Commercial Director, Sales Strategist, Negotiation Expert, Author, and Founder of Team4 — Sales College & Training Center. With 15+ years of experience across the automotive industry, insurance, construction, hospitality, retail, and business development, he has built his career through real sales, negotiations, leadership, and team development.',
      'He started his career in direct sales and gradually moved into strategic and managerial roles, gaining deep insight into customer psychology, communication, influence, and business growth mechanisms. Over the years, he has managed sales departments, developed branches, worked with international partners, and created growth-oriented strategies in competitive markets.',
      'Lasha is also the author of “I Am The Answer” — a motivational and psychological work based on real experience, sales, leadership, faith, struggle, personal transformation, and the philosophy of success.',
      'Team4 was created not as a traditional training center, but as a space where sales, communication, negotiations, and influence are taught through real practice, not theory alone.',
    ],
    readMore: 'Read more',
    showLess: 'Show less',
    resumeBookCta: 'Buy The Book',
    aboutKicker: 'Why TEAM4',
    aboutTitle: 'Team4',
    aboutParagraphs: [
      'Team4 is not just another training center. It was built on real sales, negotiations, mistakes, pressure, and hands-on business experience. Our goal is not simply to hand people certificates — our goal is to transform the way they communicate, sell, negotiate, and think.',
      'We work with entrepreneurs, sales teams, managers, and companies that want real results, stronger communication, and highly effective teams. Through modern sales psychology, NLP techniques, negotiation strategies, and practical experience, we help people turn communication into influence and influence into business growth.',
      'What makes Team4 different is its practice-based learning approach. Every program is built around real business cases, customer psychology, objection handling, leadership, emotional intelligence, and strategic communication.',
      'Our philosophy is simple:\nSales is not manipulation — sales is understanding people.',
    ],
    servicesKicker: 'Services',
    servicesTitle: 'Premium Growth Systems',
    servicesText: 'Training, strategy, media, and outsourced commercial execution for teams that want a sharper edge.',
    coursesKicker: 'I Am The Answer',
    coursesTitle: 'I Am The Answer',
    coursesText: 'A motivational and psychological work based on real-life experience, sales, leadership, faith, struggle, personal transformation, and the philosophy of success. The book reflects the idea that success is not built only on skills — it is shaped by mindset, discipline, communication, and inner strength.',
    bookGalleryTitle: 'Book — “I Am Answer”',
    bookGallerySubtitle: 'Real experience, psychology, sales, struggle, and personal transformation.',
    purchaseSubtitle: 'Get the book — ‘I Am The Answer’',
    purchaseButton: 'Purchase',
    programsKicker: 'Services',
    programsTitle: 'Services',
    programsText: 'Premium commercial services for sales, marketing, media, and brand growth.',
    learnMore: 'Learn More',
    register: 'Register',
    eventKicker: 'WinSpace',
    eventTitle: 'WinSpace',
    eventText: 'WinSpace is a space where we talk about business, sales, leadership, and the real journey behind success.',
    eventFormat: 'Premium conversations',
    eventItems: ['Business', 'Sales', 'Leadership', 'The real journey behind success'],
    testimonialsKicker: 'Testimonials',
    testimonialsTitle: 'Trusted by people who take business seriously.',
    leaveComment: 'Leave a Comment',
    testimonialName: 'Name',
    testimonialRole: 'Position / Company',
    testimonialComment: 'Comment',
    testimonialSubmit: 'Submit',
    testimonialClose: 'Close',
    contactKicker: 'Contact',
    contactTitle: 'Remove the pink glasses. Learn real sales.',
    contactQuote: '“If you are ready to remove the pink glasses and learn real sales, contact me.”',
    contactText: 'For consultation, sales training, negotiation programs, or Open Door Day registration, send a direct request to Team4 Sales College.',
    contactStart: 'Start the conversation',
    phoneLabel: 'Phone',
    emailLabel: 'Email',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    selectedProgram: 'Selected Program',
    message: 'Message',
    contactMe: 'SEND',
    sending: 'Sending...',
    requiredMessage: 'Please fill in all required fields.',
    successMessage: 'Message sent successfully.',
    errorMessage: 'Message could not be sent. Check EmailJS configuration.',
  },
  GEO: {
    heroTitle: 'გაყიდვები ტალანტი არ არის — ეს ფსიქოლოგიაა.',
    heroSubtitle: 'გაყიდვები • მოლაპარაკება • NLP • ციფრული მარკეტინგი',
    heroText:
      'თუ შენი გუნდი ბევრს მუშაობს, მაგრამ გაყიდვები მაინც არ იზრდება —\nპრობლემა პროდუქტში არა, კომუნიკაციაშია.\n\nდაჯავშნე უფასო კონსულტაცია და ნახე სად კარგავ გაყიდვებს.',
    book: 'კონსულტაციის დაჯავშნა',
    openDoor: 'გადადით WINSPACE-ზე',
    resumeTitle: 'მოკლე რეზიუმე',
    resumeText: [
      'ლაშა ხურციძე არის კომერციული დირექტორი, გაყიდვების სტრატეგი, მოლაპარაკებების ექსპერტი, ავტორი და Team4 — Sales College & Training Center-ის დამფუძნებელი. 15+ წლიანი გამოცდილებით ავტოინდუსტრიაში, დაზღვევაში, მშენებლობაში, ჰოსპიტალითი სფეროში, რითეილში და ბიზნეს განვითარების მიმართულებით, მან საკუთარი კარიერა რეალურ გაყიდვებზე, მოლაპარაკებებზე, ლიდერობასა და გუნდების განვითარებაზე ააგო.',
      'კარიერა დაიწყო პირდაპირი გაყიდვებიდან და ეტაპობრივად მივიდა სტრატეგიულ და მენეჯერულ პოზიციებამდე, რამაც მისცა შესაძლებლობა სიღრმისეულად შეესწავლა მომხმარებლის ფსიქოლოგია, კომუნიკაცია, გავლენა და ბიზნეს ზრდის მექანიზმები. წლების განმავლობაში მართავდა გაყიდვების დეპარტამენტებს, ავითარებდა ფილიალებს, მუშაობდა საერთაშორისო პარტნიორებთან და ქმნიდა ზრდაზე ორიენტირებულ სტრატეგიებს კონკურენტულ ბაზარზე.',
      'ლაშა ხურციძე ასევე არის წიგნის „მე ვარ პასუხი“ ავტორი — მოტივაციური და ფსიქოლოგიური ნაშრომის, რომელიც დაფუძნებულია რეალურ გამოცდილებაზე, გაყიდვებზე, ლიდერობაზე, რწმენაზე, ბრძოლაზე, პიროვნულ ტრანსფორმაციასა და წარმატების ფილოსოფიაზე.',
      'Team4 შეიქმნა არა როგორც ჩვეულებრივი ტრენინგ ცენტრი, არამედ როგორც სივრცე, სადაც გაყიდვები, კომუნიკაცია, მოლაპარაკებები და გავლენა ისწავლება რეალური პრაქტიკიდან და არა მხოლოდ თეორიიდან.',
    ],
    readMore: 'გაიგე მეტი',
    showLess: 'დაკეცვა',
    resumeBookCta: 'წიგნის შეძენა',
    aboutKicker: 'რატომ TEAM4',
    aboutTitle: 'თიმ ფორი',
    aboutParagraphs: [
      'თიმ ფორი არ არის უბრალოდ ჩვეულებრივი ტრენინგ ცენტრი. ის შეიქმნა რეალური გაყიდვების, მოლაპარაკებების, შეცდომების, ზეწოლისა და ბიზნეს გამოცდილების საფუძველზე. ჩვენი მიზანი არ არის ადამიანებს უბრალოდ სერთიფიკატი მივცეთ — ჩვენი მიზანია შევუცვალოთ მათ კომუნიკაციის, გაყიდვების, მოლაპარაკებებისა და აზროვნების დონე.',
      'ჩვენ ვმუშაობთ მეწარმეებთან, გაყიდვების გუნდებთან, მენეჯერებთან და კომპანიებთან, რომლებსაც სურთ რეალური შედეგები, ძლიერი კომუნიკაცია და მაღალი ეფექტურობის მქონე გუნდის შექმნა. თანამედროვე გაყიდვების ფსიქოლოგიის, NLP ტექნიკების, მოლაპარაკებების სტრატეგიებისა და პრაქტიკული გამოცდილების საშუალებით, ადამიანებს ვეხმარებით კომუნიკაცია გავლენად, ხოლო გავლენა ბიზნეს ზრდად აქციონ.',
      'თიმ ფორი-ის მთავარი განსხვავება პრაქტიკაზე დაფუძნებული სწავლებაა. თითოეული პროგრამა აგებულია რეალურ ბიზნეს ქეისებზე, მომხმარებლის ფსიქოლოგიაზე, objection handling-ზე, ლიდერობაზე, ემოციურ ინტელექტსა და სტრატეგიულ კომუნიკაციაზე.',
      'ჩვენი ფილოსოფია მარტივია:\nგაყიდვები მანიპულაცია არ არის — გაყიდვები ადამიანების გაგებაა.',
    ],
    servicesKicker: 'სერვისები',
    servicesTitle: 'პრემიუმ ზრდის სისტემები',
    servicesText: 'ტრენინგი, სტრატეგია, მედია და კომერციული შესრულება გუნდებისთვის, რომლებსაც სურთ მკაფიო უპირატესობა.',
    coursesKicker: '„მე ვარ პასუხი“',
    coursesTitle: '„მე ვარ პასუხი“',
    coursesText: 'მოტივაციური და ფსიქოლოგიური ნაშრომი, რომელიც დაფუძნებულია რეალურ გამოცდილებაზე, გაყიდვებზე, ლიდერობაზე, რწმენაზე, ბრძოლაზე, პიროვნულ ტრანსფორმაციასა და წარმატების ფილოსოფიაზე. წიგნი ასახავს იდეას, რომ წარმატება მხოლოდ უნარებზე არ დგას — მას ქმნის აზროვნება, დისციპლინა, კომუნიკაცია და შინაგანი სიმტკიცე.',
    bookGalleryTitle: 'წიგნი — „მე ვარ პასუხი“',
    bookGallerySubtitle: 'მოტივაციური და ფსიქოლოგიური ნაშრომი, რომელიც დაფუძნებულია რეალურ გამოცდილებაზე, გაყიდვებზე, ლიდერობაზე, რწმენაზე, ბრძოლაზე, პიროვნულ ტრანსფორმაციასა და წარმატების ფილოსოფიაზე. წიგნი ასახავს იდეას, რომ წარმატება მხოლოდ უნარებზე არ დგას — მას ქმნის აზროვნება, დისციპლინა, კომუნიკაცია და შინაგანი სიმტკიცე.',
    purchaseSubtitle: 'შეიძინე წიგნი — „მე ვარ პასუხი“',
    purchaseButton: 'შეძენა',
    programsKicker: 'სერვისები',
    programsTitle: 'სერვისები',
    programsText: 'პრემიუმ კომერციული სერვისები გაყიდვების, მარკეტინგის, მედიისა და ბრენდის ზრდისთვის.',
    learnMore: 'გაიგე მეტი',
    register: 'რეგისტრაცია',
    eventKicker: 'WinSpace / ვინსფეისი',
    eventTitle: 'WinSpace / ვინსფეისი',
    eventText: 'WinSpace არის სივრცე, სადაც ბიზნესზე, გაყიდვებზე, ლიდერობაზე და ადამიანების რეალურ გზაზე ვსაუბრობთ.',
    eventFormat: 'პრემიუმ საუბრები',
    eventItems: ['ბიზნესი', 'გაყიდვები', 'ლიდერობა', 'წარმატების რეალური გზა'],
    testimonialsKicker: 'შეფასებები',
    testimonialsTitle: 'გვენდობიან ადამიანები, რომლებიც ბიზნესს სერიოზულად უყურებენ.',
    leaveComment: 'კომენტარის დატოვება',
    testimonialName: 'სახელი',
    testimonialRole: 'პოზიცია / კომპანია',
    testimonialComment: 'კომენტარი',
    testimonialSubmit: 'გაგზავნა',
    testimonialClose: 'დახურვა',
    contactKicker: 'კონტაქტი',
    contactTitle: 'მოიხსენი ვარდისფერი სათვალე. ისწავლე რეალური გაყიდვები.',
    contactQuote: '“თუ მზად ხარ მოიხსნა ვარდისფერი სათვალე და ისწავლო რეალური გაყიდვები, დამიკავშირდი.”',
    contactText: 'კონსულტაციისთვის, გაყიდვების ტრენინგისთვის, მოლაპარაკების პროგრამებისთვის ან ღია კარის დღეზე რეგისტრაციისთვის, გაუგზავნე პირდაპირი მოთხოვნა Team4 Sales College-ს.',
    contactStart: 'დაიწყე საუბარი',
    phoneLabel: 'ტელეფონი',
    emailLabel: 'ელ. ფოსტა',
    name: 'სახელი',
    email: 'ელ. ფოსტა',
    phone: 'ტელეფონი',
    selectedProgram: 'არჩეული პროგრამა',
    message: 'შეტყობინება',
    contactMe: 'გაგზავნა',
    sending: 'იგზავნება...',
    requiredMessage: 'გთხოვთ შეავსოთ ყველა აუცილებელი ველი.',
    successMessage: 'შეტყობინება წარმატებით გაიგზავნა.',
    errorMessage: 'შეტყობინება ვერ გაიგზავნა. შეამოწმეთ EmailJS კონფიგურაცია.',
  },
};

let contactInfo = {
  phone: '+995 577 208 606',
  email: 'collegeteam4you@gmail.com',
};

const ADMIN_CONTENT_KEY = 'team4AdminContent';
const EMAILJS_SERVICE_ID = 'service_btd5z5f';
const EMAILJS_TEMPLATE_ID = 'template_zhupw7t';
const EMAILJS_PUBLIC_KEY = 'JYW59QyKlid0i-wU8';
const EMAILJS_SDK_URL = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
let emailJsSdkLoadPromise = null;
let emailJsInitialized = false;
let buttonLinks = {
  winspace: 'https://www.youtube.com/@janamagalashvili',
  commercialProjects: 'https://www.youtube.com/watch?v=hajmhs-cEq0&list=PLvcv-qMu_USis3A_DL5-aoGZgDDr9gCJk',
};
let assetUrls = {
  team4Logo: '/assets/team4-logo-hero.webp',
  heroImage: '/assets/lasha-hero-training-room.jpg',
  winspaceLogo: '/assets/winspace-logo.webp',
};

let socialLinks = [
  ['Facebook', '@team4', 'https://www.facebook.com/profile.php?id=61571797572892', 'facebook'],
  ['TikTok', 'collegeteam4you', 'https://www.tiktok.com/@collegeteam4you?lang=en', 'tiktok'],
  ['Instagram', '__team.4', 'https://www.instagram.com/__team.4/', 'instagram'],
  ['LinkedIn', 'Team4 - თიმ ფორი', 'https://www.linkedin.com/company/117234753/admin/dashboard/', 'linkedin'],
];

let footerLinks = [
  { GEO: 'მომსახურების პირობები', ENG: 'Terms of Service', href: '/terms' },
  { GEO: 'კონფიდენციალურობა', ENG: 'Privacy Policy', href: '/privacy' },
  { GEO: 'თანხის დაბრუნება', ENG: 'Refund Policy', href: '/refund' },
];

const openPolicyPage = (href) => {
  window.location.href = href;
};

let heroCardTitles = {
  ENG: [
    'Professional Sales Manager',
    'Coach',
    'Sales Strategist',
    'Project Manager',
    'Business Consultant',
    'Active Startuper',
    'Author of “I Am The Answer”',
  ],
  GEO: [
    'პროფესიონალი გაყიდვების მენეჯერი',
    'ქოუჩი',
    'გაყიდვების სტრატეგი',
    'პროექტ-მენეჯერი',
    'ბიზნეს-კონსულტანტი',
    'მოქმედი სტარტაპერი',
    'წიგნის ავტორი — „მე ვარ პასუხი“',
  ],
};

let bookGalleryImages = [
  '/assets/book-gallery-01.webp',
  '/assets/book-gallery-02.webp',
  '/assets/book-gallery-03.webp',
  '/assets/book-gallery-04.webp',
  '/assets/book-gallery-05.webp',
];

let programs = [
  {
    id: 'sales-mastery',
    titleGeo: 'გაყიდვების ხელოვნება',
    titleEng: 'Art of Sales',
    subtitleGeo: 'გაყიდვების ფსიქოლოგია, ნდობა, საჭიროების აღმოჩენა და დახურვის პრაქტიკული სისტემა.',
    subtitleEng: 'Sales psychology, trust building, needs discovery, and a practical closing system.',
    buttonGeo: 'სილაბუსის ნახვა',
    buttonEng: 'View Syllabus',
    image: '/assets/sales-mastery-cover.webp',
    modalImage: '/assets/art-of-sales-modal-portrait.webp',
    syllabusTitleGeo: 'გაყიდვების ხელოვნება — სილაბუსი',
    syllabusTitleEng: 'Art of Sales — Syllabus',
    syllabusGeo: [
      'გაყიდვების საფუძვლები',
      'გაყიდვების ტიპები',
      'მომხმარებლის საჭიროების ანალიზი',
      'გაყიდვების ციკლი',
      'სიმულაციური თამაში',
      'ფრაზის ანატომია',
      'მცირე ნიშნიდან ფართო სურათის დანახვა',
      'როგორ გავაჩინოთ მომხმარებლის ნდობა',
      'გაყიდვების ფორმულა',
      'ნდობის 8 გამაძლიერებელი ფაქტორი',
      'რწმენის კვადრატი',
      'ემოციური გაყიდვები',
      'მომხმარებლის საჭიროებები',
      'როგორ შევქმნათ სარგებელი გაყიდვაში',
      'აკრძალული ფრაზები',
      'რას უნდა მიაქციო ყურადღება ზარის დროს',
      '3 აუცილებელი კითხვა საკუთარ თავს',
      'გაყიდვების დამხმარე ფრაზები',
      'არგუმენტები',
      'კითხვები მომხმარებლის საჭიროებების დასადგენად',
      'ჯო ჯერარდის გაყიდვების სტილი',
      'ელმო ლევისის გაყიდვების ტრადიციული მიდგომა',
      'ჯორდან ბელფორდის გაყიდვების მოდელი',
      'დევიდ სენდლერის გაყიდვების მოდელი — წყალქვეშა ნავი',
      'უარებზე მუშაობა',
      'საბოლოო ნეიტრალიზაცია — „დასკვნითი ბიძგი“',
      'ტესტური გამოცდა',
    ],
    syllabusEng: [
      'Sales fundamentals',
      'Types of sales',
      'Customer needs analysis',
      'Sales cycle',
      'Simulation game',
      'Anatomy of a phrase',
      'Seeing the bigger picture from small signals',
      'How to build customer trust',
      'Sales formula',
      '8 trust-building factors',
      'The belief square',
      'Emotional sales',
      'Customer needs',
      'How to create value in sales',
      'Forbidden phrases',
      'What to pay attention to during a call',
      '3 essential questions to ask yourself',
      'Supporting sales phrases',
      'Arguments',
      'Questions to identify customer needs',
      'Joe Girard’s sales style',
      'Elmo Lewis’s traditional sales approach',
      'Jordan Belfort’s sales model',
      'David Sandler’s sales model — Submarine',
      'Working with objections',
      'Final neutralization — “The closing push”',
      'Test exam',
    ],
    tone: 'red',
  },
  {
    id: 'negotiation-power',
    titleGeo: 'მოლაპარაკების ძალა',
    titleEng: 'Negotiation Power',
    subtitleGeo: 'ისწავლე გავლენა, კონტროლი და ძლიერი მოლაპარაკებების სტრატეგია.',
    subtitleEng: 'Master influence, control, and high-level negotiation strategy.',
    buttonGeo: 'სილაბუსის ნახვა',
    buttonEng: 'View Syllabus',
    image: '/assets/negotiation-power-cover.webp',
    modalImage: '/assets/art-of-sales-modal-portrait.webp',
    syllabusTitleGeo: 'მოლაპარაკებების ძალა — სილაბუსი',
    syllabusTitleEng: 'Power of Negotiation — Syllabus',
    syllabusGeo: [
      'მოლაპარაკების არსი',
      'ძლიერი ინსტრუმენტი',
      'მოლაპარაკების 7 საიდუმლო',
      'მოლაპარაკების ასპექტები',
      'ეფექტური კომუნიკაცია მოლაპარაკებების დროს',
      'კომპრომისისა და სტრატეგიული მოქნილობა',
      'მოლაპარაკების დროისა და პროცესის მართვა',
      'სამი ფაქტორი, რომელიც გავლენას ახდენს დავის გადაწყვეტაზე',
      'ინტერესები, უფლებები და ძალაუფლება მოლაპარაკებაში',
      'ქეისი',
      'როგორ გამოვიდეთ ჩიხიდან',
      'მოლაპარაკების Checklist შედგენა',
      'მოლაპარაკების ტაქტიკები',
      'ღუზის ეფექტი',
      'LIM სტრატეგია',
      'BATNA სტრატეგია',
      'ZOPA სტრატეგია',
      'ქეისი',
      'ტესტირება',
    ],
    syllabusEng: [
      'Fundamentals of Negotiation',
      'Negotiation as a Powerful Tool',
      '7 Secrets of Negotiation',
      'Key Aspects of Negotiation',
      'Effective Communication During Negotiations',
      'Compromise & Strategic Flexibility',
      'Managing Negotiation Time & Process',
      'Three Factors Influencing Conflict Resolution',
      'Interests, Rights & Power in Negotiation',
      'Case Study',
      'How to Break a Deadlock',
      'Building a Negotiation Checklist',
      'Negotiation Tactics',
      'The Anchor Effect',
      'LIM Strategy',
      'BATNA Strategy',
      'ZOPA Strategy',
      'Case Study',
      'Final Test',
    ],
    tone: 'orange',
  },
  {
    id: 'nlp-in-sales',
    titleGeo: 'NLP გაყიდვებში',
    titleEng: 'NLP In Sales',
    subtitleGeo: 'ისწავლე ადამიანის წაკითხვა, ქვეცნობიერის ტრიგერები და გავლენის ფსიქოლოგია.',
    subtitleEng: 'Learn human reading, subconscious triggers, and the psychology of influence.',
    buttonGeo: 'სილაბუსის ნახვა',
    buttonEng: 'View Syllabus',
    image: '/assets/nlp-sales-cover.webp',
    modalImage: '/assets/art-of-sales-modal-portrait.webp',
    syllabusTitleGeo: 'NLP გაყიდვებში — სილაბუსი',
    syllabusTitleEng: 'NLP In Sales — Syllabus',
    syllabusGeo: [
      'NLP-ის ძირითადი პრინციპები',
      'სუბიექტური რეალობისა და აღქმის გავლენა კომუნიკაციაზე',
      'რაპორტის შექმნა და ნდობის ფორმირების ტექნიკები',
      'მეტაპროგრამები და ადამიანის აზროვნების ტიპები',
      'NLP ტექნიკები გაყიდვებსა და მოლაპარაკებებში',
      'სხეულის ენა (Body Language) და ქცევითი ფსიქოლოგიის ელემენტები',
      'სიტყვების, ტონალობისა და წინადადების სტრუქტურის გავლენა ქვეცნობიერზე',
      'გავლენიანი კომუნიკაციისა და ემოციური მიბმის სტრატეგიები',
      'Reframing, Anchoring, Mirroring, Future Pacing და სხვა NLP მეთოდები',
    ],
    syllabusEng: [
      'Core principles of NLP',
      'The impact of subjective reality and perception on communication',
      'Building rapport and trust-forming techniques',
      'Meta-programs and human thinking patterns',
      'NLP techniques in sales and negotiations',
      'Body language and elements of behavioral psychology',
      'The influence of words, tonality, and sentence structure on the subconscious mind',
      'Strategies for influential communication and emotional attachment',
      'Reframing, Anchoring, Mirroring, Future Pacing, and other NLP methods',
    ],
    tone: 'yellow',
  },
  {
    id: 'digital-marketing',
    titleGeo: 'ციფრული მარკეტინგი',
    titleEng: 'Digital Marketing',
    subtitleGeo: 'ისწავლე ბრენდის ზრდა, რეკლამის ფსიქოლოგია და ციფრული გავლენის სტრატეგიები.',
    subtitleEng: 'Learn brand growth, advertising psychology, and digital influence strategies.',
    buttonGeo: 'სილაბუსის ნახვა',
    buttonEng: 'View Syllabus',
    image: '/assets/digital-marketing-cover.webp',
    modalImage: '/assets/digital-marketing-modal-portrait.webp',
    syllabusTitleGeo: 'ციფრული მარკეტინგი — სილაბუსი',
    syllabusTitleEng: 'Digital Marketing — Syllabus',
    syllabusGeo: [
      'ციფრული მარკეტინგის საფუძვლები',
      'ბაზრის კვლევა და აუდიტორია — Targeting, Personas',
      'SMM — Facebook / Instagram / TikTok',
      'Content Marketing',
      'SEO საფუძვლები',
      'Google Ads / PPC რეკლამა',
      'Email Marketing',
      'Analytics — Google Analytics, Meta Pixel',
      'Funnel და გაყიდვების სტრატეგია',
      'სტრატეგიული დაგეგმვა',
      'პრაქტიკული ქეისები / კამპანიის შექმნა',
      'Final Project / Portfolio',
    ],
    syllabusEng: [
      'Fundamentals of Digital Marketing',
      'Market Research and Audience — Targeting, Personas',
      'SMM — Facebook / Instagram / TikTok',
      'Content Marketing',
      'SEO Fundamentals',
      'Google Ads / PPC Advertising',
      'Email Marketing',
      'Analytics — Google Analytics, Meta Pixel',
      'Funnel and Sales Strategy',
      'Strategic Planning',
      'Practical Cases / Campaign Creation',
      'Final Project / Portfolio',
    ],
    tone: 'blue',
  },
  {
    id: 'outsource-sales-marketing',
    titleGeo: 'აუთსორს გაყიდვები და მარკეტინგი',
    titleEng: 'Outsource Sales & Marketing',
    subtitleGeo: 'შექმენი გაყიდვების სისტემა, რომელიც მუშაობს შენს ნაცვლად — მარკეტინგი, გაყიდვები, მართვა და სტრატეგიული კონსულტაცია ერთ სივრცეში.',
    subtitleEng: 'Build a sales system that works for your business — marketing, sales, management, and strategic consulting in one ecosystem.',
    buttonGeo: 'შეთავაზების ნახვა',
    buttonEng: 'View Offer',
    image: '/assets/outsource-sales-marketing-cover.webp',
    modalImage: '/assets/team4-logo-hero.webp',
    modalImageMode: 'logo',
    syllabusTitleGeo: 'აუთსორს გაყიდვები და მარკეტინგი — სილაბუსი',
    syllabusTitleEng: 'Outsource Sales & Marketing — Syllabus',
    syllabusGeo: [
        'გაყიდვების სისტემის არქიტექტურა და პროცესების აწყობა',
        'ლიდების გენერაცია, funnel-ები და კონვერსიის მენეჯმენტი',
        'გაყიდვების გუნდის სკრიპტები, KPI-ები და კონტროლის სისტემა',
        'მარკეტინგისა და გაყიდვების ერთიან ზრდის მოდელში გაერთიანება',
        'პრაქტიკული გეგმა შედეგზე ორიენტირებული აუთსორს სისტემისთვის',
    ],
    syllabusEng: [
        'Sales system architecture and process setup',
        'Lead generation, funnels, and conversion management',
        'Sales scripts, KPIs, and team control systems',
        'Uniting marketing and sales into one growth model',
        'A practical plan for a performance-driven outsourced system',
    ],
    tone: 'red',
  },
  {
    id: 'brand-sales-video-production',
    titleGeo: 'საიმიჯო და გაყიდვებზე ორიენტირებული ვიდეოების გადაღება',
    titleEng: 'Brand & Sales Video Production',
    subtitleGeo: 'ვიდეო, რომელიც უბრალოდ ლამაზად კი არ გამოიყურება — არამედ გაყიდვებს, ნდობას და გავლენას ქმნის.',
    subtitleEng: 'Videos that do more than look premium — they build trust, authority, and sales.',
    buttonGeo: 'შეთავაზების ნახვა',
    buttonEng: 'View Offer',
    image: '/assets/brand-sales-video-cover.webp',
    modalImage: '/assets/winspace-modal-logo.webp',
    modalImageMode: 'logo',
    syllabusTitleGeo: 'საიმიჯო და გაყიდვებზე ორიენტირებული ვიდეოების გადაღება',
    syllabusTitleEng: 'Brand & Sales Video Production',
    syllabusGeo: [
        'ბრენდული ვიდეოს იდეა, სტრუქტურა და კომერციული მიზანი',
        'სცენარი, მესიჯინგი და ნდობის გამომწვევი ვიზუალური კომუნიკაცია',
        'კადრის, განათების, ხმისა და პრეზენტაციის ძირითადი პრინციპები',
        'გაყიდვებზე ორიენტირებული ვიდეო funnel-ის შექმნა',
        'პრაქტიკული გეგმა კონტენტისთვის, რომელიც ზრდის ბრენდსა და გაყიდვებს',
    ],
    syllabusEng: [
        'Brand video concept, structure, and commercial objective',
        'Script, messaging, and trust-building visual communication',
        'Core principles of framing, lighting, sound, and presentation',
        'Building a sales-oriented video funnel',
        'A practical content plan for growing brand authority and sales',
    ],
    tone: 'violet',
  },
  {
    id: 'winspace-interview-feature',
    titleGeo: 'WinSpace-ის გადაცემაში ჩაწერა',
    titleEng: 'WinSpace Interview Feature',
    subtitleGeo: 'მიიღე მონაწილეობა WinSpace-ში, გააძლიერე შენი პერსონალური ბრენდი და გააცანი შენი ბიზნესი ფართო აუდიტორიას.',
    subtitleEng: 'Join the WinSpace show, grow your personal brand, and present your business to a wider audience.',
    buttonGeo: 'შეთავაზების ნახვა',
    buttonEng: 'View Offer',
    image: '/assets/winspace-interview-cover.webp',
    modalImage: '/assets/winspace-modal-logo.webp',
    modalImageMode: 'logo',
    youtubeCtaGeo: 'YouTube-ზე გადასვლა',
    youtubeCtaEng: 'Visit YouTube',
    youtubeUrl: 'https://www.youtube.com/@janamagalashvili',
    syllabusTitleGeo: 'WinSpace-ის გადაცემაში ჩაწერა — სილაბუსი',
    syllabusTitleEng: 'WinSpace Interview Feature — Syllabus',
    syllabusGeo: [
        'პერსონალური ბრენდის პოზიციონირება ინტერვიუსთვის',
        'ბიზნესის, ისტორიისა და მთავარი გზავნილის მომზადება',
        'კამერასთან კომუნიკაცია, ნდობა და აუდიტორიაზე გავლენა',
        'WinSpace ფორმატი, კითხვების სტრუქტურა და გადაცემის დინამიკა',
        'ინტერვიუს გამოყენება PR-ისა და ციფრული ბრენდის ზრდისთვის',
    ],
    syllabusEng: [
        'Personal brand positioning for the interview',
        'Preparing your business, story, and core message',
        'Camera communication, trust, and audience influence',
        'WinSpace format, question structure, and show flow',
        'Using the interview for PR and digital brand growth',
    ],
    tone: 'cyan',
  },
];

const programText = (program, lang) => ({
  title: lang === 'GEO' ? program.titleGeo : program.titleEng,
  subtitle: lang === 'GEO' ? program.subtitleGeo : program.subtitleEng,
  button: lang === 'GEO' ? program.buttonGeo : program.buttonEng,
  syllabusTitle: lang === 'GEO' ? program.syllabusTitleGeo : program.syllabusTitleEng,
  syllabus: lang === 'GEO' ? program.syllabusGeo : program.syllabusEng,
});

const programModalCta = (program, lang) =>
  program.id === 'brand-sales-video-production'
    ? lang === 'GEO'
      ? 'კომერციული პროექტები — რეკლამა და ბრენდ კონტენტი'
      : 'Commercial Projects – Ads & Brand Content'
    : program.id === 'outsource-sales-marketing'
    ? lang === 'GEO'
      ? 'დაგვიკავშირდი'
      : 'Contact Us'
    : lang === 'GEO'
      ? 'რეგისტრაცია'
      : 'Register';

const programModalCtaClass = (program) =>
  program.id === 'brand-sales-video-production'
    ? 'site-cta mt-8 inline-flex min-h-11 w-fit max-w-full cursor-pointer items-center justify-center gap-3 bg-luxuryRed px-5 py-2.5 text-center text-xs font-black tracking-[0.12em] text-white shadow-glowRed transition duration-500 hover:bg-[#ff1e18] sm:text-[13px]'
    : 'site-cta mt-8 inline-flex min-h-12 w-fit cursor-pointer items-center justify-center gap-3 bg-luxuryRed px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-white shadow-glowRed transition duration-500 hover:bg-[#ff1e18]';

const programModalCtaHref = (program) =>
  program.id === 'brand-sales-video-production'
    ? buttonLinks.commercialProjects
    : '/index.html#contact';

const programPageHref = (program) => `/program/${program.id}`;
const programPageUrl = (program) => `${window.location.origin}${programPageHref(program)}`;
const sectionHref = (id) => (window.location.pathname.startsWith('/program/') ? `/index.html#${id}` : `#${id}`);

function openProgramPage(program) {
  const url = programPageUrl(program);
  const opened = window.open(url, '_blank');
  if (opened) {
    opened.opener = null;
    opened.focus();
  } else {
    window.location.href = url;
  }
}

const testimonials = [
  [{ ENG: '"Team4 changed the way our team speaks with clients."', GEO: '“Team4-მა შეცვალა ის, როგორ ვესაუბრებით კლიენტებს.”' }, 'Nino G.', { ENG: 'Business Owner', GEO: 'ბიზნესის მფლობელი' }],
  [{ ENG: '"The negotiation training paid for itself in one contract."', GEO: '“მოლაპარაკების ტრენინგმა ერთი კონტრაქტით ამოიღო საკუთარი ღირებულება.”' }, 'Irakli M.', { ENG: 'Commercial Manager', GEO: 'კომერციული მენეჯერი' }],
  [{ ENG: '"Lasha brings clarity, energy, and a real system."', GEO: '“ლაშას მოაქვს სიცხადე, ენერგია და რეალური სისტემა.”' }, 'Mariam K.', { ENG: 'Sales Lead', GEO: 'გაყიდვების ლიდი' }],
];

const TESTIMONIALS_KEY = 'team4Testimonials';

const defaultTestimonialItems = testimonials.map(([quote, name, role], index) => ({
  id: `default-${index + 1}`,
  name,
  quoteGeo: quote.GEO,
  quoteEng: quote.ENG,
  roleGeo: role.GEO,
  roleEng: role.ENG,
}));

const normalizeTestimonialItem = (item, index = 0) => {
  if (!item || typeof item !== 'object') return null;
  const fallbackId = `comment-${Date.now()}-${index}`;
  const name = String(item.name || '').trim();
  const quoteGeo = String(item.quoteGeo || item.quote || '').trim();
  const quoteEng = String(item.quoteEng || item.quote || quoteGeo).trim();
  const roleGeo = String(item.roleGeo || item.role || '').trim();
  const roleEng = String(item.roleEng || item.role || roleGeo).trim();
  if (!name || !quoteGeo || !quoteEng) return null;
  return {
    id: String(item.id || fallbackId),
    name,
    quoteGeo,
    quoteEng,
    roleGeo,
    roleEng,
  };
};

const loadManagedTestimonials = () => {
  try {
    const raw = localStorage.getItem(TESTIMONIALS_KEY);
    if (raw === null) return defaultTestimonialItems;
    const stored = JSON.parse(raw);
    const normalized = Array.isArray(stored) ? stored.map(normalizeTestimonialItem).filter(Boolean) : [];
    return normalized;
  } catch {
    return defaultTestimonialItems;
  }
};

const isPlainObject = (value) =>
  value && typeof value === 'object' && !Array.isArray(value);

const cleanText = (value, fallback = '') => (typeof value === 'string' ? value : fallback);

const sanitizeInternalId = (value, fallback) =>
  typeof value === 'string' && /^[A-Za-z0-9_-]{1,48}$/.test(value) ? value : fallback;

const isAllowedUrl = (value, { image = false } = {}) => {
  if (typeof value !== 'string') return false;
  const url = value.trim();
  if (!url || /[\u0000-\u001F\u007F]/.test(url)) return false;
  if (image) return url.startsWith('https://') || /^(\.\/assets\/|\/assets\/|assets\/)[A-Za-z0-9._%() -]+\.(webp|png|jpe?g|gif|svg|mp4)$/i.test(url);
  if (url.startsWith('https://')) return true;
  if (url.startsWith('mailto:')) return true;
  if (url.startsWith('#')) return true;
  if (url.startsWith('/#')) return true;
  if (/^\/(terms|privacy|refund|admin|index\.html)?$/.test(url)) return true;
  return false;
};

const sanitizeUrl = (value, fallback = '', options) =>
  isAllowedUrl(value, options) ? value.trim() : fallback;

const sanitizeNavItems = (items, fallback) =>
  Array.isArray(items)
    ? items
        .map((item, index) => {
          if (!Array.isArray(item)) return null;
          const fallbackItem = fallback[index] || ['hero', 'Home', 'მთავარი'];
          return [
            sanitizeInternalId(item[0], fallbackItem[0]),
            cleanText(item[1], fallbackItem[1]),
            cleanText(item[2], fallbackItem[2]),
          ];
        })
        .filter(Boolean)
    : fallback;

const sanitizeSocialLinks = (links, fallback) =>
  Array.isArray(links)
    ? links
        .map((item, index) => {
          if (!Array.isArray(item)) return null;
          const fallbackItem = fallback[index] || ['', '', '#', ''];
          return [
            cleanText(item[0], fallbackItem[0]),
            cleanText(item[1], fallbackItem[1]),
            sanitizeUrl(item[2], fallbackItem[2]),
            cleanText(item[3], fallbackItem[3]),
          ];
        })
        .filter(Boolean)
    : fallback;

const sanitizeFooterLinks = (links, fallback) =>
  Array.isArray(links)
    ? links
        .map((item, index) => {
          if (!isPlainObject(item)) return null;
          const fallbackItem = fallback[index] || { GEO: '', ENG: '', href: '#' };
          return {
            GEO: cleanText(item.GEO, fallbackItem.GEO),
            ENG: cleanText(item.ENG, fallbackItem.ENG),
            href: sanitizeUrl(item.href, fallbackItem.href),
          };
        })
        .filter(Boolean)
    : fallback;

const sanitizeImageList = (items, fallback) =>
  Array.isArray(items)
    ? items.map((item, index) => sanitizeUrl(item, fallback[index] || '', { image: true })).filter(Boolean)
    : fallback;

const sanitizeUrlObject = (value, fallback, options) => {
  if (!isPlainObject(value)) return fallback;
  return Object.keys(value).reduce(
    (safe, key) => ({
      ...safe,
      [key]: sanitizeUrl(value[key], fallback[key] || '', options),
    }),
    { ...fallback }
  );
};

const sanitizePrograms = (items, fallback) =>
  Array.isArray(items)
    ? items
        .map((program, index) => {
          if (!isPlainObject(program)) return null;
          const fallbackProgram = fallback[index] || {};
          const safeProgram = deepMerge(fallbackProgram, program);
          if ('id' in safeProgram) safeProgram.id = sanitizeInternalId(safeProgram.id, fallbackProgram.id || `program-${index + 1}`);
          if ('tone' in safeProgram) safeProgram.tone = sanitizeInternalId(safeProgram.tone, fallbackProgram.tone || 'red');
          if ('image' in safeProgram) safeProgram.image = sanitizeUrl(safeProgram.image, fallbackProgram.image || '', { image: true });
          if ('modalImage' in safeProgram) safeProgram.modalImage = sanitizeUrl(safeProgram.modalImage, fallbackProgram.modalImage || '', { image: true });
          if ('youtubeUrl' in safeProgram) safeProgram.youtubeUrl = sanitizeUrl(safeProgram.youtubeUrl, fallbackProgram.youtubeUrl || '');
          return safeProgram;
        })
        .filter(Boolean)
    : fallback;

const sanitizeAdminContent = (adminContent) => {
  const safe = { ...adminContent };
  if ('navItems' in safe) safe.navItems = sanitizeNavItems(safe.navItems, navItems);
  if ('socialLinks' in safe) safe.socialLinks = sanitizeSocialLinks(safe.socialLinks, socialLinks);
  if ('footerLinks' in safe) safe.footerLinks = sanitizeFooterLinks(safe.footerLinks, footerLinks);
  if ('buttonLinks' in safe) safe.buttonLinks = sanitizeUrlObject(safe.buttonLinks, buttonLinks);
  if ('assetUrls' in safe) safe.assetUrls = sanitizeUrlObject(safe.assetUrls, assetUrls, { image: true });
  if ('bookGalleryImages' in safe) safe.bookGalleryImages = sanitizeImageList(safe.bookGalleryImages, bookGalleryImages);
  if ('programs' in safe) safe.programs = sanitizePrograms(safe.programs, programs);
  return safe;
};

const deepMerge = (base, override) => {
  if (Array.isArray(override)) {
    return override;
  }

  if (!isPlainObject(base) || !isPlainObject(override)) {
    return override === undefined ? base : override;
  }

  return Object.keys(override).reduce(
    (merged, key) => ({
      ...merged,
      [key]: deepMerge(base[key], override[key]),
    }),
    { ...base }
  );
};

const applyAdminContent = () => {
  try {
    const saved = localStorage.getItem(ADMIN_CONTENT_KEY);
    if (!saved) return;

    const parsedContent = JSON.parse(saved);
    if (!isPlainObject(parsedContent)) return;
    const adminContent = sanitizeAdminContent(parsedContent);

    if (Array.isArray(adminContent.navItems) && adminContent.navItems.length) navItems = adminContent.navItems;
    if (adminContent.copy) copy = deepMerge(copy, adminContent.copy);
    if (adminContent.contactInfo) contactInfo = deepMerge(contactInfo, adminContent.contactInfo);
    if (Array.isArray(adminContent.socialLinks) && adminContent.socialLinks.length) socialLinks = adminContent.socialLinks;
    if (Array.isArray(adminContent.footerLinks) && adminContent.footerLinks.length) footerLinks = adminContent.footerLinks;
    if (adminContent.heroCardTitles) heroCardTitles = deepMerge(heroCardTitles, adminContent.heroCardTitles);
    if (adminContent.buttonLinks) buttonLinks = deepMerge(buttonLinks, adminContent.buttonLinks);
    if (adminContent.assetUrls) assetUrls = deepMerge(assetUrls, adminContent.assetUrls);
    if (Array.isArray(adminContent.bookGalleryImages) && adminContent.bookGalleryImages.length) bookGalleryImages = adminContent.bookGalleryImages;
    if (Array.isArray(adminContent.programs) && adminContent.programs.length) programs = adminContent.programs;
  } catch (error) {
    console.error('Could not load Team4 admin content:', error);
  }
};

applyAdminContent();

navItems = navItems.map((item) => (item[0] === 'courses' ? ['book', 'I Am The Answer', '„მე ვარ პასუხი“'] : item));
if (!navItems.some(([id]) => id === 'book')) {
  const aboutIndex = navItems.findIndex(([id]) => id === 'about');
  navItems.splice(aboutIndex >= 0 ? aboutIndex + 1 : 1, 0, ['book', 'I Am The Answer', '„მე ვარ პასუხი“']);
}

function Button({ children, href, variant = 'primary', className = '' }) {
  const cls =
    variant === 'primary'
      ? 'bg-luxuryRed text-white hover:bg-[#ff1e18] shadow-glowRed'
      : 'border border-white/20 bg-white/5 text-softWhite hover:border-racingYellow hover:bg-racingYellow/10';

  return h(
    'a',
    {
      href,
      className: `site-cta hero-cta-button group inline-flex min-h-12 items-center justify-center gap-3 px-6 py-3 text-sm font-bold uppercase tracking-[0.22em] transition duration-500 ${cls} ${className}`,
    },
    children,
    h('span', { className: 'transition duration-500 group-hover:translate-x-1' }, '->')
  );
}

function SectionTitle({ kicker, title, children, dark = true }) {
  return h(
    'div',
    { className: 'mx-auto mb-12 max-w-3xl text-center reveal' },
    h('p', { className: 'mb-4 text-xs font-bold uppercase tracking-[0.38em] text-luxuryRed' }, kicker),
    h('h2', { className: `font-display text-4xl font-extrabold leading-tight md:text-6xl ${dark ? 'text-white' : 'text-ink'}` }, title),
    children && h('p', { className: `mx-auto mt-5 max-w-2xl text-base leading-8 md:text-lg ${dark ? 'text-white/68' : 'text-black/62'}` }, children)
  );
}

function LanguageSwitcher({ lang, setLang }) {
  const chooseLang = (option) => {
    localStorage.setItem('team4Lang', option);
    setLang(option);
  };

  return h(
    'div',
    { className: 'flex items-center border border-white/12 bg-white/[0.04] p-1 backdrop-blur-xl' },
    ['GEO', 'ENG'].map((option) =>
      h(
        'button',
        {
          key: option,
          type: 'button',
          onClick: () => chooseLang(option),
          className: `min-h-8 px-3 text-[11px] font-black uppercase tracking-[0.18em] transition duration-300 ${lang === option ? 'bg-luxuryRed text-white shadow-glowRed' : 'text-white/70 hover:text-luxuryRed'}`,
          'aria-pressed': lang === option,
        },
        option
      )
    )
  );
}

function SocialIcon({ type }) {
  const common = {
    className: 'h-4 w-4 fill-current',
    viewBox: '0 0 24 24',
    'aria-hidden': 'true',
  };

  if (type === 'facebook') {
    return h(
      'svg',
      common,
      h('path', { d: 'M14.2 8.6V6.9c0-.8.5-1 1-1h1.6V3.1c-.8-.1-1.6-.1-2.4-.1-2.4 0-4 1.5-4 4.1v1.5H7.8v3.1h2.6V21h3.3v-9.3h2.7l.4-3.1h-3.1Z' })
    );
  }

  if (type === 'tiktok') {
    return h(
      'svg',
      common,
      h('path', { d: 'M16.3 3c.3 2.3 1.6 3.7 3.7 3.9v3.1c-1.3.1-2.6-.3-3.7-1.1v5.7c0 3.8-2.5 6.4-6 6.4-3.2 0-5.6-2.2-5.6-5.2 0-3.3 2.6-5.4 6.1-5.2v3.2c-1.6-.2-2.8.5-2.8 1.9 0 1.2 1 2 2.2 2 1.5 0 2.6-.9 2.6-3V3h3.5Z' })
    );
  }

  if (type === 'instagram') {
    return h(
      'svg',
      common,
      h('path', { d: 'M7.2 2.8h9.6c2.4 0 4.4 2 4.4 4.4v9.6c0 2.4-2 4.4-4.4 4.4H7.2c-2.4 0-4.4-2-4.4-4.4V7.2c0-2.4 2-4.4 4.4-4.4Zm0 2.6c-1 0-1.8.8-1.8 1.8v9.6c0 1 .8 1.8 1.8 1.8h9.6c1 0 1.8-.8 1.8-1.8V7.2c0-1-.8-1.8-1.8-1.8H7.2Zm4.8 3.1a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Zm0 2.4a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2Zm4-3.1a1 1 0 1 1 0 2.1 1 1 0 0 1 0-2.1Z' })
    );
  }

  return h(
    'svg',
    common,
    h('path', { d: 'M4.8 3.5a2 2 0 1 1 0 4.1 2 2 0 0 1 0-4.1ZM3.2 9h3.3v11.5H3.2V9Zm5.7 0h3.1v1.6h.1c.5-.9 1.6-1.9 3.4-1.9 3.6 0 4.3 2.4 4.3 5.5v6.3h-3.3v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H8.9V9Z' })
  );
}

function SocialLinks({ compact = false }) {
  return h(
    'div',
    { className: `contact-social-actions ${compact ? '' : 'mt-6'}` },
    socialLinks.map(([name, handle, url, icon]) =>
      h(
        'a',
        {
          key: name,
          href: url,
          onClick: () => {
            window.location.href = url;
          },
          style: {
            cursor: 'pointer',
            position: 'relative',
            zIndex: 999999,
            pointerEvents: 'auto',
          },
          className: 'social-link group inline-flex min-h-12 items-center gap-3 border border-white/12 bg-white/[0.05] px-4 text-sm text-white/72 backdrop-blur-xl transition duration-300 hover:border-luxuryRed hover:bg-luxuryRed/12 hover:text-white',
          'aria-label': `${name}: ${handle}`,
        },
        h('span', { className: 'grid h-8 w-8 place-items-center bg-black/45 text-racingYellow transition duration-300 group-hover:text-white' }, h(SocialIcon, { type: icon })),
        h('span', { className: compact ? 'hidden sm:inline' : '' }, handle)
      )
    )
  );
}

function FooterPolicyLinks({ lang }) {
  return h(
    'div',
    { className: 'footer-policy-actions' },
    footerLinks.map((item) =>
      h(
        'button',
        {
          key: item.ENG,
          type: 'button',
          onClick: () => openPolicyPage(item.href),
          className: 'policy-link min-h-12 border border-white/12 bg-white/[0.05] px-4 text-sm font-semibold text-white/72 backdrop-blur-xl transition duration-300 hover:border-luxuryRed hover:bg-luxuryRed/12 hover:text-white',
        },
        item[lang]
      )
    )
  );
}

function ensureEmailJsBrowserSdk() {
  if (window.emailjs?.send) {
    return Promise.resolve(window.emailjs);
  }

  if (!emailJsSdkLoadPromise) {
    emailJsSdkLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const resolveEmailJsClient = () => {
        if (window.emailjs?.send) {
          resolve(window.emailjs);
          return;
        }

        window.emailjs = createEmailJsFallbackClient();
        resolve(window.emailjs);
      };

      script.addEventListener('load', resolveEmailJsClient, { once: true });
      script.addEventListener('error', resolveEmailJsClient, { once: true });

      script.src = `${EMAILJS_SDK_URL}?v=4`;
      script.async = true;
      document.head.appendChild(script);
    });
  }

  return emailJsSdkLoadPromise;
}

function createEmailJsFallbackClient() {
  let publicKey = EMAILJS_PUBLIC_KEY;

  return {
    init(nextPublicKey) {
      publicKey = nextPublicKey;
    },
    send(serviceId, templateId, templateParams, nextPublicKey) {
      const userId = nextPublicKey || publicKey;

      return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('POST', 'https://api.emailjs.com/api/v1.0/email/send', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.onreadystatechange = () => {
          if (request.readyState !== 4) {
            return;
          }

          if (request.status >= 200 && request.status < 300) {
            resolve({ status: request.status, text: request.responseText });
          } else {
            reject(new Error(request.responseText || `Request failed with status ${request.status}`));
          }
        };
        request.onerror = () => reject(new Error('EmailJS network request failed.'));
        request.send(
          JSON.stringify({
            service_id: serviceId,
            template_id: templateId,
            user_id: userId,
            template_params: templateParams,
          })
        );
      });
    },
  };
}

async function sendContactWithEmailJsBrowser(contactFormData) {
  await ensureEmailJsBrowserSdk();

  if (!emailJsInitialized) {
    window.emailjs.init('JYW59QyKlid0i-wU8');
    emailJsInitialized = true;
  }

  return window.emailjs.send(
    'service_btd5z5f',
    'template_zhupw7t',
    {
      title: 'Team4 Contact',
      name: contactFormData.name,
      email: contactFormData.email,
      phone: contactFormData.phone,
      program: contactFormData.program,
      message: contactFormData.message,
      to_email: 'collegeteam4you@gmail.com',
    },
    'JYW59QyKlid0i-wU8'
  );
}

async function handleContactSubmit(event, lang, setFormStatus, setIsSubmitting) {
  event.preventDefault();
  const t = copy[lang];
  const formElement = event.currentTarget;
  const formData = new FormData(formElement);
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const phone = String(formData.get('phone') || '').trim();
  const selectedProgram = String(formData.get('selectedProgram') || '').trim();
  const message = String(formData.get('message') || '').trim();

  if (!name || !email || !phone || !selectedProgram || !message) {
    setFormStatus({ type: 'error', text: t.requiredMessage });
    return;
  }

  setIsSubmitting(true);
  setFormStatus(null);

  try {
    const contactFormData = {
      name,
      email,
      phone,
      program: selectedProgram,
      message,
    };

    await sendContactWithEmailJsBrowser(contactFormData);

    if (formElement) {
      formElement.reset();
    }
    setFormStatus({ type: 'success', text: t.successMessage });
  } catch (error) {
    console.error(error);
    const exactError = error?.message || String(error);
    setFormStatus({ type: 'error', text: `${t.errorMessage} ${exactError}` });
  } finally {
    setIsSubmitting(false);
  }
}

function HeroResume({ lang }) {
  const t = copy[lang];
  const [isOpen, setIsOpen] = React.useState(false);
  const visibleText = isOpen ? t.resumeText : t.resumeText.slice(0, 1);

  return h(
    'div',
    { className: 'hero-resume-card mt-10 border border-white/12 bg-black/45 p-5 backdrop-blur-xl md:p-6' },
    h('p', { className: 'text-xs font-black uppercase tracking-[0.32em] text-racingYellow' }, t.resumeTitle),
    h(
      'div',
      { className: `mt-4 space-y-4 overflow-hidden text-sm leading-7 text-white/64 transition-all duration-500 md:text-[15px] md:leading-8 ${isOpen ? 'max-h-[900px]' : 'max-h-[170px]'}` },
      visibleText.map((paragraph) => h('p', { key: paragraph }, paragraph))
    ),
    h(
      'button',
      {
        type: 'button',
        onClick: () => setIsOpen(!isOpen),
        className: 'resume-toggle-button mt-4 text-xs font-black uppercase tracking-[0.24em] text-luxuryRed transition hover:text-racingYellow',
      },
      isOpen ? t.showLess : t.readMore
    )
  );
}

function Header({ lang, setLang }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return h(
    'header',
    { className: 'fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/65 backdrop-blur-xl' },
    h(
      'nav',
      { className: 'mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8' },
      h(
        'a',
        { href: sectionHref('hero'), className: 'header-brand flex items-center gap-3' },
        h(
          'span',
          { className: 'header-logo-shell grid h-12 w-[76px] place-items-center overflow-hidden border border-white/12 bg-black/35 p-1 backdrop-blur-xl md:h-14 md:w-[92px]' },
          h('img', {
            src: assetUrls.team4Logo,
            alt: 'Team4 Sales College',
            className: 'h-full w-full object-contain',
            decoding: 'async',
            fetchPriority: 'high',
          })
        ),
        h(
          'span',
          { className: 'leading-tight' },
          h('span', { className: 'block text-sm font-extrabold uppercase tracking-[0.22em]' }, ''),
          h('span', { className: 'block text-xs font-extrabold text-white/70' }, 'Team4 Sales College')
        )
      ),
      h(
        'div',
        { className: 'hidden items-center gap-7 lg:flex' },
        navItems.map(([id, eng, geo]) =>
          h(
            'a',
            {
              key: id,
              href: sectionHref(id),
              className: 'text-xs font-bold uppercase tracking-[0.22em] text-white/60 transition hover:text-white',
            },
            lang === 'GEO' ? geo : eng
          )
        )
      ),
      h(
        'div',
        { className: 'flex items-center gap-3' },
        h(
          'button',
          {
            type: 'button',
            className: 'mobile-menu-toggle',
            onClick: () => setIsMobileMenuOpen((current) => !current),
            'aria-expanded': isMobileMenuOpen,
            'aria-label': lang === 'GEO' ? 'მენიუს გახსნა' : 'Open menu',
          },
          'MENU'
        ),
        h(LanguageSwitcher, { lang, setLang })
      )
    ),
    isMobileMenuOpen &&
      h(
        'div',
        { className: 'mobile-header-menu' },
        navItems.map(([id, eng, geo]) =>
          h(
            'a',
            {
              key: id,
              href: sectionHref(id),
              onClick: closeMobileMenu,
            },
            lang === 'GEO' ? geo : eng
          )
        )
      )
  );
}

function Hero({ lang }) {
  const t = copy[lang];
  const heroTitle = lang === 'GEO' ? '' : t.heroTitle.replace(/[.]+$/, '');
  return h(
    'section',
    { id: 'hero', className: 'hero-video-container relative flex min-h-screen w-full items-center justify-center overflow-hidden pt-24' },
    h(
      'video',
      {
        className: 'hero-video',
        autoPlay: true,
        muted: true,
        loop: true,
        playsInline: true,
        preload: 'metadata',
        'aria-hidden': 'true',
      },
      h('source', { src: './video.mp4', type: 'video/mp4' })
    ),
    h('div', { className: 'cinema-bg absolute inset-0' }),
    h('div', { className: 'absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(29,92,255,.20),transparent_30%),radial-gradient(circle_at_15%_75%,rgba(225,6,0,.34),transparent_30%),linear-gradient(180deg,rgba(3,3,5,.58)_0%,rgba(3,3,5,.82)_48%,#030305_100%)]' }),
    h(
      'div',
      { className: 'hero-overlay relative z-10 mx-auto w-full px-5 pb-16 pt-12 md:px-8 md:pt-20' },
      h(
        'div',
        { className: 'hero-container mx-auto w-full max-w-7xl' },
        h(
          'div',
          { className: 'hero-left' },
          h(
            'h1',
            { className: 'hero-title hero-title-ka main-title' },
            lang === 'GEO'
              ? [
                  h('span', { key: 'geo-title-1' }, 'გაყიდვები ტალანტი არ არის —'),
                  h('span', { key: 'geo-title-2' }, 'ეს ფსიქოლოგია'),
                ]
              : h('span', null, heroTitle)
          ),
          h('p', { className: 'mt-7 text-lg font-semibold uppercase tracking-[0.24em] text-white/78 md:text-xl' }, t.heroSubtitle),
          h('p', { className: 'mt-7 text-lg leading-8 text-white/64' }, t.heroText),
          h(
            'div',
            { className: 'hero-cta-row mt-10 flex flex-col gap-4 sm:flex-row' },
            h(Button, { href: '#contact' }, t.book),
            h(Button, { href: '#winspace' }, t.openDoor),
            h(Button, { href: '#book' }, t.resumeBookCta)
          ),
          h(HeroResume, { lang })
        ),
        h(
          'div',
          { className: 'hero-right reveal delay-150' },
          h(
            'div',
            { className: 'hero-visual-card relative overflow-hidden border border-white/15 bg-black/45 p-2 shadow-2xl backdrop-blur-xl' },
            h('img', {
              src: assetUrls.heroImage,
              alt: 'Lasha Khurtsidze premium business visual',
              className: 'block aspect-[4/5] min-h-[420px]',
              decoding: 'async',
              fetchPriority: 'high',
            })
          )
        )
      )
    ),
    h('div', { className: 'absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-ink to-transparent' })
  );
}

function About({ lang }) {
  const t = copy[lang];
  return h(
    'section',
    { id: 'about', className: 'border-y border-white/10 bg-carbon py-24 md:py-32' },
    h(
      'div',
      { className: 'about-layout mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-[.8fr_1.2fr] md:px-8' },
      h(
        'div',
        { className: 'reveal about-brand-column about-left' },
        h(
          'div',
          { className: 'about-logo-stage' },
          h('img', {
            src: assetUrls.team4Logo,
            alt: 'Team4 Sales College',
            loading: 'lazy',
            decoding: 'async',
            className: 'about-team4-logo',
          })
        )
      ),
      h(
        'div',
        { className: 'about-text-column reveal delay-150 space-y-7' },
        t.aboutParagraphs.map((paragraph, index) => h('p', { key: paragraph, className: `whitespace-pre-line text-lg leading-9 md:text-xl md:leading-10 ${index === t.aboutParagraphs.length - 1 ? 'border-l-2 border-luxuryRed pl-5 font-semibold text-white/82' : 'text-white/68'}` }, paragraph))
      )
    )
  );
}

function Courses({ lang }) {
  const t = copy[lang];
  return h(
    'section',
    { id: 'courses', className: 'answer-section white-section light-section bg-softWhite py-24 text-ink md:py-32' },
    h(
      'div',
      { className: 'mx-auto max-w-7xl px-5 md:px-8' },
      h(
        'div',
        { className: 'mx-auto max-w-[900px] text-center reveal' },
        h('h2', { className: 'font-display text-4xl font-extrabold leading-tight text-ink md:text-6xl' }, t.coursesTitle),
        h('div', { className: 'mx-auto mt-8 h-px w-24 bg-luxuryRed' }),
        h('p', { className: 'mt-8 text-lg leading-9 text-black/66 md:text-xl md:leading-10' }, t.coursesText)
      )
    )
  );
}

function BookGallery({ lang }) {
  const t = copy[lang];
  const [activeImage, setActiveImage] = React.useState(null);

  return h(
    'section',
    { id: 'book', className: 'book-gallery-section relative overflow-hidden border-y border-white/10 bg-ink py-24 text-white md:py-32' },
    h('div', { className: 'cinema-bg absolute inset-0 opacity-35' }),
    h('div', { className: 'speed-lines absolute inset-0' }),
    h('div', { className: 'absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(225,6,0,.22),transparent_28%),radial-gradient(circle_at_82%_64%,rgba(29,92,255,.22),transparent_34%),linear-gradient(180deg,rgba(3,3,5,.12),#030305_88%)]' }),
    h(
      'div',
      { className: 'relative z-10 mx-auto max-w-7xl px-5 md:px-8' },
      h(
        'div',
        { className: 'mx-auto mb-12 max-w-4xl text-center reveal' },
        h('h2', { className: 'font-display text-4xl font-extrabold leading-tight md:text-6xl' }, t.bookGalleryTitle),
        h('p', { className: 'mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/62' }, t.bookGallerySubtitle)
      ),
      h(
        'div',
        { className: 'book-gallery-track reveal delay-150 flex gap-5 overflow-x-auto pb-5' },
        bookGalleryImages.map((src, index) =>
          h(
            'button',
            {
              key: src,
              type: 'button',
              className: 'book-gallery-card group relative shrink-0 overflow-hidden border border-white/12 bg-black/45 p-3 text-left backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-luxuryRed/70',
              onClick: () => setActiveImage(src),
              'aria-label': `${t.bookGalleryTitle} image ${index + 1}`,
            },
            h('img', { src, alt: `${t.bookGalleryTitle} ${index + 1}`, loading: 'lazy', decoding: 'async', className: 'h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]' }),
            h('span', { className: 'absolute left-5 top-5 bg-black/60 px-3 py-2 text-xs font-black uppercase tracking-[0.24em] text-racingYellow backdrop-blur-md' }, `0${index + 1}`)
          )
        )
      ),
      h(
        'div',
        { className: 'book-purchase-cta reveal mx-auto mt-14 max-w-2xl text-center' },
        h('p', { className: 'text-sm font-bold uppercase tracking-[0.28em] text-white/62' }, t.purchaseSubtitle),
        h(
          'a',
            {
              href: '#contact',
              className: 'site-cta book-purchase-button group mt-6 inline-flex min-h-14 items-center justify-center gap-3 px-10 py-5 text-sm font-black uppercase tracking-[0.26em] text-white transition duration-300',
            },
          t.purchaseButton,
          h('span', { className: 'transition duration-500 group-hover:translate-x-1' }, '->')
        )
      )
    ),
    activeImage &&
      h(
        'div',
        { className: 'book-lightbox fixed inset-0 z-[80] grid place-items-center bg-black/88 p-4 backdrop-blur-xl', onClick: () => setActiveImage(null) },
        h('button', { type: 'button', className: 'absolute right-5 top-5 border border-white/15 bg-white/10 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:border-luxuryRed hover:bg-luxuryRed/20', onClick: () => setActiveImage(null) }, 'Close'),
        h('img', { src: activeImage, alt: t.bookGalleryTitle, decoding: 'async', className: 'max-h-[86vh] max-w-[94vw] object-contain shadow-2xl shadow-black' })
      )
  );
}

function Programs({ lang }) {
  const [activeProgram, setActiveProgram] = React.useState(null);
  const openProgram = (program) => {
    if (program.image) openProgramPage(program);
  };
  const handleProgramKey = (event, program) => {
    if (!program.image) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProgramPage(program);
    }
  };

  return h(
    'section',
    { id: 'programs', className: 'relative overflow-hidden border-y border-white/10 bg-ink py-12 md:py-16' },
    h('div', { className: 'cinema-bg absolute inset-0 opacity-40' }),
    h('div', { className: 'speed-lines absolute inset-0' }),
    h('div', { className: 'absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(225,6,0,.24),transparent_27%),radial-gradient(circle_at_82%_70%,rgba(29,92,255,.24),transparent_32%),linear-gradient(180deg,rgba(3,3,5,.2),#030305_92%)]' }),
    h(
      'div',
      { className: 'relative z-10 mx-auto max-w-7xl px-5 md:px-8' },
      h(
        'div',
        { className: 'programs-grid grid justify-center gap-5 md:gap-6' },
        programs.map((program, i) => {
          const text = programText(program, lang);
          return h(
            'a',
            {
              key: program.id,
              href: programPageUrl(program),
              target: '_blank',
              rel: 'noopener noreferrer',
              'aria-label': `${text.title} - ${text.button}`,
              onClick: (event) => {
                event.preventDefault();
                openProgramPage(program);
              },
              className: `program-card program-cover-card reveal group cursor-pointer overflow-hidden border border-white/12 bg-black/55 text-inherit no-underline backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-luxuryRed/80 tone-${program.tone}`,
              style: { transitionDelay: `${i * 55}ms` },
            },
            h('img', { src: program.image, alt: text.title, loading: 'lazy', decoding: 'async', className: 'program-cover-image absolute inset-0 h-full w-full object-cover' }),
            h('div', { className: 'program-cover-shade absolute inset-0' }),
            h(
              'div',
              { className: 'program-cover-content absolute bottom-0 left-0 right-0 z-10 p-6 pb-8 md:p-7 md:pb-10' },
              h('h3', { className: 'max-w-[15rem] text-2xl font-extrabold leading-tight text-white md:text-3xl' }, text.title),
              h('p', { className: 'mt-4 max-w-[19rem] text-sm leading-6 text-white/72' }, text.subtitle),
              h(
                'span',
                { className: 'site-cta mt-6 inline-flex items-center gap-3 border border-white/16 bg-black/42 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-white shadow-glowRed backdrop-blur-md transition duration-500 group-hover:border-luxuryRed/75 group-hover:bg-luxuryRed/25' },
                text.button,
                h('span', { className: 'transition duration-500 group-hover:translate-x-1' }, '->')
              )
            )
          )
        })
      )
    ),
    activeProgram &&
      h(
        'div',
        { className: 'program-syllabus-modal fixed inset-0 z-[90] grid place-items-center bg-black/88 p-4 backdrop-blur-xl', onClick: () => setActiveProgram(null) },
        h(
          'div',
          {
            className: 'relative w-full max-w-3xl overflow-hidden border border-white/12 bg-[#050507]/95 p-6 shadow-2xl shadow-black md:p-8',
            onClick: (event) => event.stopPropagation(),
          },
          h('div', { className: 'absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(225,6,0,.22),transparent_32%),radial-gradient(circle_at_86%_84%,rgba(29,92,255,.2),transparent_34%)]' }),
          h(
            'button',
            {
              type: 'button',
              className: 'absolute right-4 top-4 z-10 border border-white/15 bg-white/10 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:border-luxuryRed hover:bg-luxuryRed/20',
              onClick: () => setActiveProgram(null),
            },
            'Close'
          ),
          h(
            'div',
            { className: 'relative z-10 grid gap-7 md:grid-cols-[.88fr_1.12fr]' },
            h(
              'div',
              { className: `program-modal-image-frame overflow-hidden border border-white/12 ${activeProgram.modalImageMode === 'logo' ? 'program-modal-logo-frame' : 'bg-black/50'}` },
              activeProgram.modalImageMode === 'logo'
                ? h(
                    React.Fragment,
                    null,
                    h('img', { src: activeProgram.modalImage, alt: programText(activeProgram, lang).title, loading: 'lazy', decoding: 'async', className: 'program-modal-logo-image relative z-10 w-full object-contain' }),
                    activeProgram.youtubeUrl &&
                      h(
                        'div',
                        {
                          className: 'youtube-channel-wrap',
                        },
                        h(
                          'button',
                          {
                            type: 'button',
                            onClick: () => {
                              window.location.href = buttonLinks.winspace;
                            },
                            className: 'site-cta youtube-channel-btn program-modal-youtube inline-flex items-center justify-center gap-3 bg-luxuryRed px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white shadow-glowRed transition duration-500 hover:bg-[#ff1e18]',
                          },
                          lang === 'GEO' ? 'YOUTUBE-ზე გადასვლა ->' : 'GO TO YOUTUBE ->'
                        )
                      )
                  )
                : h('img', { src: activeProgram.modalImage || activeProgram.image, alt: programText(activeProgram, lang).title, loading: 'lazy', decoding: 'async', className: `h-full min-h-[280px] w-full object-cover ${activeProgram.modalImage ? 'program-modal-portrait' : ''}` })
            ),
            h(
              'div',
              { className: 'flex flex-col justify-center' },
              h('p', { className: 'text-xs font-black uppercase tracking-[0.36em] text-luxuryRed' }, programText(activeProgram, lang).button),
              h('h3', { className: 'mt-4 font-display text-3xl font-extrabold leading-tight text-white md:text-5xl' }, programText(activeProgram, lang).syllabusTitle),
              h(
                'ul',
                { className: 'program-syllabus-list mt-7 space-y-4 overflow-y-auto pr-2 text-sm leading-7 text-white/72 md:text-base' },
                programText(activeProgram, lang).syllabus.map((item) =>
                  h('li', { key: item, className: 'flex gap-3' }, h('span', { className: 'mt-3 h-px w-6 shrink-0 bg-luxuryRed' }), h('span', null, item))
                )
              ),
              activeProgram.id === 'brand-sales-video-production'
                ? h(
                    'button',
                    {
                      type: 'button',
                      onClick: () => {
                        window.location.href = buttonLinks.commercialProjects;
                      },
                      className: `commercial-projects-cta ${programModalCtaClass(activeProgram)}`,
                    },
                    programModalCta(activeProgram, lang),
                    h('span', null, '->')
                  )
                : h(
                    'a',
                    {
                      href: programModalCtaHref(activeProgram),
                      onClick: () => setActiveProgram(null),
                      className: programModalCtaClass(activeProgram),
                    },
                    programModalCta(activeProgram, lang),
                    h('span', null, '->')
                  )
            )
          )
        )
      )
  );
}

function ProgramDetailPage({ lang, setLang }) {
  const programId = window.location.pathname.split('/').filter(Boolean).pop();
  const program = programs.find((item) => item.id === programId) || programs[0];
  const text = programText(program, lang);
  const isBrandVideo = program.id === 'brand-sales-video-production';

  return h(
    React.Fragment,
    null,
    h('div', { className: 'luxury-light-field', 'aria-hidden': 'true' }),
    h(Header, { lang, setLang }),
    h(
      'main',
      { className: 'program-detail-page' },
      h(
        'section',
        { className: 'program-detail-shell carbon-weave' },
        h(
          'button',
          {
            type: 'button',
            className: 'program-detail-close',
            onClick: () => {
              window.location.href = '/index.html#programs';
            },
          },
          lang === 'GEO' ? 'დახურვა' : 'Close'
        ),
        h(
          'div',
          { className: 'program-detail-grid' },
          h(
            'div',
            { className: `program-modal-image-frame program-detail-media ${program.modalImageMode === 'logo' ? 'program-modal-logo-frame' : 'bg-black/50'}` },
            program.modalImageMode === 'logo'
              ? h(
                  React.Fragment,
                  null,
                  h('img', { src: program.modalImage, alt: text.title, decoding: 'async', className: 'program-modal-logo-image relative z-10 w-full object-contain' }),
                  program.youtubeUrl &&
                    h(
                      'div',
                      { className: 'youtube-channel-wrap' },
                      h(
                        'button',
                        {
                          type: 'button',
                          onClick: () => {
                            window.location.href = buttonLinks.winspace;
                          },
                          className: 'site-cta youtube-channel-btn program-modal-youtube inline-flex items-center justify-center gap-3 bg-luxuryRed px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white shadow-glowRed transition duration-500 hover:bg-[#ff1e18]',
                        },
                        lang === 'GEO' ? 'YOUTUBE-ზე გადასვლა ->' : 'GO TO YOUTUBE ->'
                      )
                    )
                )
              : h('img', { src: program.modalImage || program.image, alt: text.title, decoding: 'async', className: `program-detail-image ${program.modalImage ? 'program-modal-portrait' : ''}` })
          ),
          h(
            'div',
            { className: 'program-detail-content' },
            h('p', { className: 'program-detail-eyebrow' }, text.button),
            h('h1', { className: 'program-detail-title' }, text.syllabusTitle),
            h(
              'ul',
              { className: 'program-syllabus-list program-detail-list' },
              text.syllabus.map((item) =>
                h('li', { key: item }, h('span', { 'aria-hidden': 'true' }), h('strong', null, item))
              )
            ),
            isBrandVideo
              ? h(
                  'button',
                  {
                    type: 'button',
                    onClick: () => {
                      window.location.href = buttonLinks.commercialProjects;
                    },
                    className: `commercial-projects-cta ${programModalCtaClass(program)}`,
                  },
                  programModalCta(program, lang),
                  h('span', null, '->')
                )
              : h(
                  'a',
                  {
                    href: programModalCtaHref(program),
                    className: programModalCtaClass(program),
                  },
                  programModalCta(program, lang),
                  h('span', null, '->')
                )
          )
        )
      )
    )
  );
}

function WinSpaceSection({ lang }) {
  const t = copy[lang];
  const winspaceUrl = buttonLinks.winspace;
  return h(
    'section',
    { id: 'winspace', className: 'relative overflow-hidden border-y border-white/10 bg-carbon py-24 md:py-32' },
    h('div', { className: 'speed-lines absolute inset-0' }),
    h('div', { className: 'pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(225,6,0,.26),transparent_28%),radial-gradient(circle_at_82%_72%,rgba(29,92,255,.2),transparent_32%)]' }),
    h(
      'div',
      { className: 'relative mx-auto grid max-w-7xl items-center gap-10 px-5 md:grid-cols-[1fr_.82fr] md:px-8' },
      h(
        'div',
        { className: 'reveal' },
        h('p', { className: 'mb-4 text-xs font-bold uppercase tracking-[0.38em] text-racingYellow' }, t.eventKicker),
        h('h2', { className: 'font-display text-4xl font-extrabold leading-tight md:text-6xl' }, t.eventTitle),
        h('p', { className: 'mt-6 max-w-2xl text-lg leading-8 text-white/64' }, t.eventText),
        h(
          'div',
          { className: 'winspace-cta-wrap mt-10' },
          h(
            'button',
            {
              type: 'button',
              onClick: () => {
                window.location.href = winspaceUrl;
              },
              className: 'site-cta winspace-cta group inline-flex min-h-12 items-center justify-center gap-3 bg-luxuryRed px-6 py-3 text-sm font-bold uppercase tracking-[0.22em] text-white shadow-glowRed transition duration-500 hover:bg-[#ff1e18]',
            },
            t.openDoor,
            h('span', { className: 'transition duration-500 group-hover:translate-x-1' }, '->')
          )
        )
      ),
      h(
        'div',
        { className: 'winspace-logo-card carbon-weave reveal delay-150 border border-white/12 bg-black/45 p-7 backdrop-blur-xl md:p-9' },
        h(
          'div',
          { className: 'relative grid min-h-[310px] place-items-center overflow-hidden bg-black/35 p-6' },
          h('div', { className: 'absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,.06),rgba(3,3,5,.4))]' }),
          h('img', { src: assetUrls.winspaceLogo, alt: 'WinSpace logo', loading: 'lazy', decoding: 'async', className: 'relative z-10 max-h-[260px] w-full max-w-[420px] object-contain drop-shadow-2xl' })
        ),
        h('p', { className: 'winspace-format-label relative mt-8 text-sm font-bold uppercase tracking-[0.32em] text-luxuryRed' }, t.eventFormat),
        h(
          'div',
          { className: 'relative mt-8 space-y-6' },
          t.eventItems.map((item) =>
            h('div', { key: item, className: 'winspace-topic-item flex items-center gap-4 border-b border-white/10 pb-5 text-white/75' }, h('span', { className: 'h-2 w-2 bg-racingYellow' }), item)
          )
        )
      )
    )
  );
}

function Testimonials({ lang }) {
  const t = copy[lang];
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [managedTestimonials, setManagedTestimonials] = React.useState([]);

  React.useEffect(() => {
    setManagedTestimonials(loadManagedTestimonials());
  }, []);

  function handleTestimonialSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newComment = {
      id: `visitor-${Date.now()}`,
      name: String(formData.get('testimonialName') || '').trim(),
      roleGeo: String(formData.get('testimonialRole') || '').trim(),
      roleEng: String(formData.get('testimonialRole') || '').trim(),
      quoteGeo: String(formData.get('testimonialComment') || '').trim(),
      quoteEng: String(formData.get('testimonialComment') || '').trim(),
    };

    if (!newComment.name || !newComment.roleGeo || !newComment.quoteGeo) {
      return;
    }

    const nextTestimonials = [newComment, ...managedTestimonials];
    setManagedTestimonials(nextTestimonials);
    localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(nextTestimonials));
    event.currentTarget.reset();
    setIsModalOpen(false);
  }

  return h(
    'section',
    { id: 'testimonials', className: 'relative py-24 md:py-32' },
    h(
      'div',
      { className: 'mx-auto max-w-7xl px-5 md:px-8' },
      h(SectionTitle, { kicker: t.testimonialsKicker, title: t.testimonialsTitle }),
      h(
        'div',
        { className: 'grid gap-5 md:grid-cols-3' },
        managedTestimonials.map((item) =>
          h('figure', { key: item.id, className: 'automotive-card reveal is-visible border border-white/10 bg-white/[0.035] p-7' }, h('blockquote', { className: 'relative text-xl font-semibold leading-8 text-white' }, lang === 'GEO' ? item.quoteGeo : item.quoteEng), h('figcaption', { className: 'relative mt-8 border-t border-white/10 pt-5 text-sm text-white/55' }, h('strong', { className: 'block text-white' }, item.name), lang === 'GEO' ? item.roleGeo : item.roleEng))
        )
      ),
      h(
        'div',
        { className: 'mt-12 text-center' },
        h('button', { type: 'button', onClick: () => setIsModalOpen(true), className: 'site-cta group inline-flex min-h-12 items-center justify-center gap-3 border border-white/14 bg-white/[0.04] px-6 py-3 text-sm font-bold uppercase tracking-[0.22em] text-white backdrop-blur-xl transition duration-500 hover:border-luxuryRed hover:bg-luxuryRed/15 hover:shadow-glowRed' }, t.leaveComment, h('span', { className: 'transition duration-500 group-hover:translate-x-1' }, '->'))
      )
    ),
    isModalOpen &&
      h(
        'div',
        { className: 'testimonial-modal fixed inset-0 z-[90] grid place-items-center bg-black/85 p-4 backdrop-blur-xl' },
        h(
          'form',
          { className: 'contact-panel carbon-weave grid w-full max-w-xl gap-4 border border-white/12 bg-black/60 p-6 text-white backdrop-blur-xl md:p-8', onSubmit: handleTestimonialSubmit },
          h('div', { className: 'flex items-center justify-between gap-4' }, h('p', { className: 'text-sm font-bold uppercase tracking-[0.32em] text-luxuryRed' }, t.leaveComment), h('button', { type: 'button', onClick: () => setIsModalOpen(false), className: 'border border-white/12 bg-white/[0.04] px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-white/70 transition hover:border-luxuryRed hover:text-white' }, t.testimonialClose)),
          h('input', { name: 'testimonialName', required: true, className: 'relative min-h-14 border border-white/12 bg-white/[0.06] px-5 text-base text-white outline-none transition placeholder:text-white/36 focus:border-racingYellow focus:bg-white/[0.09]', placeholder: t.testimonialName }),
          h('input', { name: 'testimonialRole', required: true, className: 'relative min-h-14 border border-white/12 bg-white/[0.06] px-5 text-base text-white outline-none transition placeholder:text-white/36 focus:border-racingYellow focus:bg-white/[0.09]', placeholder: t.testimonialRole }),
          h('textarea', { name: 'testimonialComment', required: true, className: 'relative min-h-36 border border-white/12 bg-white/[0.06] px-5 py-4 text-base text-white outline-none transition placeholder:text-white/36 focus:border-racingYellow focus:bg-white/[0.09]', placeholder: t.testimonialComment }),
          h('button', { className: 'site-cta relative mt-2 min-h-14 bg-luxuryRed px-6 text-sm font-extrabold uppercase tracking-[0.24em] text-white shadow-glowRed transition hover:bg-[#ff1e18]' }, t.testimonialSubmit)
        )
      )
  );
}

function Contact({ lang }) {
  const t = copy[lang];
  const [formStatus, setFormStatus] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isProgramMenuOpen, setIsProgramMenuOpen] = React.useState(false);
  const [selectedProgram, setSelectedProgram] = React.useState('');
  const programOptions = React.useMemo(
    () => [
      ...programs.map((program) => {
        const text = programText(program, lang);
        return { value: text.title, label: text.title };
      }),
      { value: 'purchase', label: lang === 'GEO' ? 'წიგნის შეძენა' : 'Book Purchase' },
    ],
    [lang]
  );
  const selectedProgramLabel = programOptions.find((item) => item.value === selectedProgram)?.label || t.selectedProgram;

  React.useEffect(() => {
    setSelectedProgram('');
    setIsProgramMenuOpen(false);
  }, [lang]);

  return h(
    'section',
    { id: 'contact', className: 'premium-contact relative overflow-hidden border-t border-white/10 bg-ink py-24 text-white md:py-32' },
    h('div', { className: 'cinema-bg absolute inset-0 opacity-45' }),
    h('div', { className: 'speed-lines absolute inset-0' }),
    h('div', { className: 'absolute inset-0 bg-[radial-gradient(circle_at_22%_20%,rgba(225,6,0,.3),transparent_28%),radial-gradient(circle_at_78%_72%,rgba(29,92,255,.22),transparent_30%),linear-gradient(180deg,rgba(3,3,5,.2),#030305_82%)]' }),
    h(
      'div',
      { className: 'relative z-10 mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-[.95fr_1.05fr] md:px-8' },
      h(
        'div',
        { className: 'reveal' },
        h('p', { className: 'mb-5 text-xs font-bold uppercase tracking-[0.38em] text-racingYellow' }, t.contactKicker),
        h('p', { className: 'mt-4 border-l-2 border-luxuryRed pl-6 text-2xl font-semibold leading-10 text-white/88 md:text-3xl md:leading-[1.38]' }, t.contactQuote),
        h('p', { className: 'mt-6 max-w-xl text-lg leading-8 text-white/58' }, t.contactText),
        h(
          'div',
          { className: 'mt-8 grid gap-3 sm:grid-cols-2' },
          h('a', { href: `tel:${contactInfo.phone.replace(/\s/g, '')}`, className: 'contact-direct-link' }, h('span', null, t.phoneLabel), h('strong', null, contactInfo.phone)),
          h('a', {
            href: `mailto:${contactInfo.email}`,
            className: 'contact-direct-link contact-email-card',
            style: {
              cursor: 'pointer',
              position: 'relative',
              zIndex: 999999,
              pointerEvents: 'auto',
            },
          }, h('span', null, t.emailLabel), h('strong', null, contactInfo.email))
        ),
        h(SocialLinks)
      ),
      h(
        'form',
        {
          className: 'contact-panel carbon-weave reveal delay-150 grid gap-4 border border-white/12 bg-black/45 p-6 backdrop-blur-xl md:p-8',
          onSubmit: (event) => handleContactSubmit(event, lang, setFormStatus, setIsSubmitting),
        },
        h('p', { className: 'relative mb-2 text-sm font-bold uppercase tracking-[0.32em] text-luxuryRed' }, t.contactStart),
        h('input', { name: 'name', required: true, className: 'relative min-h-14 border border-white/12 bg-white/[0.06] px-5 text-base text-white outline-none transition placeholder:text-white/36 focus:border-racingYellow focus:bg-white/[0.09]', placeholder: t.name }),
        h('input', { name: 'email', type: 'email', required: true, className: 'relative min-h-14 border border-white/12 bg-white/[0.06] px-5 text-base text-white outline-none transition placeholder:text-white/36 focus:border-racingYellow focus:bg-white/[0.09]', placeholder: t.email }),
        h('input', { name: 'phone', type: 'tel', required: true, className: 'relative min-h-14 border border-white/12 bg-white/[0.06] px-5 text-base text-white outline-none transition placeholder:text-white/36 focus:border-racingYellow focus:bg-white/[0.09]', placeholder: t.phone }),
        h(
          'div',
          { className: 'contact-program-picker' },
          h('input', { type: 'hidden', name: 'selectedProgram', required: true, value: selectedProgram }),
          h(
            'button',
            {
              type: 'button',
              className: `contact-program-trigger ${selectedProgram ? 'is-selected' : ''}`,
              onClick: () => setIsProgramMenuOpen((current) => !current),
              'aria-expanded': isProgramMenuOpen,
            },
            selectedProgramLabel,
            h('span', { 'aria-hidden': 'true' }, isProgramMenuOpen ? '−' : '+')
          ),
          isProgramMenuOpen &&
            h(
              'div',
              { className: 'contact-program-menu' },
              programOptions.map((option) =>
                h(
                  'button',
                  {
                    key: option.value,
                    type: 'button',
                    className: selectedProgram === option.value ? 'is-active' : '',
                    onClick: () => {
                      setSelectedProgram(option.value);
                      setIsProgramMenuOpen(false);
                    },
                  },
                  option.label
                )
              )
            )
        ),
        h('textarea', { name: 'message', required: true, className: 'relative min-h-36 border border-white/12 bg-white/[0.06] px-5 py-4 text-base text-white outline-none transition placeholder:text-white/36 focus:border-racingYellow focus:bg-white/[0.09]', placeholder: t.message }),
        formStatus && h('p', { className: `relative border px-4 py-3 text-sm font-semibold ${formStatus.type === 'success' ? 'border-racingYellow/30 bg-racingYellow/10 text-racingYellow' : 'border-luxuryRed/40 bg-luxuryRed/10 text-white'}` }, formStatus.text),
        h('button', { type: 'submit', disabled: isSubmitting, className: 'site-cta relative mt-2 min-h-14 bg-luxuryRed px-6 text-sm font-extrabold uppercase tracking-[0.24em] text-white shadow-glowRed transition hover:bg-[#ff1e18] disabled:cursor-wait disabled:opacity-70' }, isSubmitting ? t.sending : t.contactMe)
      )
    ),
    h('div', { className: 'absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-racingYellow/50 to-transparent' })
  );
}

function Footer({ lang }) {
  return h(
    'footer',
    { className: 'relative overflow-hidden border-t border-white/10 bg-black py-10 text-white' },
    h(
      'div',
      { className: 'relative z-[9999] mx-auto grid max-w-7xl gap-8 px-5 md:grid-cols-[1fr_auto] md:items-center md:px-8' },
      h(
        'div',
        null,
        h('p', { className: 'text-sm font-extrabold uppercase tracking-[0.24em]' }, 'Team4 Sales College'),
        h('p', { className: 'mt-2 max-w-xl text-sm leading-6 text-white/55' }, lang === 'GEO' ? 'რეალური გაყიდვები, მოლაპარაკება, NLP და ციფრული მარკეტინგი პრემიუმ ბიზნეს შედეგებისთვის.' : 'Real sales, negotiation, NLP, and digital marketing for premium business results.'),
        h(
          'div',
          { className: 'footer-contact-links mt-5' },
          h('a', { href: `tel:${contactInfo.phone.replace(/\s/g, '')}`, className: 'footer-contact-link' }, contactInfo.phone),
          h('a', { href: `mailto:${contactInfo.email}`, className: 'footer-contact-link' }, contactInfo.email)
        ),
        h('a', { href: '/admin', className: 'footer-admin-link mt-4' }, 'Admin')
      ),
      h('div', null, h(FooterPolicyLinks, { lang }))
    )
  );
}

function App() {
  const [lang, setLang] = React.useState(() => localStorage.getItem('team4Lang') || 'GEO');
  const isProgramPage = window.location.pathname.startsWith('/program/');

  if (isProgramPage) {
    return h(ProgramDetailPage, { lang, setLang });
  }

  return h(React.Fragment, null, h('div', { className: 'luxury-light-field', 'aria-hidden': 'true' }), h(Header, { lang, setLang }), h('main', null, h(Hero, { lang }), h(About, { lang }), h(Courses, { lang }), h(BookGallery, { lang }), h(Programs, { lang }), h(WinSpaceSection, { lang }), h(Testimonials, { lang }), h(Contact, { lang })), h(Footer, { lang }));
}

ReactDOM.createRoot(document.getElementById('root')).render(h(App));
