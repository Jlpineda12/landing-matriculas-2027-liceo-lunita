/**
 * Datos de la landing de Matrículas 2027. Copiados del sitio institucional (src/data/site.ts);
 * si cambian allá, actualícelos aquí. No publique cifras, testimonios ni datos que el colegio no haya confirmado.
 */
export const SITE = {
  name: 'Liceo Lunita de Chía',
  url: 'https://liceolunita.edu.co',
  slogan: 'El Arte, la Educación y la Cultura son el Reflejo de un Pueblo',
  foundingYears: 25,
  phone: '+573134320295',
  phoneDisplay: '313 432 0295',
  landline: '+576018849592',
  landlineDisplay: '(601) 884 9592',
  whatsapp: '573134320295',
  email: 'liceoinfantillunita@hotmail.com',
  city: 'Chía, Cundinamarca',
  social: {
    facebook: 'https://www.facebook.com/Liceo-Lunita-de-Ch%C3%ADa-1760547990660817/',
    instagram: 'https://www.instagram.com/liceo_lunita_de_chia/',
  },
  siga: 'https://siga.liceolunita.edu.co/inicio/matricula/',
} as const;

export const ENROLLMENT = {
  dates: '1 al 17 de diciembre de 2026',
  hours: 'Jornada continua de 8:00 a. m. a 3:00 p. m.',
  classes: '6:45 a. m. a 3:00 p. m.',
  /** Apertura y cierre (hora de Colombia, UTC-5) para la cuenta regresiva. */
  opens: '2026-12-01T08:00:00-05:00',
  closes: '2026-12-17T15:00:00-05:00',
};

/** Prensa (titulares reales enlazados desde el sitio institucional). */
export const PRESS = [
  { outlet: 'Semana', title: 'La mujer que llevó a sus estudiantes de Chía a la NASA', url: 'https://www.semana.com/mejor-colombia/articulo/la-mujer-que-llevo-a-sus-estudiantes-de-chia-a-la-nasa/202505/' },
  { outlet: 'Cambio', title: '“Captura la imaginación de los jóvenes”: Michio Kaku elogió al Liceo Lunita de Chía', url: 'https://cambiocolombia.com/pais/captura-la-imaginacion-de-lo-jovenes-michio-kaku-elogio-al-liceo-lunita-de-chia' },
];

/** Mensaje prellenado de WhatsApp. */
export const waLink = (text = 'Hola, quiero información sobre las Matrículas 2027 en el Liceo Lunita de Chía.') =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

/** Costos publicados por el colegio para 2026 (referencia: los de 2027 se confirman en la matrícula). */
export const COSTS = {
  year: 2026,
  form: 110000,
  enrollment: [
    { level: 'Preescolar', value: 674000 },
    { level: 'Primaria', value: 714000 },
    { level: 'Bachillerato', value: 756000 },
  ],
  tuition: [
    { level: 'Preescolar', grades: 'Jardín y Transición', value: 400000 },
    { level: 'Primaria', grades: '1.°, 2.°, 3.° y 4.°', value: 430000 },
    { level: 'Grados 5.° a 9.°', grades: '5.°, 6.°, 7.°, 8.° y 9.°', value: 460000 },
    { level: 'Grados 10.° y 11.°', grades: 'Décimo y undécimo', value: 500000 },
  ],
  other: 1760000,
  pending: 'grados, pruebas ICFES y PREICFES',
};
export const cop = (n: number) => `$${n.toLocaleString('es-CO')}`;

export const STATS = [
  { value: 180, suffix: '+', label: 'Bachilleres graduados' },
  { value: 12, suffix: '', label: 'Promociones' },
  { value: 4, suffix: '.°', label: 'Puesto municipal' },
  { value: 13, suffix: '.°', label: 'Puesto departamental' },
  { value: 120, suffix: '.°', label: 'Puesto nacional' },
];

export const STHEAMI = [
  { k: 'S', name: 'Ciencia', color: '#1cb0f6', text: 'Preguntar, observar y experimentar: del laboratorio al NASA Space Apps Challenge.' },
  { k: 'T', name: 'Tecnología', color: '#ce82ff', text: 'Robótica, programación y digitalización para crear, no solo consumir.' },
  { k: 'H', name: 'Humanidades', color: '#ff9600', text: 'Lectura, palabra e identidad muisca para pensar críticamente el territorio.' },
  { k: 'E', name: 'Ingeniería', color: '#58cc02', text: 'Proyectos que resuelven problemas reales con diseño y prototipos.' },
  { k: 'A', name: 'Artes', color: '#ff86d0', text: 'Banda marcial, música y expresión: el arte como reflejo de un pueblo.' },
  { k: 'M', name: 'Matemáticas', color: '#ffc800', text: 'Pensamiento lógico con resultados destacados en pruebas nacionales.' },
  { k: 'I', name: 'Inclusión', color: '#ff4b4b', text: 'Una escuela para todos, con enfoque humano, cultural e inclusivo.' },
];

