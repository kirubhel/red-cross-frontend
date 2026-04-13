export type Language = 'en' | 'am' | 'om';

export const translations = {
  en: {
    nav: {
      about: "About",
      services: "Services",
      impact: "Impact",
      news: "News",
      organizations: "Volunteer Requests",
      portal: "Portal Access",
      join: "Join Membership"
    },
    hero: {
      tagline: "75 Years of Service",
      title1: "Saving Lives",
      title2: "Changing",
      title3: "Minds.",
      subtitle: "Join the Ethiopian Red Cross Society (ERCS) to make a difference in your community. We believe in the power of humanity to overcome any challenge.",
      ctaPrimary: "Get Started",
      ctaSecondary: "Donate Now",
      ctaVolunteer: "Become a Member",
      ctaMembership: "Membership",
      ctaDonate: "Donate",
      pathwaysLabel: "Choose your path to help:",
      volunteers: "Volunteers",
      anniversary: "Celebrating 90 Years of Humanitarian Excellence",
      imageUrl: "https://redcrosseth.org/wp-content/uploads/2025/06/90-AMET-COVER-for-website-1200-by-700.png"
    },
    stats: {
      volunteers: "Volunteers",
      branches: "Regional Branches",
      impact: "Humanitarian Impact",
      founded: "Founded",
      impactValue: "High"
    },
    whoWeAre: {
      badge: "Who We Are",
      title: "Leading humanitarian organization in Ethiopia",
      storyTitle: "Our Story",
      storyText1: "The Ethiopian Red Cross Society has been at the forefront of humanitarian action in Ethiopia for decades. As part of the International Red Cross and Red Crescent Movement, we are committed to preventing and alleviating human suffering.",
      storyText2: "We work tirelessly to protect life and health, ensure respect for human beings, and prevent and alleviate human suffering. Guided by the seven Fundamental Principles.",
      missionTitle: "Our Mission",
      missionText: "To prevent and alleviate human suffering, protect life and health, and ensure respect for the human being, without any discrimination.",
      visionTitle: "Our Vision",
      visionText: "To be a leading, strong, and self-reliant humanitarian organization that provides effective and efficient services to the vulnerable.",
      valuesTitle: "Our Values",
      valuesText: "Guided by the 7 Principles: Humanity, Impartiality, Neutrality, Independence, Voluntary Service, Unity, and Universality.",
      imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200",
      historyLink: "https://www.redcrosseth.org/who-we-are/background-and-history",
      historyLinkLabel: "Read Full History"
    },
    services: {
      badge: "What we do",
      title: "Our Core Service Areas.",
      items: [
        {
          id: "drm",
          title: "Disaster Risk Management (DRM)",
          desc: "Emergency preparedness and response; Disaster risk reduction (DRR); Early warning systems and community resilience building; Relief distribution (food, shelter, non-food items)",
          icon: "ShieldCheck",
          color: "text-ercs-red",
          bg: "bg-red-50"
        },
        {
          id: "health",
          title: "Health and Care Services",
          desc: "First aid training and emergency medical services; Community-based health and nutrition programs; Epidemic prevention and response; Maternal and child health support",
          icon: "Activity",
          color: "text-ercs-red",
          bg: "bg-red-50"
        },
        {
          id: "wash",
          title: "Water, Sanitation and Hygiene (WASH)",
          desc: "Provision of safe drinking water; Sanitation facility construction and promotion; Hygiene awareness campaigns; Emergency WASH interventions",
          icon: "Droplets",
          color: "text-blue-500",
          bg: "bg-blue-50"
        },
        {
          id: "volunteer",
          title: "Volunteer and Youth Engagement",
          desc: "Recruitment, training, and deployment of volunteers; Youth programs and community service initiatives; Capacity building and retention strategies",
          icon: "Users",
          color: "text-ercs-red",
          bg: "bg-red-50"
        },
        {
          id: "rfl",
          title: "Restoring Family Links (RFL)",
          desc: "Tracing and reunification of separated family members; Support for migrants, refugees, and internally displaced persons; Communication services between families",
          icon: "Heart",
          color: "text-ercs-red",
          bg: "bg-red-50"
        },
        {
          id: "food",
          title: "Food Security and Livelihoods",
          desc: "Support to vulnerable households; Livelihood diversification programs; Cash and voucher assistance; Climate resilience initiatives",
          icon: "Plus",
          color: "text-ercs-red",
          bg: "bg-red-50"
        },
        {
          id: "blood",
          title: "Blood Services",
          desc: "Blood donation campaigns; Blood bank support and management; Promotion of voluntary, non-remunerated blood donation",
          icon: "Activity",
          color: "text-ercs-red",
          bg: "bg-red-50"
        },
        {
          id: "values",
          title: "Humanitarian Values and Principles",
          desc: "Promotion of Red Cross principles (humanity, neutrality, impartiality, independence, voluntary service, unity, universality); Community awareness and advocacy",
          icon: "Globe",
          color: "text-ercs-red",
          bg: "bg-red-50"
        }
      ],
      learnMore: "Learn more"
    },
    membership: {
      badge: "Stronger Together",
      title: "Become a Life Member.",
      desc: "Join millions of Ethiopians who sustain our humanitarian mission permanently. As a member, you gain voting rights and help decide the direction of our society.",
      features: [
        "Participate in General Assemblies",
        "Support Sustainable Aid Operations",
        "Receive Official Membership Credentials",
        "A Voice in National Humanitarian Decisions"
      ],
      cta: "Join Membership",
      activeMembers: "Active Members",
      tiersLabel: "Membership Tiers",
      tiers: {
        individual: [
          { name: "Regular Member", price: "50-999 ETB" },
          { name: "Individual Lifetime", price: "1000-1999 ETB" },
          { name: "Family Lifetime", price: "≥ 2000 ETB" }
        ],
        corporate: [
          { name: "Regular Corporate", price: "5,000 ETB" },
          { name: "High Corporate", price: "25,000 ETB" },
          { name: "Special Corporate", price: "≥ 50,000 ETB" }
        ]
      }
    },
    news: {
      badge: "News & Media",
      title: "Latest From The Field",
      viewAll: "View All News",
      readStory: "Read Story"
    },
    donation: {
      badge: "Immediate Action",
      title: "Your Gift Saves Lives.",
      customCta: "Custom Donation",
      customTitle: "Want to give a custom amount?",
      customDesc: "Every contribution, no matter the size, makes a difference.",
      selectGift: "Select Gift",
      tiers: [
        { amount: "100", label: "Medical Supplies", desc: "Provides essential first-aid kits for emergency responders." },
        { amount: "500", label: "Clean Water", desc: "Supports community WASH projects in drought-affected areas." },
        { amount: "2000", label: "Blood Drive", desc: "Funds regional blood center operations for one day." }
      ]
    },
    ctaBanner: {
      title: "Together We Can Make Humanity Stronger.",
      volunteer: "Volunteer Today",
      membership: "Join Membership",
      supporter: "Lifetime Supporter"
    },
    footer: {
      desc: "Alleviating human suffering and protecting life, health and dignity through our dedicated network across the nation since 1935.",
      mission: "Our Mission",
      involved: "Get Involved",
      location: "Headquarters Location",
      rights: "Alleviating Human Suffering Since 1935."
    },
    programsSection: {
      title: "Membership and Donation Payments",
      content: "Membership and donation provide a valuable opportunity to strengthen and build upon the local support for our organization and its causes. By introducing structured membership tiers, we can better segment our donors, enabling more targeted engagement and more efficient relationship management. These programs also equip us with effective tools to encourage advocacy, empowering supporters to actively promote our mission and campaigns. Furthermore, a well-designed membership system helps generate a more predictable and sustainable revenue stream, ensuring continuity in delivering our services and achieving our organizational goals.\n\nERCS has designed this powerful system which enables us to generate income so as to execute and facilitate these underlying mandates. Below are the only two sources of our financial income:",
      sources: ["Annual Membership Payment", "Money Donations"],
      membershipTitle: "Membership Payment",
      membershipContent: "ERCS membership allows you to make online annual membership due payments digitally and instantly instead of collecting them in person or in cash. One of the most important components of this ERCS annual membership payment is to make payment simple, affordable, and easy to reach, and avoid the old and past difficult task requiring envelopes, letters, tear-off receipts, stamps, which took too much time, people and energy.\n\nThis ERCS system simplifies the process of collecting annual membership dues by enabling online registration at the same time as collecting annual membership payments.",
      donationTitle: "Donation Payment",
      donationContent: "We live in a world, where millions of people have their lives destroyed by internal conflicts and natural disasters. Amid the chaos and despair of these causes, Ethiopia Red Cross Society is a unique sign of hope to those whose lives have been shattered by any of these mentioned causes. Our neutrality gives our staff access to conflict zones where they can save lives and help rebuild them.\n\nERCS relief and rehabilitation efforts mostly depend on the collaboration of its volunteers, members, donors, the business community, and private as well as public institutions. This is the time for all of us to come together, mobilize resources and comfort victims.\n\nBut as the pressure on our resources continues to grow, ERCS need more funds to help the increasing number of men, women and children around the country who find themselves caught in the crossfire of conflict and natural disaster. ERCS instant donations for either regular or for admin configured donation causes is possible using this powerful system.",
      donationFooter: "YOUR DONATION GOES WHERE IT IS NEEDED MOST"
    },
    volunteerSection: {
      title: "Voluntary Services",
      content: "Volunteering is at the heart of the Ethiopian Red Cross Society movement. It is central to all activities of the national society. Currently, tens of thousands of volunteers are registered throughout the country, involved in various humanitarian activities. Our humanitarian and development activities, food security and disaster preparedness/response, health and health related initiatives, HIV/AIDS prevention and control, and the promotion of humanitarian values.\n\nWorking together, our volunteers and staff members save lives and help thousands of people in need every year, and raise funds necessary to pay for our services. We bring about change not only by sending aid, but also by working through volunteers and partners to empower communities in Ethiopia, as it is one of poorest countries in the world.",
      cta: "CREATE LASTING CHANGE THROUGH VOLUNTEERING"
    },
    contactSection: {
      title: "Contact Us",
      address: "Stadium Addis Ababa, ETHIOPIA",
      email: "geremew.ashenafi@redcrosseth.org or kassahun.alemu@redcrosseth.org",
      tel: "+251-115-18-01-80, +251-115-18-01-82",
      mobile: "+251-911-90-79-78, +251-913-79-88-80",
      fax: "+251-115-15-00-99"
    }
  },
  am: {
    nav: {
      about: "ስለ እኛ",
      services: "አገልግሎቶች",
      impact: "ተጽዕኖ",
      news: "ዜናዎች",
      organizations: "የበጎ ፈቃድ ጥያቄ",
      portal: "የፖርታል መግቢያ",
      join: "አባል ይሁኑ"
    },
    hero: {
      tagline: "የ75 ዓመት አገልግሎት",
      title1: "ሕይወትን ማዳን",
      title2: "አመለካከትን",
      title3: "መለወጥ፡፡",
      subtitle: "በማህበረሰቡ ውስጥ ለውጥ ለማምጣት የኢትዮጵያ ቀይ መስቀል ማህበርን ይቀላቀሉ። ማንኛውንም ፈተና ለማሸነፍ በሰው ልጅ ኃይል እናምናለን።",
      ctaPrimary: "ይጀምሩ",
      ctaSecondary: "አሁን ይለግሱ",
      ctaVolunteer: "አባል ይሁኑ",
      ctaMembership: "አባልነት",
      ctaDonate: "ልገሳ",
      pathwaysLabel: "ለመርዳት መንገድዎን ይምረጡ፡",
      volunteers: "በጎ ፈቃደኞች",
      anniversary: "የ90 ዓመታት የሰብአዊ አገልግሎት ልቀት በዓል",
      imageUrl: "https://redcrosseth.org/wp-content/uploads/2025/06/90-AMET-COVER-for-website-1200-by-700.png"
    },
    stats: {
      volunteers: "በጎ ፈቃደኞች",
      branches: "የክልል ቅርንጫፎች",
      impact: "ሰብአዊ ተጽዕኖ",
      founded: "የተመሰረተበት",
      impactValue: "ከፍተኛ"
    },
    whoWeAre: {
      badge: "እኛ ማን ነን",
      title: "በኢትዮጵያ ቀዳሚው ሰብአዊ ድርጅት",
      storyTitle: "የእኛ ታሪክ",
      storyText1: "የኢትዮጵያ ቀይ መስቀል ማህበር ለበርካታ አስርት ዓመታት በኢትዮጵያ የሰብአዊ እርምጃ ግንባር ቀደም ሆኖ ቆይቷል. የዓለም አቀፉ ቀይ መስቀል እና ቀይ ጨረቃ ንቅናቄ አካል በመሆን የሰውን ልጅ ስቃይ ለመከላከል እና ለማቃለል ቆርጠን ተነስተናል.",
      storyText2: "ሕይወትንና ጤናን ለመጠበቅ፣ ለሰው ልጆች መከባበርን ለማረጋገጥ እና የሰውን ልጅ ስቃይ ለመከላከልና ለማቃለል ደከመኝ ሰለቸኝ ሳይሉ እንሰራለን። በሰባቱ የቀይ መስቀል ንቅናቄ መርሆዎች የሚመራ።",
      missionTitle: "የእኛ ተልዕኮ",
      missionText: "የሰውን ልጅ ስቃይ መከላከልና ማቃለል፣ ሕይወትንና ጤናን መጠበቅ፣ ያለ ምንም አድልዎ ሰብአዊነትን ማክበር",
      visionTitle: "የእኛ ራዕይ",
      visionText: "ለተጎዱ ወገኖች ውጤታማ ድጋፍ የሚሰጥ ጠንካራ እና ራሱን የቻለ ድርጅት መሆን",
      valuesTitle: "እሴቶቻችን",
      valuesText: "በ7ቱ መርሆች የሚመራ፡ ሰብአዊነት፣ አድልዎ አለማድረግ፣ ገለልተኝነት፣ ነጻነት፣ የበጎ ፈቃድ አገልግሎት፣ አንድነት እና አለምአቀፋዊነት።",
      imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200",
      historyLink: "https://www.redcrosseth.org/who-we-are/background-and-history",
      historyLinkLabel: "ሙሉ ታሪኩን ያንብቡ"
    },
    services: {
      badge: "የምንሰራቸው ስራዎች",
      title: "ዋና ዋና የአገልግሎት ዘርፎቻችን።",
      items: [
        {
          id: "drm",
          title: "የአደጋ ስጋት ስራ አመራር (DRM)",
          desc: "የአደጋ ዝግጁነት እና ምላሽ፣ የአደጋ ስጋት ቅነሳ (DRR)፣ የቀድሞ ማስጠንቀቂያ ስርዓቶች እና የማህበረሰብ ፅናት ግንባታ፣ የእርዳታ ስርጭት (ምግብ፣ መጠለያ፣ ምግብ ነክ ያልሆኑ ቁሳቁሶች)",
          icon: "ShieldCheck",
          color: "text-ercs-red",
          bg: "bg-red-50"
        },
        {
          id: "health",
          title: "የጤና እና ክብካቤ አገልግሎቶች",
          desc: "የመጀመሪያ እርዳታ ስልጠና እና ድንገተኛ የህክምና አገልግሎቶች፣ በማህበረሰብ ላይ የተመሰረቱ የጤና እና የተመጣጠነ ምግብ ፕሮግራሞች፣ ወረርሽኝ መከላከል እና ምላሽ፣ የእናቶች እና ህጻናት ጤና ድጋፍ",
          icon: "Activity",
          color: "text-ercs-red",
          bg: "bg-red-50"
        },
        {
          id: "wash",
          title: "ውሃ፣ ሳኒቴሽን እና ንጽህና (WASH)",
          desc: "ንጹህ የመጠጥ ውሃ አቅርቦት፣ የሳኒቴሽን ተቋማት ግንባታ እና ማስተዋወቅ፣ የንጽህና ግንባታ ዘመቻዎች፣ የአደጋ ጊዜ የWASH ጣልቃ ገብነቶች",
          icon: "Droplets",
          color: "text-blue-500",
          bg: "bg-blue-50"
        },
        {
          id: "volunteer",
          title: "የበጎ ፈቃደኞች እና የወጣቶች ተሳትፎ",
          desc: "የበጎ ፈቃደኞች ምልመላ፣ ስልጠና እና ስምሪት፣ የወጣቶች ፕሮግራሞች እና የማህበረሰብ አገልግሎት ተነሳሽነቶች፣ የአቅም ግንባታ እና የማቆያ ስልቶች",
          icon: "Users",
          color: "text-ercs-red",
          bg: "bg-red-50"
        },
        {
          id: "rfl",
          title: "ለተለያዩ ቤተሰቦች ግንኙነት መመለስ (RFL)",
          desc: "የተለያዩ የቤተሰብ አባላትን መፈለግ እና ማገናኘት፣ ለስደተኞች፣ ለተፈናቃዮች እና ለሚሰደዱ ሰዎች ድጋፍ፣ በቤተሰቦች መካከል የግንኙነት አገልግሎቶች",
          icon: "Heart",
          color: "text-ercs-red",
          bg: "bg-red-50"
        },
        {
          id: "food",
          title: "የምግብ ዋስትና እና ኑሮ ማሻሻል",
          desc: "ለተጋላጭ ቤተሰቦች ድጋፍ፣ የኑሮ አማራጭ ማሻሻያ ፕሮግራሞች፣ የገንዘብ እና የቫውቸር እርዳታ፣ የአየር ንብረት ለውጥ መቋቋሚያ ተነሳሽነቶች",
          icon: "Plus",
          color: "text-ercs-red",
          bg: "bg-red-50"
        },
        {
          id: "blood",
          title: "የደም አገልግሎት",
          desc: "የደም ልገሳ ዘመቻዎች፣ የደም ባንክ ድጋፍ እና አስተዳደር፣ በፈቃደኝነት ላይ የተመሰረተ የደም ልገሳ ማስተዋወቅ",
          icon: "Activity",
          color: "text-ercs-red",
          bg: "bg-red-50"
        },
        {
          id: "values",
          title: "የሰብአዊነት እሴቶች እና መርሆዎች",
          desc: "የቀይ መስቀል መርሆዎችን (ሰብአዊነት፣ አድልዎ የለሽነት፣ ገለልተኝነት፣ ነፃነት፣ በጎ ፈቃደኝነት፣ አንድነት፣ ሁለንተናዊነት) ማስተዋወቅ፣ የማህበረሰብ ግንባታ እና ቅስቀሳ",
          icon: "Globe",
          color: "text-ercs-red",
          bg: "bg-red-50"
        }
      ],
      learnMore: "ተጨማሪ ያንብቡ"
    },
    membership: {
      badge: "አንድ ላይ ስንሆን እንበረታለን",
      title: "የዕድሜ ልክ አባል ይሁኑ።",
      desc: "የእኛን ሰብአዊ ተልዕኮ በቋሚነት የሚደግፉ በሚሊዮን የሚቆጠሩ ኢትዮጵያውያንን ይቀላቀሉ። እንደ አባል የመምረጥ መብት ያገኛሉ እና የማህበራችንን አቅጣጫ ለመወሰን ይረዳሉ።",
      features: [
        "በጠቅላላ ጉባኤዎች ላይ መሳተፍ",
        "ዘላቂ የርዳታ ስራዎችን መደገፍ",
        "ኦፊሴላዊ የአባልነት መታወቂያ ማግኘት",
        "በሀገራዊ ሰብአዊ ውሳኔዎች ላይ ድምጽ ማግኘት"
      ],
      cta: "አባልነትን ይቀላቀሉ",
      activeMembers: "ንቁ አባላት",
      tiersLabel: "የአባልነት ደረጃዎች",
      tiers: {
        individual: [
          { name: "መደበኛ አባል", price: "50-999 ETB" },
          { name: "የግል የህይወት ዘመን", price: "1000-1999 ETB" },
          { name: "የቤተሰብ የህይወት ዘመን", price: "≥ 2000 ETB" }
        ],
        corporate: [
          { name: "መደበኛ ድርጅታዊ", price: "5,000 ETB" },
          { name: "ከፍተኛ ድርጅታዊ", price: "25,000 ETB" },
          { name: "ልዩ ድርጅታዊ", price: "≥ 50,000 ETB" }
        ]
      }
    },
    news: {
      badge: "ዜና እና ሚዲያ",
      title: "የቅርብ ጊዜ ክስተቶች",
      viewAll: "ሁሉንም ዜናዎች ይመልከቱ",
      readStory: "ታሪኩን ያንብቡ"
    },
    donation: {
      badge: "አፋጣኝ እርምጃ",
      title: "የእርስዎ ስጦታ ሕይወትን ያድናል!",
      customCta: "የራስዎን ይለግሱ",
      customTitle: "የተወሰነ መጠን መለገስ ይፈልጋሉ?",
      customDesc: "እያንዳንዱ መዋጮ መጠኑ ምንም ይሁን ምን ለውጥ ያመጣል።",
      selectGift: "ስጦታውን ይምረጡ",
      tiers: [
        { amount: "100", label: "የህክምና አቅርቦቶች", desc: "ለድንገተኛ ጊዜ ሰራተኞች የመጀመሪያ እርዳታ መስጫ ቁሳቁሶችን ያቀርባል." },
        { amount: "500", label: "ንጹህ ውሃ", desc: "በድርቅ ለተጎዱ አካባቢዎች የማህበረሰብ የንጹህ ውሃ ፕሮጀክቶችን ይደግፋል." },
        { amount: "2000", label: "የደም ልገሳ", desc: "ለአንድ ቀን የክልል የደም ማእከል ስራዎችን በገንዘብ ይደግፋል." }
      ]
    },
    ctaBanner: {
      title: "አንድ ላይ በመሆን የሰው ልጅን እናጠናክራለን።",
      volunteer: "ዛሬ በጎ ፈቃደኛ ይሁኑ",
      membership: "አባልነትን ይቀላቀሉ",
      supporter: "የህይወት ዘመን ደጋፊ"
    },
    programsSection: {
      title: "የአባልነት እና የልገሳ ክፍያዎች",
      content: "የአባልነት እና ልገሳ ለድርጅታችን እና ለዓላማዎቹ ያለውን አካባቢያዊ ድጋፍ ለማጠናከር እና ለመገንባት ጠቃሚ ዕድል ይሰጣል።",
      sources: ["ዓመታዊ የአባልነት ክፍያ", "የገንዘብ ልገሳዎች"],
      membershipTitle: "የአባልነት ክፍያ",
      membershipContent: "የኢ.ቀ.መ.ማ አባልነት ዓመታዊ የአባልነት ክፍያዎችን በአካል ወይም በጥሬ ገንዘብ ከመሰብሰብ ይልቅ በዲጂታል መንገድ በቅጽበት እንዲከፍሉ ያስችልዎታል።",
      donationTitle: "የልገሳ ክፍያ",
      donationContent: "ሚሊዮን ሰዎች በውስጥ ግጭቶች እና በተፈጥሮ አደጋዎች ሕይወታቸው በሚጠፋበት ዓለም ውስጥ እንኖራለን።",
      donationFooter: "የእርስዎ ልገሳ በጣም በሚያስፈልግበት ቦታ ይውላል"
    },
    volunteerSection: {
      title: "የበጎ ፈቃድ አገልግሎቶች",
      content: "በጎ ፈቃደኝነት የኢትዮጵያ ቀይ መስቀል ማህበር ንቅናቄ እምብርት ነው።",
      cta: "በበጎ ፈቃደኝነት ዘላቂ ለውጥ ይፍጠሩ"
    },
    contactSection: {
      title: "ያግኙን",
      address: "ስታዲየም አዲስ አበባ ፣ ኢትዮጵያ",
      email: "geremew.ashenafi@redcrosseth.org ወይም kassahun.alemu@redcrosseth.org",
      tel: "+251-115-18-01-80, +251-115-18-01-82",
      mobile: "+251-911-90-79-78, +251-913-79-88-80",
      fax: "+251-115-15-00-99"
    },
    footer: {
      desc: "ከ1935 ጀምሮ በአገር አቀፍ ደረጃ ባለን የቁርጠኝነት መረብ አማካኝነት የሰውን ልጅ ስቃይ ማቃለል እና ሕይወትን፣ ጤናን እና ክብርን መጠበቅ።",
      mission: "ተልዕኳችን",
      involved: "ይሳተፉ",
      location: "የዋናው መሥሪያ ቤት ቦታ",
      rights: "ከ1935 ጀምሮ የሰውን ልጅ ስቃይ ማቃለል።"
    }
  },
  om: {
    nav: {
      about: "Waa'ee Keenya",
      services: "Tajaajila",
      impact: "Dhiibbaa",
      news: "Oduu",
      organizations: "Gaaffii Tajaajilaa",
      portal: "Galfata Poortaalii",
      join: "Miseensa Ta'aa"
    },
    hero: {
      tagline: "Waggaa 75 Tajaajilaa",
      title1: "Lubbuu Baraaruu",
      title2: "Ilaalcha",
      title3: "Jijjiiruu.",
      subtitle: "Hawaasa keessatti jijjiirama fiduuf Waldaa Fannoo Diimaa Itiyoophiyaa (ERCS) tti makamaa. Nuti humna namoomaa kanaan qormaata kamiyyuu mo'achuu ni dandeenya jennee amanna.",
      ctaPrimary: "Eegali",
      ctaSecondary: "Amma Arjoomi",
      ctaVolunteer: "Miseensa Ta'aa",
      ctaMembership: "Miseensummaa",
      ctaDonate: "Arjooma",
      pathwaysLabel: "Gargaaruuf karaa keessan filadhaa:",
      volunteers: "Tajaajiltoota",
      anniversary: "Baga Waggaa 90ffaa Milkaa'ina Namoomaa Geessan",
      imageUrl: "https://redcrosseth.org/wp-content/uploads/2025/06/90-AMET-COVER-for-website-1200-by-700.png"
    },
    stats: {
      volunteers: "Tajaajiltoota",
      branches: "Dameewwan Naannoo",
      impact: "Dhiibbaa Namoomaa",
      founded: "Kan Hundeeffame",
      impactValue: "Olaana"
    },
    whoWeAre: {
      badge: "Eenyu Nu'i",
      title: "Dhaabbata namoomaa jalqabaa Itiyoophiyaa",
      storyTitle: "Seenaa Keenya",
      storyText1: "Waldaan Fannoo Diimaa Itiyoophiyaa waggoota kurnan hedduuf Itiyoophiyaa keessatti tarkaanfii namoomaa irratti shoora guddaa taphachaa jira.",
      storyText2: "Lubbuu fi fayyaa eeguuf, namoota kabajuu mirkaneessuuf, akkasumas dhiphuu namoomaa ittisuu fi hir'isuuf jabaannee hojjenna. Qajeeltoo 7n Fannoo Diimaatiin geggeeffama.",
      missionTitle: "Ergama Keenya",
      missionText: "Dhiphuu namoomaa ittisuu fi hir'isuu, lubbuu fi fayyaa eeguu, akkasumas korniyaa fi loogii malee nama kabajuu.",
      visionTitle: "Mul'ata Keenya",
      visionText: "Dhaabbata namoomaa cimaa fi of danda'e ta'anii tajaajila bu'a qabeessa kennuu",
      valuesTitle: "Gatataa Keenya",
      valuesText: "Qajeelfama torban kanaan qajeelfama: Namummaa, Wal-caalmaa dhabuu, Giddu-galeessummaa, Bilisummaa, Tajaajila Fedhii, Tokkummaa fi Addunyaa hundaa.",
      imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200",
      historyLink: "https://www.redcrosseth.org/who-we-are/background-and-history",
      historyLinkLabel: "Seenaa Guutuu Dubbisi"
    },
    services: {
      badge: "Maal Hojjenna",
      title: "Bakka Tajaajila Keenya Ijoo.",
      items: [
        {
          id: "drm",
          title: "Bulchiinsa Sodaa Balaa (DRM)",
          desc: "Qophaa''ummaa fi deebii ariifachiisaa balaa, hir''isuu sodaa balaa (DRR), sirna akeekkachiisa duraa fi ijaarsa danda''amummaa hawaasaa, raabsawwan gargaarsaa",
          icon: "ShieldCheck",
          color: "text-ercs-red",
          bg: "bg-red-50"
        },
        {
          id: "health",
          title: "Tajaajila Fayyaa fi Kunuunsaa",
          desc: "Leenjii gargaarsa jalqabaa fi tajaajila wal''aansa ariifachiisaa, sagantaalee fayyaa fi soorataa hawaasa irratti hundaa''an, ittisa fi deebii dhibee daddarbaa",
          icon: "Activity",
          color: "text-ercs-red",
          bg: "bg-red-50"
        },
        {
          id: "wash",
          title: "Bishaan, Saaniteeshinii fi Qulqullina (WASH)",
          desc: "Dhiyeessii bishaan dhugaatii qulqulluu, ijaarsa fi beeksisa tajaajila saaniteeshinii, duula hubannoo qulqullinaa, gidduu-seensa WASH ariifachiisaa",
          icon: "Droplets",
          color: "text-blue-500",
          bg: "bg-blue-50"
        },
        {
          id: "volunteer",
          title: "Fedhaan-laattotaa fi Hirmaanna Dargaggootaa",
          desc: "Miseensomsuu, leenjisuu fi bobbaasuu fedhaan-laattotaa, sagantaalee dargaggootaa fi tabaqaalee tajaajila hawaasaa, ijaarsa dandeettii",
          icon: "Users",
          color: "text-ercs-red",
          bg: "bg-red-50"
        },
        {
          id: "rfl",
          title: "Wal-qunnamsiisuu Miseensota Maatii (RFL)",
          desc: "Barbaaduu fi wal-qunnamsiisuu miseensota maatii addaan galanii, deeggarsa godaantotaa, baqattootaa fi namoota biyya keessatti buqa''aniif",
          icon: "Heart",
          color: "text-ercs-red",
          bg: "bg-red-50"
        },
        {
          id: "food",
          title: "Wabii Nyaataa fi Jireenyaa",
          desc: "Deeggarsa maatiiwwan miidhamoo ta''aniif, sagantaalee bal''ina jireenyaa, gargaarsa maallaqaa fi voocherii, tabaqaalee danda''amummaa qilleensaa",
          icon: "Plus",
          color: "text-ercs-red",
          bg: "bg-red-50"
        },
        {
          id: "blood",
          title: "Tajaajila Dhiigaa",
          desc: "Duulota dhiiga arjoomuu, deeggarsa fi bulchiinsa baankii dhiigaa, beeksisa fedhaan dhiiga arjoomuu",
          icon: "Activity",
          color: "text-ercs-red",
          bg: "bg-red-50"
        },
        {
          id: "values",
          title: "Gatattowwan fi Qajeeltoowwan Namoomaa",
          desc: "Beeksisa qajeeltoowwan Fannoo Diimaa (namooma, wal-qixxummaa, giddu-galeessummaa, of-danda''uu, fedhaan tajaajiluu, tokkummaa)",
          icon: "Globe",
          color: "text-ercs-red",
          bg: "bg-red-50"
        }
      ],
      learnMore: "Bal'inaan Dubbisi"
    },
    membership: {
      badge: "Tokkummaan Ni Jabaanna",
      title: "Miseensa Dhaabbataa Ta'aa.",
      desc: "Miliyoonaan lakkaa'aman lammiilee Itiyoophiyaa ergama namoomaa keenya dhaabbataan deeggaran tti makamaa. Akka miseensaatti mirga sagalee kennuu ni qabaattu.",
      features: [
        "Yaa'ii Walii Galaa irratti hirmaachuu",
        "Hojii gargaarsaa ittifufiinsa qabu deeggaruun",
        "Waraqaa eenyummaa miseensummaa fudhachuun",
        "Murteewwan namoomaa biyyaalessaa irratti sagalee qabaachuu"
      ],
      cta: "Miseensummaan Makami",
      activeMembers: "Miseensota Sosocho'an",
      tiersLabel: "Sadarkaa Miseensummaa",
      tiers: {
        individual: [
          { name: "Miriitii Idilee", price: "50-999 ETB" },
          { name: "Umrii Guutuu Dhuunfaa", price: "1000-1999 ETB" },
          { name: "Umrii Guutuu Maatii", price: "≥ 2,000 ETB" }
        ],
        corporate: [
          { name: "Dhaabbata Idilee", price: "5,000 ETB" },
          { name: "Dhaabbata Olaanaa", price: "25,000 ETB" },
          { name: "Dhaabbata Addaa", price: "≥ 50,000 ETB" }
        ]
      }
    },
    news: {
      badge: "Oduu & Miidiyaa",
      title: "Wanta Haaraa",
      viewAll: "Oduu Hunda Ilaali",
      readStory: "Sheekkoo Dubbisi"
    },
    donation: {
      badge: "Tarkaanfii Ariifachiisaa",
      title: "Kennaan Keessan Lubbuu Baraara.",
      customCta: "Arjooma Addaa",
      customTitle: "Hamma addaa arjoomuu barbaadduu?",
      customDesc: "Gargaarsi kamiyyuu, hamma isaa irratti hundaa'uun jijjiirama ni fida.",
      selectGift: "Kennaa Filadhu",
      tiers: [
        { amount: "100", label: "Wantoota Fayyaa", desc: "Namoota deebii ariifachiisaa kennaniif meeshaalee jalqabaa kenna." },
        { amount: "500", label: "Bishaan Qulqulluu", desc: "Naannolee hongeen miidhamaniif pirojeektii bishaan hawaasaa deeggara." },
        { amount: "2000", label: "Dhiiga Arjoomuu", desc: "Guyyaa tokkoof socho''ii gidduu gala dhiigaa naannoo deeggara." }
      ]
    },
    ctaBanner: {
      title: "Waliin Ta'uun Namooma Ni Jabeessina.",
      volunteer: "Har'a Fedheen Hojjedhu",
      membership: "Itooma itti makami",
      supporter: "Deggartuu Umrii Guutuu"
    },
    programsSection: {
      title: "Kaffaltii Miseensummaafi Kennataa",
      content: "Miseensummaafi kennatni deeggarsa naannoo dhaabbata keenyaafi dhimmoota isaatiif qabu cimsuufi irratti ijaaruuf carraaqqii guddaa dha.",
      sources: ["Kaffaltii Miseensummaa Waggaa", "Kennata Maallaqaa"],
      membershipTitle: "Kaffaltii Miseensummaa",
      membershipContent: "Miseensummaan ERCS kaffaltii miseensummaa waggaa karaa dijitaalaa kaffaluuf isin dandeessisa.",
      donationTitle: "Kaffaltii Kennataa",
      donationContent: "Addunyaa namoonni miiliyoonaan lakkaa'aman sababa walitti bu'iinsa keessootiifi balaa uumamaatiin jireenyi isaanii badu keessa jiraanna.",
      donationFooter: "KENNATNI KEESSAN IDDOO HUNDA CAALAA BARBAACHISUTTI OOLA"
    },
    volunteerSection: {
      title: "Tajaajila Fedhii",
      content: "Fedhiin tajaajiluu wiirtuu sochii Sosayeti Qaxxaamura Diimaa Itoophiyaati.",
      cta: "TAJAAJILA FEDHIITIIN JIJJIIRAMA HIN BADNE FIKKERSAA"
    },
    contactSection: {
      title: "Nu Quunnamaa",
      address: "Istadiyeemii Finfinnee, ITOOPHIYAA",
      email: "geremew.ashenafi@redcrosseth.org yookiin kassahun.alemu@redcrosseth.org",
      tel: "+251-115-18-01-80, +251-115-18-01-82",
      mobile: "+251-911-90-79-78, +251-913-79-88-80",
      fax: "+251-115-15-00-99"
    },
    footer: {
      desc: "Waggaa 1935 jalqabee guutuu biyyattiitti networkii keenya kanaan dhiphuu namoomaa hir'isuu fi lubbuu, fayyaa fi ulfina namaa eeguu.",
      mission: "Ergama Keenya",
      involved: "Hirmaadhaa",
      location: "Bakka Waajjira Ol-aanaa",
      rights: "Waggaa 1935 jalqabee dhiphuu namoomaa hir'isuu."
    }
  }
};
