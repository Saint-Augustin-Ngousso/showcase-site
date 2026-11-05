export const parish = {
  name: 'Paroisse Saint Augustin',
  fullName: 'Paroisse Saint Augustin de Ngousso',
  place: 'Ngousso, Yaoundé',
  diocese: 'Archidiocèse de Yaoundé',
  zone: 'Zone pastorale de l’Omnisport',
  landmark: 'Ngousso, Yaoundé — localisation précise à confirmer',
  phone: '',
  email: '',
  address: 'Ngousso, Yaoundé, Cameroun',
  mapsQuery: 'Ngousso Yaoundé Cameroun',
  transport: 'Taxi ou moto-taxi vers Ngousso. Le repère d’accès exact sera publié avec l’adresse officielle.',
  officeHours: '',
  churchOpen: '',
  mobileMoney: '',
  orangeMoney: '',
  rib: '',
  facebook: '',
  youtube: '',
  instagram: '',
  tiktok: '',
  whatsappNumber: '',
  worshipPlaces: ['La chapelle', 'La petite église'],
  themeDiocesan: 'Le Rosaire et le développement intégral',
  themeParish: 'Une paroisse qui prie et travaille',
  slogan: 'Chrétien ! Je prie et je travaille.',
  yearLabel: 'Année pastorale 2026-2027',
  launchDate: '2026-11-08',
  get whatsapp() {
    if (!this.whatsappNumber) return null
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent('Bonjour, je vous écris depuis le site de la paroisse Saint Augustin de Ngousso.')}`
  },
}

export const nav = [
  { to: '/paroisse', label: 'La paroisse' },
  { to: '/pretres', label: 'Nos prêtres' },
  { to: '/messes', label: 'Messes' },
  { to: '/secteurs', label: 'Secteurs' },
  { to: '/mouvements', label: 'Mouvements' },
  { to: '/agenda', label: 'Agenda' },
  { to: '/contact', label: 'Contact' },
]

export const quickActions = [
  { to: '/messes', label: 'Messes' },
  { to: '/agenda', label: 'Agenda' },
  { href: 'whatsapp', label: 'WhatsApp' },
  { to: '/contact', label: 'Contact' },
]

export const pastoralProgram = {
  objective:
    'Nourrir l’engagement pastoral, social et économique des fidèles par la prière.',
  munera: [
    {
      id: 'enseigner',
      title: 'Enseigner',
      items: [
        'Enseignement du mercredi (heure et lieu à préciser)',
        'Catéchisme, Compendium et Coutumier',
        'Enseignements dans les CEV',
        'Formation des responsables',
      ],
    },
    {
      id: 'sanctifier',
      title: 'Sanctifier',
      items: [
        'Communion en état de grâce',
        'Confessions le vendredi de 7h à 8h',
        'Catéchèse des sacrements',
        'Animation liturgique',
        'Récollections par métier',
      ],
    },
    {
      id: 'gouverner',
      title: 'Gouverner',
      items: [
        'Renouvellement des bureaux',
        'Budget annuel',
        'Travaux du presbytère',
        'Lien avec l’Économat diocésain',
        'Recensement des nécessiteux',
      ],
    },
  ],
}

export const priests = [
  {
    id: 'cure',
    title: 'Mgr',
    name: 'Engelbert René Fouda Owona',
    role: 'Curé',
    sector: 'Saint Luc',
    chaplaincy:
      'Coordination générale, conseils et commissions ; 10 associations.',
    writeTo: true,
    bio: 'Présentation à paraître.',
  },
  {
    id: 'malik',
    title: 'Abbé',
    name: 'Fernand Malik Djouli Adzi',
    role: 'Vicaire paroissial',
    sector: 'Saint Marc',
    chaplaincy: 'Groupes de jeunes ; 11 associations.',
    bio: 'Présentation à paraître.',
  },
  {
    id: 'landry',
    title: 'Abbé',
    name: 'Landry Tsigo',
    role: 'Vicaire paroissial',
    sector: 'Saint Jean',
    chaplaincy: 'Chorales ; 8 associations.',
    bio: 'Présentation à paraître.',
  },
  {
    id: 'weekend',
    title: 'Abbé',
    name: 'Nom à préciser',
    role: 'Vicaire de week-end',
    sector: '',
    chaplaincy: 'Messes et confessions du week-end (charge à préciser).',
    pending: true,
    bio: 'Le nom et la charge précise du vicaire de week-end seront publiés après confirmation.',
  },
]

export const schedules = {
  sunday: [
    { time: '06h15', chapelle: true, petiteEglise: true },
    { time: '08h15', chapelle: true, petiteEglise: true },
    { time: '09h45', chapelle: true, petiteEglise: true },
    { time: '11h00', chapelle: true, petiteEglise: false },
    { time: '18h00', chapelle: true, petiteEglise: false },
  ],
  weekday: [],
  feasts: [
    { day: 'Solennités et fêtes', time: 'Selon les annonces de la semaine', note: 'Les horaires particuliers sont lus à la messe et publiés à l’agenda.' },
  ],
  confessions: {
    days: 'Vendredi',
    hours: '7h — 8h',
    place: 'Église',
    extra: 'Le vicaire de week-end vient en appui selon le planning fixé par le curé.',
  },
  adoration: {
    days: '',
    hours: '',
    place: '',
  },
  teaching: {
    days: 'Mercredi',
    hours: '',
    place: '',
    extra: 'Enseignement paroissial chaque mercredi. Heure et lieu à préciser.',
  },
  priestHours: {
    days: '',
    hours: '',
    extra: 'Permanence du secrétariat et du prêtre : horaires à préciser.',
  },
  other: [
    { title: 'Baptêmes', detail: 'Démarches et calendrier auprès du secrétariat.' },
    { title: 'Mariages', detail: 'Dossier et préparation auprès du secrétariat.' },
    { title: 'Funérailles', detail: 'Contacter le secrétariat dès l’annonce du décès.' },
  ],
}

function placesLabel(item) {
  if (item.chapelle && item.petiteEglise) return 'Chapelle et petite église'
  if (item.chapelle) return 'Chapelle'
  if (item.petiteEglise) return 'Petite église'
  return ''
}

export const sacraments = [
  {
    id: 'bapteme',
    title: 'Baptême',
    action: 'Demander un baptême',
    conditions: 'À préciser auprès du secrétariat.',
    documents: 'Liste des pièces à fournir : à publier.',
    preparation: 'Catéchèse des sacrements, selon le programme pastoral.',
    calendar: 'Calendrier auprès du secrétariat.',
    contact: 'Secrétariat paroissial',
  },
  {
    id: 'communion',
    title: 'Première communion',
    action: 'Inscrire à la catéchèse',
    conditions: 'À préciser auprès de l’équipe de catéchèse.',
    documents: 'Liste des pièces à fournir : à publier.',
    preparation: 'Catéchisme, Compendium et Coutumier.',
    calendar: 'Inscriptions selon le calendrier de la catéchèse.',
    contact: 'Catéchistes',
  },
  {
    id: 'confirmation',
    title: 'Confirmation',
    action: 'Demander la confirmation',
    conditions: 'À préciser auprès de l’équipe de catéchèse.',
    documents: 'Liste des pièces à fournir : à publier.',
    preparation: 'Parcours de préparation paroissial.',
    calendar: 'Dates communiquées chaque année.',
    contact: 'Catéchistes',
  },
  {
    id: 'mariage',
    title: 'Mariage',
    action: 'Préparer un mariage',
    conditions: 'À préciser auprès du secrétariat.',
    documents: 'Liste des pièces à fournir : à publier.',
    preparation: 'Sessions de préparation selon le calendrier paroissial.',
    calendar: 'Selon disponibilités des lieux de culte.',
    contact: 'Secrétariat et prêtre accompagnateur',
  },
  {
    id: 'confession',
    title: 'Confession',
    action: 'Venir se confesser',
    conditions: 'Tout baptisé qui souhaite se réconcilier.',
    documents: 'Aucun document.',
    preparation: 'Examen de conscience.',
    calendar: 'Chaque vendredi de 7h à 8h, à l’église.',
    contact: 'Un prêtre de la paroisse',
  },
  {
    id: 'funerailles',
    title: 'Funérailles',
    action: 'Préparer des funérailles',
    conditions: 'Dès l’annonce du décès, contactez le secrétariat.',
    documents: 'À préciser auprès du secrétariat.',
    preparation: 'Entretien pour la liturgie et l’accompagnement.',
    calendar: 'Selon le rite et les disponibilités.',
    contact: 'Secrétariat paroissial',
  },
]

export const cevSectors = [
  {
    id: 'st-luc',
    saint: 'Saint Luc',
    chaplain: 'Mgr Engelbert René Fouda Owona',
    layLeaders: '',
    blurb: 'Secteur confié au curé. La liste des CEV, les responsables laïcs et le programme des descentes seront publiés ici.',
    cevs: [],
    descents: [],
  },
  {
    id: 'st-marc',
    saint: 'Saint Marc',
    chaplain: 'Abbé Fernand Malik Djouli Adzi',
    layLeaders: 'Maman Eboutou Véronique et M. Roger Meyong',
    blurb: 'Secteur confié à l’abbé Fernand Malik. Douze CEV, avec un programme de descentes déjà arrêté.',
    cevs: [
      { name: 'Saint Jean-Paul II', lead: 'Maman Bikie' },
      { name: 'Saint Laurent et Sainte Monique', lead: 'Yvonne Ntsama, Maman Yossa Charline Wandji, Justine Pom' },
      { name: 'Saint Paul', lead: 'Élise Ahanda, Angèle Ekoumou' },
      { name: 'Saint Augustin et Saint David', lead: 'Cécile Elongou, Octavie Mendo' },
      { name: 'Saint Uriel', lead: 'Valentine Guiegou, Papa Tagno' },
      { name: 'Saint Ignace de Loyola', lead: 'Chantal Essomba' },
      { name: 'Saint Pierre', lead: 'Charles Kono' },
      { name: 'Saint Lazare', lead: 'Paulette Balla, Maman Bé' },
      { name: 'Saint Joseph', lead: 'Maman Christine' },
      { name: 'Sacré-Cœur', lead: 'Maman Sabine Messina' },
      { name: 'Sainte Marthe Robin', lead: 'Maman Hélène' },
      { name: 'Sainte Famille et Saint Jacques', lead: 'M. Etama, Maman Ndo Marguerite' },
    ],
    descents: [
      { period: 'Octobre', activity: 'Prière du Rosaire' },
      { period: 'Lundi 9 novembre 2026', activity: 'Messe à la grotte' },
      {
        period: '11 au 26 novembre 2026',
        activity: 'Prière pour les défunts avec les familles, bénédiction des tombes et Eucharistie, une CEV par jour du lundi au vendredi',
      },
      { period: 'Toute l’année', activity: 'Enseignements dans les CEV' },
    ],
  },
  {
    id: 'st-jean',
    saint: 'Saint Jean',
    chaplain: 'Abbé Landry Tsigo',
    layLeaders: '',
    blurb: 'Secteur confié à l’abbé Landry Tsigo. La liste des CEV, les responsables laïcs et le programme des descentes seront publiés ici.',
    cevs: [],
    descents: [],
  },
]

export const associationPlatforms = [
  {
    id: 'mariale',
    name: 'Plateforme mariale',
    items: [
      'Amis de Notre-Dame de la Miséricorde',
      'Couronne de Roses',
      'EKOAN Maria',
      'Rosaire Vivant de Sainte Philomène',
      'Legion of Mary',
      'Ephata de l’Immaculée Conception',
      'Cadets of Mary',
    ],
  },
  {
    id: 'priere',
    name: 'Plateforme christocentrique et de prière',
    items: [
      'Amis du Très Saint Sacrement',
      'Sacré-Cœur de Jésus',
      'Jésus Ressuscité',
      'Miséricorde Divine',
      'Divine Mercy',
      'Précieux Sang',
      'Parole de Dieu',
      'Colonne de Feu',
      'Charismatic Group',
    ],
  },
  {
    id: 'joseph',
    name: 'Plateforme Saint Joseph',
    subtitle: 'Familles et états de vie',
    items: [
      'Saint Joseph',
      'Catholic Men Association',
      'Catholic Women Association',
      'ACF',
      'Sainte Monique',
      'Sainte Pulchérie',
      'Sainte Famille',
    ],
  },
  {
    id: 'action',
    name: 'Plateforme action et service',
    items: [
      'Caritas',
      'Catéchistes',
      'Dames Apostoliques',
      'Groupe des lecteurs',
      'Servants de messe',
      'Cop Monde',
    ],
  },
]

export const youthGroups = {
  chaplain: 'Abbé Fernand Malik Djouli Adzi',
  items: [
    'Groupe des lecteurs',
    'Servants de messe',
    'Cadets of Mary',
    'Cop Monde',
    'Sainte Famille',
    'Précieux Sang',
  ],
}

export const choirs = {
  chaplain: 'Abbé Landry Tsigo',
  items: [],
  note: 'Toutes les chorales sont suivies par l’abbé Landry Tsigo. La liste nominative et les messes d’animation seront publiées ici.',
}

export const councils = [
  {
    name: 'Conseil pastoral paroissial',
    role: 'Aide le curé à promouvoir et coordonner l’activité pastorale (can. 536).',
  },
  {
    name: 'Conseil pour les affaires économiques',
    role: 'Aide le curé dans l’administration des biens de la paroisse (can. 537).',
  },
  {
    name: 'Conseil des jeunes',
    role: 'Coordonne les groupes de jeunes et porte leur voix.',
  },
]

export const commissions = [
  'Liturgique',
  'Associations',
  'Restauration',
  'Évangélisation',
  'Suivi des travaux',
  'Catéchèse',
]

export const proposedCommissions = [
  {
    name: 'Communication',
    note: 'Proposée au curé. Elle serait naturellement chargée du site.',
  },
  {
    name: 'Développement intégral',
    note: 'Proposée au curé, en lien avec le thème diocésain.',
  },
]

export const gallery = [
  {
    src: '/photos/jeunes-vue-yaounde.jpg',
    alt: 'Jeunes en cercle, main dans la main, face à Yaoundé',
    caption: 'Rassemblement des jeunes, vue sur Yaoundé',
    category: 'Jeunes',
  },
  {
    src: '/photos/jeunes-tournoi.jpg',
    alt: 'Groupe de jeunes sur un terrain, autour d’un trophée',
    caption: 'Journée sportive des jeunes',
    category: 'Jeunes',
  },
  {
    src: '/photos/jeunes-coeur.jpg',
    alt: 'Mains des jeunes formant un cœur sous le ciel',
    caption: 'Les jeunes de Saint Augustin',
    category: 'Jeunes',
  },
  {
    src: '/photos/enfants-cercle-colline.jpg',
    alt: 'Enfants et jeunes en cercle sur une colline',
    caption: 'Sortie des enfants — cercle de fraternité',
    category: 'Enfants',
  },
  {
    src: '/photos/enfants-sortie-colline.jpg',
    alt: 'Groupe d’enfants et d’accompagnateurs sur la colline',
    caption: 'Sortie des enfants',
    category: 'Enfants',
  },
  {
    src: '/photos/enfants-visite-crtv.jpg',
    alt: 'Enfants de la paroisse en visite à CRTV',
    caption: 'Visite des enfants à CRTV',
    category: 'Enfants',
  },
]

export const heroPhoto = gallery[0]

export const news = [
  {
    slug: 'lancement-annee-pastorale',
    date: '2026-11-08',
    category: 'Paroisse',
    title: 'Lancement de l’année pastorale 2026-2027',
    image: '/photos/jeunes-vue-yaounde.jpg',
    text: 'Toute la paroisse est convoquée pour ouvrir l’année sous le thème « Une paroisse qui prie et travaille », dans le sillage diocésain du Rosaire et du développement intégral.',
  },
  {
    slug: 'messe-grotte-saint-marc',
    date: '2026-11-09',
    category: 'Saint Marc',
    title: 'Messe à la grotte — secteur Saint Marc',
    image: '',
    text: 'Lundi 9 novembre, messe à la grotte pour les CEV du secteur Saint Marc.',
  },
  {
    slug: 'priere-defunts-saint-marc',
    date: '2026-11-11',
    category: 'Saint Marc',
    title: 'Prière pour les défunts dans les CEV',
    image: '',
    text: 'Du 11 au 26 novembre, prière pour les défunts avec les familles, bénédiction des tombes et Eucharistie, une CEV par jour du lundi au vendredi dans le secteur Saint Marc.',
  },
  {
    slug: 'journee-amitie-jeunes',
    date: '2026-11-28',
    category: 'Jeunes',
    title: 'Journée d’amitié des jeunes « S’amuser avec le Christ »',
    image: '/photos/jeunes-tournoi.jpg',
    text: 'Samedi 28 novembre au complexe Mundi. Les groupes de jeunes de la paroisse sont invités.',
  },
]

export const events = [
  { date: '2026-11-08', title: 'Lancement de l’année pastorale 2026-2027', time: '', place: 'Paroisse', audience: 'Toute la paroisse' },
  { date: '2026-11-09', title: 'Messe à la grotte — secteur Saint Marc', time: '', place: 'Grotte', audience: 'Secteur Saint Marc' },
  { date: '2026-11-11', dateEnd: '2026-11-26', title: 'Prière pour les défunts et bénédiction des tombes', time: '', place: 'CEV du secteur Saint Marc', audience: 'Familles du secteur' },
  { date: '2026-11-28', title: 'Journée d’amitié des jeunes « S’amuser avec le Christ »', time: '', place: 'Complexe Mundi', audience: 'Groupes de jeunes' },
  { date: '2026-12-05', title: 'Récollection : fonction publique et administration', time: '', place: 'À préciser', audience: 'Fonctionnaires' },
  { date: '2026-12-12', title: 'Récollection : enseignants et personnel de l’éducation', time: '', place: 'À préciser', audience: 'Enseignants' },
  { date: '2027-01-09', title: 'Récollection : commerçants et bayam-sellam', time: '', place: 'À préciser', audience: 'Commerçants' },
  { date: '2027-01-23', title: 'Récollection : forces de défense et de sécurité', time: '', place: 'À préciser', audience: 'Forces de l’ordre' },
  { date: '2027-02-06', title: 'Récollection : personnel de santé', time: '', place: 'À préciser', audience: 'Soignants' },
  { date: '2027-02-20', title: 'Récollection : transporteurs', time: '', place: 'À préciser', audience: 'Taxis, moto-taxis' },
  { date: '2027-03-06', title: 'Récollection : couture, coiffure, esthétique, ménagères', time: '', place: 'À préciser', audience: 'Femmes' },
  { date: '2027-03-20', title: 'Récollection : justice et droit', time: '', place: 'À préciser', audience: 'Juristes' },
  { date: '2027-04-10', title: 'Récollection : banques, assurances, microfinance', time: '', place: 'À préciser', audience: 'Agents financiers' },
  { date: '2027-04-24', title: 'Récollection : agriculteurs et vendeurs de vivres', time: '', place: 'À préciser', audience: 'Agriculteurs' },
  { date: '2027-05-01', title: 'Récollection : ouvriers, gardiens, employés de maison', time: '', place: 'À préciser', audience: 'Travailleurs' },
  { date: '2027-05-22', title: 'Récollection : restauration et hôtellerie', time: '', place: 'À préciser', audience: 'Restaurateurs' },
  { date: '2027-06-05', title: 'Récollection : bâtiment et artisans', time: '', place: 'À préciser', audience: 'Artisans' },
  { date: '2027-06-19', title: 'Récollection : médias, communication, numérique', time: '', place: 'À préciser', audience: 'Communicants' },
  { date: '2027-07-03', title: 'Récollection : entrepreneurs et employeurs', time: '', place: 'À préciser', audience: 'Chefs d’entreprise' },
  { date: '2027-07-17', title: 'Récollection : étudiants et chercheurs d’emploi', time: '', place: 'À préciser', audience: 'Jeunes adultes' },
  { date: '2027-08-07', title: 'Récollection : artistes, musiciens, sportifs', time: '', place: 'À préciser', audience: 'Artistes' },
  { date: '2027-08-14', title: 'Récollection : retraités et personnes âgées', time: '', place: 'À préciser', audience: 'Aînés' },
]

export const homilies = [
  {
    id: 'homelie-1',
    priest: 'Mgr le curé',
    date: '',
    title: 'Homélies et enseignements du mercredi',
    excerpt: 'Cette rubrique ouvrira en phase 2.',
    text: 'Les homélies et l’enseignement du mercredi seront publiés ici, après relecture du prêtre concerné.',
    audio: null,
  },
]

export const faithQuestions = [
  { q: 'Qui est Jésus ?', a: 'Jésus est le Fils de Dieu, vrai Dieu et vrai homme. Il est mort et ressuscité pour nous réconcilier avec le Père.' },
  { q: 'Qu’est-ce que l’Église ?', a: 'L’Église est le peuple rassemblé par le Christ : une famille où l’on prie, on se convertit et on sert.' },
  { q: 'Pourquoi les catholiques prient-ils Marie ?', a: 'Marie n’est pas adorée. On lui demande d’intercéder. Elle conduit toujours vers son Fils. Le thème diocésain 2026-2027 invite à prier le Rosaire.' },
  { q: 'Qu’est-ce qu’un sacrement ?', a: 'Un sacrement est un geste visible du Christ qui donne une grâce invisible : baptême, eucharistie, confirmation, réconciliation, mariage, ordre, onction des malades.' },
  { q: 'Pourquoi se confesser ?', a: 'Parce que le pardon a un visage. À Saint Augustin de Ngousso, les confessions ont lieu chaque vendredi de 7h à 8h, à l’église.' },
  { q: 'Pourquoi aller à la messe ?', a: 'La messe est le cœur de la semaine : on écoute la Parole, on rend grâce, on reçoit le Christ. La paroisse célèbre à la chapelle et à la petite église.' },
]

export const prayers = [
  { title: 'Prière du matin', body: 'Seigneur, je te remets cette journée. Que tes paroles guident mes pas à Ngousso, au travail, à l’école et dans ma famille. Amen.' },
  { title: 'Prière du soir', body: 'Père, je te rends grâce pour ce jour. Pardonne ce qui a manqué. Garde ceux que j’aime et donne-moi le repos. Amen.' },
  { title: 'Prière à Saint Augustin', body: 'Saint Augustin, toi qui as cherché le Seigneur d’un cœur inquiet jusqu’à trouver en Lui le repos, prie pour la paroisse de Ngousso. Amen.' },
  { title: 'Je vous salue Marie', body: 'Je vous salue Marie, pleine de grâce, le Seigneur est avec vous. Vous êtes bénie entre toutes les femmes, et Jésus, le fruit de vos entrailles, est béni. Sainte Marie, Mère de Dieu, priez pour nous pauvres pécheurs, maintenant et à l’heure de notre mort. Amen.' },
]

export const testimonials = []

export const downloads = [
  { title: 'Annonces de la semaine', type: 'À paraître' },
]

export const projects = [
  {
    title: 'Travaux du presbytère',
    progress: 0,
    text: 'Projet inscrit au programme pastoral 2026-2027. Modalités de soutien à préciser.',
  },
]

export const searchIndex = [
  { q: ['messe', 'messes', 'dimanche', 'horaire', 'horaires', 'chapelle', 'église', 'eglise'], title: 'Horaires des messes', to: '/messes', text: 'Messes du dimanche à la chapelle et à la petite église, confessions le vendredi.' },
  { q: ['confession', 'confesser', 'réconciliation', 'reconciliation', 'vendredi'], title: 'Confessions', to: '/messes#confessions', text: 'Chaque vendredi de 7h à 8h, à l’église.' },
  { q: ['baptême', 'bapteme', 'baptiser'], title: 'Demander un baptême', to: '/messes#sacrements', text: 'Démarches auprès du secrétariat.' },
  { q: ['mariage', 'marier'], title: 'Préparer un mariage', to: '/messes#mariage', text: 'Dossier et préparation auprès du secrétariat.' },
  { q: ['prêtre', 'pretre', 'curé', 'cure', 'vicaire', 'abbé', 'abbe', 'mgr', 'fouda', 'malik', 'tsigo'], title: 'Nos prêtres', to: '/pretres', text: 'Le curé, les vicaires et le vicaire de week-end.' },
  { q: ['secteur', 'cev', 'saint marc', 'saint jean', 'saint luc', 'grotte'], title: 'Secteurs et CEV', to: '/secteurs', text: 'Trois secteurs, communautés ecclésiales vivantes et programme des descentes.' },
  { q: ['association', 'mouvement', 'chorale', 'jeune', 'jeunes', 'caritas', 'légion', 'legion', 'mariale'], title: 'Mouvements et services', to: '/mouvements', text: 'Vingt-neuf associations, chorales, groupes de jeunes, conseils et commissions.' },
  { q: ['prière', 'priere', 'intention', 'rosaire'], title: 'Demander une prière', to: '/priere', text: 'Confier une intention à l’équipe pastorale.' },
  { q: ['whatsapp', 'contact', 'téléphone', 'telephone', 'adresse', 'carte', 'trouver', 'ngousso'], title: 'Contact et soutien', to: '/contact', text: 'Adresse, plan, secrétariat, dons et quêtes.' },
  { q: ['don', 'donner', 'dîme', 'dime', 'soutenir', 'quête', 'quete', 'presbytère', 'presbytere'], title: 'Soutenir la paroisse', to: '/contact#soutien', text: 'Offrandes, dons et travaux du presbytère.' },
  { q: ['foi', 'jésus', 'jesus', 'église', 'eglise', 'catholique', 'enseignement', 'homélie', 'homelie'], title: 'Enseignements', to: '/foi', text: 'Foi catholique, enseignement du mercredi et homélies.' },
  { q: ['actualité', 'actualite', 'news', 'annonce', 'agenda', 'calendrier', 'récollection', 'recollection'], title: 'Agenda et actualités', to: '/agenda', text: 'Lancement de l’année, récollections par métier, activités des jeunes.' },
  { q: ['paroisse', 'histoire', 'programme', 'thème', 'theme', 'slogan'], title: 'La paroisse', to: '/paroisse', text: 'Identité, archidiocèse, zone pastorale et programme 2026-2027.' },
  { q: ['photo', 'photos', 'galerie', 'image', 'jeunes', 'enfants'], title: 'Galerie photos', to: '/mediatheque', text: 'Images des sorties, des jeunes et des enfants de la paroisse.' },
]

export function formatDate(iso) {
  if (!iso) return ''
  return new Date(`${iso}T12:00:00`).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatDateShort(iso) {
  if (!iso) return ''
  return new Date(`${iso}T12:00:00`).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function massPlaces(item) {
  return placesLabel(item)
}

export function nextSundayMass() {
  const now = new Date()
  const day = now.getDay()
  const daysUntilSunday = day === 0 ? 0 : 7 - day
  const target = new Date(now)
  target.setDate(now.getDate() + daysUntilSunday)
  const first = schedules.sunday[0]
  return {
    label: daysUntilSunday === 0 ? 'Aujourd’hui' : 'Prochain dimanche',
    time: first.time,
    note: massPlaces(first),
    date: target.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }),
  }
}

export function upcomingEvents(from = new Date()) {
  const iso = from.toISOString().slice(0, 10)
  return events
    .filter((item) => (item.dateEnd || item.date) >= iso)
    .sort((a, b) => a.date.localeCompare(b.date))
}

export function eventOnDay(iso) {
  return events.filter((item) => {
    if (item.dateEnd) return iso >= item.date && iso <= item.dateEnd
    return item.date === iso
  })
}