export const LEVELS = [
  { id: 'preescolar', theme: 'orange', name: 'Preescolar', grades: 'Jardín y Transición', text: 'Aprender jugando: exploración, lenguaje, arte y movimiento en un ambiente lúdico y seguro.', photo: 'preescolar' },
  { id: 'primaria', theme: 'green', name: 'Primaria', grades: 'Primero a Quinto', text: 'Proyectos STHEAMI, lectura, ciencia y música que despiertan la curiosidad y la autonomía.', photo: 'primaria' },
  { id: 'bachillerato', theme: 'sky', name: 'Bachillerato', grades: 'Sexto a Once', text: 'Rigor académico, PREICFES, tecnología e intercambios internacionales, con convenio de bachillerato internacional.', photo: 'bachillerato' },
] as const;

/** Grados para el formulario. */
export const GRADES = ['Jardín', 'Transición', 'Primero', 'Segundo', 'Tercero', 'Cuarto', 'Quinto', 'Sexto', 'Séptimo', 'Octavo', 'Noveno', 'Décimo', 'Undécimo'];

/** Destinos de los viajes de promoción (confirmados por el colegio). */
export const TRIPS = [
  { name: 'Canadá', color: 'red' },
  { name: 'Europa', color: 'blue' },
  { name: 'Londres', color: 'purple' },
  { name: 'China', color: 'orange' },
  { name: 'Cuba', color: 'green' },
] as const;

export const ADMISSION_STEPS = [
  { title: 'Conócenos', text: 'Escríbenos por WhatsApp o llámanos y agenda una visita a la sede.' },
  { title: 'Inscríbete en línea', text: 'Diligencia el formulario de matrícula en la plataforma SIGA con los datos del estudiante y del acudiente.' },
  { title: 'Entrega documentos', text: 'Reúne los requisitos de la lista. Puedes marcarlos aquí mismo mientras los preparas.' },
  { title: '¡Bienvenido a Lunita!', text: 'Formaliza la matrícula y recibe la información de inicio de clases, uniformes y plataformas.' },
];

export const ADMISSION_DOCS = [
  'Registro civil y/o tarjeta de identidad del estudiante',
  'Cédulas de los padres o acudiente',
  'Hoja de vida de los padres (sencilla)',
  'Certificado laboral de los padres',
  'Último boletín y paz y salvo del colegio anterior',
  'Retiro del SIMAT',
  'Copia del observador del estudiante',
  '2 fotos tamaño documento',
  'Certificado médico',
  'Fotocopia del carné de la EPS',
  'Fotocopia del carné de vacunas',
];

export const FAQ = [
  { q: '¿Qué niveles ofrece el Liceo Lunita de Chía?', a: 'De Jardín a Bachillerato: Preescolar (Jardín y Transición), Primaria (primero a quinto) y Bachillerato (sexto a once), con el modelo pedagógico STHEAMI.' },
  { q: '¿Cuándo son las matrículas 2027?', a: 'Del 1 al 17 de diciembre de 2026. El proceso se realiza en línea en la plataforma SIGA y atendemos en jornada continua de 8:00 a. m. a 3:00 p. m.' },
  { q: '¿Cuánto cuestan la matrícula y la pensión?', a: 'En 2026 la matrícula fue de $674.000 en preescolar, $714.000 en primaria y $756.000 en bachillerato; la pensión mensual, de $400.000 a $500.000 según el grado, y el formulario, de $110.000. Los valores de 2027 se confirman al momento de la matrícula.' },
  { q: '¿Cuál es el horario de clases?', a: 'La jornada de clases es de 6:45 a. m. a 3:00 p. m.' },
  { q: '¿Qué es el modelo STHEAMI?', a: 'Es nuestro modelo pedagógico propio: integra Ciencia, Tecnología, Humanidades, Ingeniería, Artes, Matemáticas e Inclusión en proyectos interdisciplinarios, junto con la heutagogía, en la que el estudiante gestiona su propio aprendizaje.' },
  { q: '¿El colegio tiene convenios internacionales?', a: 'Sí. Tenemos convenio de bachillerato internacional con Florida Global University, además de intercambios culturales y viajes pedagógicos. Cada promoción vive su propio viaje de promoción, a destinos como Canadá, Europa, Londres, China y Cuba.' },
  { q: '¿El colegio tiene banda marcial?', a: 'Sí. La Banda Marcial del Liceo Lunita de Chía participa en festivales nacionales e internacionales, y desde 2023 el colegio organiza el Festival Internacional de Bandas Marciales "Ciudad de la Luna".' },
  { q: '¿Cómo apoyan el bienestar de los estudiantes?', a: 'Con un equipo interdisciplinar de psicología, fonoaudiología, terapias de lenguaje, terapias físicas y acompañamiento a procesos de inclusión, además de rutas de atención para la convivencia escolar.' },
  { q: '¿El colegio tiene piscina?', a: 'Sí. Contamos con piscina e instructores para que los niños aprendan a nadar con seguridad y confianza.' },
  { q: '¿Cómo preparan a los estudiantes para el ICFES?', a: 'Somos un colegio de alta intensidad académica y nuestros estudiantes reciben entrenamiento PREICFES con Instruimos, junto con la Universidad Nacional.' },
  { q: '¿Qué hacen en tecnología?', a: 'Desarrollamos proyectos de realidad virtual y tecnologías emergentes, robótica y programación, y hemos participado en el NASA Space Apps Challenge (Chía 2024 y Neiva 2025).' },
  { q: '¿Dónde queda el colegio?', a: 'Estamos en Chía, Cundinamarca. Escríbenos por WhatsApp y te enviamos la ubicación para que agendes tu visita.' },
];
