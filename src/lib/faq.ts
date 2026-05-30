import type { Locale } from '@/i18n/types';

export interface FaqItem {
  q: string;
  a: string;
}

/**
 * Localized FAQ. Italian is the canonical version used for the FAQPage
 * structured data (the site prerenders Italian for SEO).
 */
export const FAQ: Record<Locale, FaqItem[]> = {
  it: [
    {
      q: 'Quanto costa il transfer da e per l’aeroporto di Malpensa?',
      a: 'Il transfer Milano–Malpensa ha una tariffa fissa a partire da 150€ per la berlina, concordata prima della partenza: nessun tassametro e nessun sovrapprezzo in caso di traffico.',
    },
    {
      q: 'In quali zone operate?',
      a: 'Milano e provincia, la Brianza, Como e il Lago di Como (Bellagio, Tremezzo, Varenna), gli aeroporti di Malpensa, Linate e Orio al Serio, oltre a tratte internazionali come St. Moritz e Lugano.',
    },
    {
      q: 'Quali veicoli sono disponibili?',
      a: 'Mercedes Classe E, Classe S e Classe V, Range Rover e, su richiesta, un bus da 18 posti per gruppi ed eventi.',
    },
    {
      q: 'Cosa succede se il mio volo è in ritardo?',
      a: 'Monitoriamo il volo in tempo reale e adeguiamo l’orario di ritiro. Un margine di attesa è sempre incluso, senza costi extra per i ritardi.',
    },
    {
      q: 'Avete seggiolini per bambini?',
      a: 'Sì. Seggiolini e rialzi sono disponibili su richiesta: basta segnalarlo al momento della prenotazione.',
    },
    {
      q: 'Le tariffe sono a tratta o a ore?',
      a: 'Entrambe. Puoi scegliere una tratta a prezzo fisso (ad esempio Malpensa) oppure il servizio a ore con autista a disposizione, a partire da 70€/h per la Classe E.',
    },
  ],
  en: [
    {
      q: 'How much does a transfer to and from Malpensa airport cost?',
      a: 'The Milan–Malpensa transfer has a fixed fare starting from €150 for the sedan, agreed before departure: no meter and no surcharge if we hit traffic.',
    },
    {
      q: 'Which areas do you cover?',
      a: 'Milan and its province, the Brianza, Como and Lake Como (Bellagio, Tremezzo, Varenna), the airports of Malpensa, Linate and Bergamo Orio al Serio, plus international routes such as St. Moritz and Lugano.',
    },
    {
      q: 'Which vehicles are available?',
      a: 'Mercedes E-Class, S-Class and V-Class, Range Rover and, on request, an 18-seat bus for groups and events.',
    },
    {
      q: 'What happens if my flight is delayed?',
      a: 'We track the flight in real time and adjust the pickup time. A waiting margin is always included, with no extra charge for delays.',
    },
    {
      q: 'Do you have child seats?',
      a: 'Yes. Child seats and boosters are available on request, just mention it when booking.',
    },
    {
      q: 'Are fares per route or per hour?',
      a: 'Both. You can choose a fixed-price route (for example Malpensa) or hourly service with the driver on call, starting from €70/h for the E-Class.',
    },
  ],
  es: [
    {
      q: '¿Cuánto cuesta el traslado desde y hacia el aeropuerto de Malpensa?',
      a: 'El traslado Milán–Malpensa tiene una tarifa fija desde 150€ para la berlina, acordada antes de la salida: sin taxímetro y sin recargo en caso de tráfico.',
    },
    {
      q: '¿En qué zonas operáis?',
      a: 'Milán y su provincia, la Brianza, Como y el Lago de Como (Bellagio, Tremezzo, Varenna), los aeropuertos de Malpensa, Linate y Bérgamo Orio al Serio, además de rutas internacionales como St. Moritz y Lugano.',
    },
    {
      q: '¿Qué vehículos están disponibles?',
      a: 'Mercedes Clase E, Clase S y Clase V, Range Rover y, bajo petición, un autobús de 18 plazas para grupos y eventos.',
    },
    {
      q: '¿Qué pasa si mi vuelo se retrasa?',
      a: 'Seguimos el vuelo en tiempo real y ajustamos la hora de recogida. Siempre se incluye un margen de espera, sin coste adicional por los retrasos.',
    },
    {
      q: '¿Tenéis sillitas para niños?',
      a: 'Sí. Las sillitas y los alzadores están disponibles bajo petición, basta con indicarlo al reservar.',
    },
    {
      q: '¿Las tarifas son por trayecto o por horas?',
      a: 'Ambas. Puedes elegir un trayecto a precio fijo (por ejemplo Malpensa) o el servicio por horas con conductor a disposición, desde 70€/h para la Clase E.',
    },
  ],
  de: [
    {
      q: 'Was kostet der Transfer von und zum Flughafen Malpensa?',
      a: 'Der Transfer Mailand–Malpensa hat einen Festpreis ab 150€ für die Limousine, vor der Abfahrt vereinbart: kein Taxameter und kein Aufschlag bei Verkehr.',
    },
    {
      q: 'In welchen Gebieten sind Sie tätig?',
      a: 'Mailand und Provinz, die Brianza, Como und der Comer See (Bellagio, Tremezzo, Varenna), die Flughäfen Malpensa, Linate und Bergamo Orio al Serio sowie internationale Strecken wie St. Moritz und Lugano.',
    },
    {
      q: 'Welche Fahrzeuge sind verfügbar?',
      a: 'Mercedes E-Klasse, S-Klasse und V-Klasse, Range Rover und auf Anfrage ein 18-Sitzer-Bus für Gruppen und Events.',
    },
    {
      q: 'Was passiert, wenn mein Flug Verspätung hat?',
      a: 'Wir verfolgen den Flug in Echtzeit und passen die Abholzeit an. Eine Wartezeit ist immer inbegriffen, ohne Aufpreis für Verspätungen.',
    },
    {
      q: 'Haben Sie Kindersitze?',
      a: 'Ja. Kindersitze und Sitzerhöhungen sind auf Anfrage verfügbar, geben Sie es einfach bei der Buchung an.',
    },
    {
      q: 'Sind die Preise pro Strecke oder pro Stunde?',
      a: 'Beides. Sie können eine Strecke zum Festpreis wählen (zum Beispiel Malpensa) oder den Stundenservice mit Fahrer auf Abruf, ab 70€/Std für die E-Klasse.',
    },
  ],
  fr: [
    {
      q: 'Combien coûte le transfert depuis et vers l’aéroport de Malpensa ?',
      a: 'Le transfert Milan–Malpensa a un tarif fixe à partir de 150€ pour la berline, convenu avant le départ : pas de compteur ni de supplément en cas de trafic.',
    },
    {
      q: 'Dans quelles zones intervenez-vous ?',
      a: 'Milan et sa province, la Brianza, Côme et le lac de Côme (Bellagio, Tremezzo, Varenna), les aéroports de Malpensa, Linate et Bergame Orio al Serio, ainsi que des trajets internationaux comme St-Moritz et Lugano.',
    },
    {
      q: 'Quels véhicules sont disponibles ?',
      a: 'Mercedes Classe E, Classe S et Classe V, Range Rover et, sur demande, un bus de 18 places pour groupes et événements.',
    },
    {
      q: 'Que se passe-t-il si mon vol est en retard ?',
      a: 'Nous suivons le vol en temps réel et ajustons l’heure de prise en charge. Une marge d’attente est toujours incluse, sans frais supplémentaires pour les retards.',
    },
    {
      q: 'Avez-vous des sièges enfant ?',
      a: 'Oui. Sièges et rehausseurs sont disponibles sur demande, il suffit de le signaler à la réservation.',
    },
    {
      q: 'Les tarifs sont-ils au trajet ou à l’heure ?',
      a: 'Les deux. Vous pouvez choisir un trajet à prix fixe (par exemple Malpensa) ou le service à l’heure avec chauffeur à disposition, à partir de 70€/h pour la Classe E.',
    },
  ],
  sq: [
    {
      q: 'Sa kushton transferta nga dhe për aeroportin e Malpensës?',
      a: 'Transferta Milano–Malpensa ka një tarifë fikse duke nisur nga 150€ për berlinën, e rënë dakord para nisjes: pa taksimetër dhe pa shtesë në rast trafiku.',
    },
    {
      q: 'Në cilat zona operoni?',
      a: 'Milano dhe provinca, Brianza, Como dhe Liqeni i Komos (Bellagio, Tremezzo, Varenna), aeroportet e Malpensës, Linates dhe Bergamo Orio al Serio, si dhe rrugë ndërkombëtare si St. Moritz dhe Lugano.',
    },
    {
      q: 'Cilat automjete janë të disponueshme?',
      a: 'Mercedes Klasa E, Klasa S dhe Klasa V, Range Rover dhe, sipas kërkesës, një autobus me 18 vende për grupe dhe evente.',
    },
    {
      q: 'Çfarë ndodh nëse fluturimi im ka vonesë?',
      a: 'Ndjekim fluturimin në kohë reale dhe përshtatim orarin e marrjes. Një marzh pritjeje është gjithmonë i përfshirë, pa kosto shtesë për vonesat.',
    },
    {
      q: 'Keni karrige për fëmijë?',
      a: 'Po. Karriget dhe ngritëset janë të disponueshme sipas kërkesës, mjafton ta thoni në momentin e rezervimit.',
    },
    {
      q: 'Tarifat janë sipas rrugës apo me orë?',
      a: 'Të dyja. Mund të zgjidhni një rrugë me çmim fiks (për shembull Malpensa) ose shërbimin me orë me shofer në dispozicion, duke nisur nga 70€/orë për Klasën E.',
    },
  ],
  ru: [
    {
      q: 'Сколько стоит трансфер в аэропорт Мальпенса и обратно?',
      a: 'Трансфер Милан–Мальпенса имеет фиксированный тариф от 150€ за седан, согласованный до выезда: без счётчика и без надбавок при пробках.',
    },
    {
      q: 'В каких районах вы работаете?',
      a: 'Милан и провинция, Брианца, Комо и озеро Комо (Белладжо, Тремеццо, Варенна), аэропорты Мальпенса, Линате и Бергамо Орио-аль-Серио, а также международные маршруты, такие как Санкт-Мориц и Лугано.',
    },
    {
      q: 'Какие автомобили доступны?',
      a: 'Mercedes E-класса, S-класса и V-класса, Range Rover и по запросу автобус на 18 мест для групп и мероприятий.',
    },
    {
      q: 'Что будет, если мой рейс задержат?',
      a: 'Мы отслеживаем рейс в реальном времени и подстраиваем время подачи. Запас на ожидание всегда включён, без доплат за задержки.',
    },
    {
      q: 'Есть ли детские кресла?',
      a: 'Да. Детские кресла и бустеры доступны по запросу, достаточно указать это при бронировании.',
    },
    {
      q: 'Тарифы за маршрут или почасовые?',
      a: 'И то, и другое. Можно выбрать маршрут по фиксированной цене (например, Мальпенса) или почасовой сервис с водителем в распоряжении, от 70€/ч за E-класс.',
    },
  ],
};
