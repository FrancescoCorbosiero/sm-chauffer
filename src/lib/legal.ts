import { SITE } from './site';

/**
 * Legal copy for the Privacy Policy, Cookie Policy and Terms pages.
 *
 * ⚠️  These are good-faith GDPR/Garante-aligned templates populated with the
 * real data-controller details. They are NOT a substitute for professional
 * legal advice — have a lawyer/DPO review before relying on them.
 *
 * Italian is the binding version; English is a courtesy translation. Other
 * locales fall back to Italian (see the LegalDoc component).
 */

export type LegalLang = 'it' | 'en';
export type LegalDocKey = 'privacy' | 'cookie' | 'terms';

export interface LegalSection {
  heading: string;
  body: string[];
  list?: string[];
}
export interface LegalDocument {
  title: string;
  updated: string;
  intro: string[];
  sections: LegalSection[];
}

const LAST_UPDATED = '2 giugno 2025';
const LAST_UPDATED_EN = '2 June 2025';

const controllerIt =
  `${SITE.legalName}, ${SITE.legalAddress.street}, ${SITE.legalAddress.postalCode} ` +
  `${SITE.legalAddress.locality} (${SITE.legalAddress.province}), Italia — ` +
  `P.IVA ${SITE.vatNumber}, C.F. ${SITE.taxCode}. Email: ${SITE.email}.`;

const controllerEn =
  `${SITE.legalName}, ${SITE.legalAddress.street}, ${SITE.legalAddress.postalCode} ` +
  `${SITE.legalAddress.locality} (${SITE.legalAddress.province}), Italy — ` +
  `VAT ${SITE.vatNumber}, Tax code ${SITE.taxCode}. Email: ${SITE.email}.`;

export const LEGAL: Record<LegalDocKey, Record<LegalLang, LegalDocument>> = {
  privacy: {
    it: {
      title: 'Privacy Policy',
      updated: LAST_UPDATED,
      intro: [
        `La presente informativa descrive il trattamento dei dati personali degli utenti che consultano ${SITE.url} o utilizzano i moduli di contatto/prenotazione, ai sensi del Regolamento (UE) 2016/679 (GDPR) e del D.lgs. 196/2003.`,
      ],
      sections: [
        {
          heading: 'Titolare del trattamento',
          body: [controllerIt],
        },
        {
          heading: 'Dati trattati',
          body: ['Trattiamo le seguenti categorie di dati:'],
          list: [
            'Dati di contatto e di prenotazione conferiti volontariamente tramite il modulo o WhatsApp: nome, email, telefono, dettagli del viaggio (tratta, data, ora, veicolo, note).',
            'Dati di navigazione e statistici: con il tuo consenso, dati raccolti da Google Analytics 4; statistiche aggregate e prive di cookie tramite Umami.',
            'Dati tecnici e di sicurezza: indirizzo IP e log del server, utilizzati per garantire la sicurezza del servizio e prevenire abusi/spam.',
          ],
        },
        {
          heading: 'Finalità e basi giuridiche',
          body: ['I dati sono trattati per le seguenti finalità:'],
          list: [
            'Rispondere alle richieste di preventivo/prenotazione ed erogare il servizio richiesto — base giuridica: esecuzione di misure precontrattuali e contrattuali (art. 6.1.b GDPR).',
            'Sicurezza del sito, prevenzione di spam e abusi — legittimo interesse (art. 6.1.f GDPR).',
            'Statistiche di analisi e marketing tramite cookie — consenso (art. 6.1.a GDPR), revocabile in qualsiasi momento.',
            'Adempimenti di legge (es. fiscali/contabili) — obbligo legale (art. 6.1.c GDPR).',
          ],
        },
        {
          heading: 'Destinatari e responsabili del trattamento',
          body: [
            'I dati possono essere trattati da fornitori che agiscono come responsabili del trattamento, tra cui: il provider di hosting (VPS), Amazon Web Services (Amazon SES) per l’invio delle email, Cloudflare (Turnstile) per la protezione antispam ove attiva, e Google (Google Analytics) previo consenso. Alcuni fornitori possono trattare i dati al di fuori dell’UE/SEE sulla base delle Clausole Contrattuali Standard della Commissione Europea.',
          ],
        },
        {
          heading: 'Conservazione',
          body: [
            'I dati delle richieste sono conservati per il tempo necessario a gestire la richiesta e ad adempiere agli obblighi di legge, dopodiché vengono cancellati o anonimizzati. I dati statistici sono conservati nei termini previsti dai rispettivi strumenti.',
          ],
        },
        {
          heading: 'Diritti dell’interessato',
          body: [
            'Puoi esercitare in qualsiasi momento i diritti previsti dagli artt. 15-22 GDPR (accesso, rettifica, cancellazione, limitazione, portabilità, opposizione) e revocare il consenso scrivendo a ' +
              SITE.email +
              '. Hai inoltre il diritto di proporre reclamo al Garante per la protezione dei dati personali (www.garanteprivacy.it).',
          ],
        },
      ],
    },
    en: {
      title: 'Privacy Policy',
      updated: LAST_UPDATED_EN,
      intro: [
        `This policy explains how personal data of users who visit ${SITE.url} or use the contact/booking forms is processed, under Regulation (EU) 2016/679 (GDPR).`,
      ],
      sections: [
        { heading: 'Data controller', body: [controllerEn] },
        {
          heading: 'Data we process',
          body: ['We process the following categories of data:'],
          list: [
            'Contact and booking data you provide via the form or WhatsApp: name, email, phone, trip details (route, date, time, vehicle, notes).',
            'Navigation and analytics data: with your consent, data collected by Google Analytics 4; aggregated, cookieless statistics via Umami.',
            'Technical and security data: IP address and server logs, used to keep the service secure and prevent abuse/spam.',
          ],
        },
        {
          heading: 'Purposes and legal bases',
          body: ['Data is processed for the following purposes:'],
          list: [
            'Responding to quote/booking requests and providing the service — legal basis: pre-contractual and contractual measures (Art. 6.1.b GDPR).',
            'Site security, spam and abuse prevention — legitimate interest (Art. 6.1.f GDPR).',
            'Analytics and marketing via cookies — consent (Art. 6.1.a GDPR), withdrawable at any time.',
            'Legal obligations (e.g. tax/accounting) — legal obligation (Art. 6.1.c GDPR).',
          ],
        },
        {
          heading: 'Recipients and processors',
          body: [
            'Data may be processed by providers acting as processors, including: the hosting provider (VPS), Amazon Web Services (Amazon SES) for sending email, Cloudflare (Turnstile) for anti-spam where enabled, and Google (Google Analytics) subject to consent. Some providers may process data outside the EU/EEA under the European Commission’s Standard Contractual Clauses.',
          ],
        },
        {
          heading: 'Retention',
          body: [
            'Request data is kept for as long as needed to handle the request and meet legal obligations, then deleted or anonymised. Analytics data is retained per each tool’s settings.',
          ],
        },
        {
          heading: 'Your rights',
          body: [
            'You may exercise your rights under Arts. 15-22 GDPR (access, rectification, erasure, restriction, portability, objection) and withdraw consent at any time by writing to ' +
              SITE.email +
              '. You also have the right to lodge a complaint with the Italian Data Protection Authority (Garante, www.garanteprivacy.it).',
          ],
        },
      ],
    },
  },

  cookie: {
    it: {
      title: 'Cookie Policy',
      updated: LAST_UPDATED,
      intro: [
        'Questo sito utilizza cookie e tecnologie simili. I cookie tecnici, necessari al funzionamento, non richiedono consenso; i cookie di analisi e marketing sono installati solo previo tuo consenso tramite il banner.',
      ],
      sections: [
        {
          heading: 'Cookie tecnici e di preferenza (sempre attivi)',
          body: ['Necessari al funzionamento del sito e alla memorizzazione delle tue scelte:'],
          list: [
            'sk-consent (memoria locale): registra la tua scelta sui cookie.',
            'sm-luxury-chauffeur.locale (memoria locale): ricorda la lingua selezionata.',
            'Cloudflare Turnstile: può impostare un cookie tecnico temporaneo per la protezione antispam dei moduli, ove attiva.',
          ],
        },
        {
          heading: 'Cookie di analisi e marketing (previo consenso)',
          body: ['Installati solo se accetti dal banner:'],
          list: [
            'Google Analytics 4 (_ga, _ga_*): statistiche sull’utilizzo del sito, con IP anonimizzato. Avviato in modalità “consenso negato” finché non accetti.',
            'Umami: analisi statistica senza cookie e senza dati personali identificativi — attiva sempre, non richiede consenso.',
          ],
        },
        {
          heading: 'Gestione del consenso',
          body: [
            'Puoi modificare o revocare le tue scelte in qualsiasi momento tramite il link “Preferenze cookie” nel footer, oppure dalle impostazioni del tuo browser.',
          ],
        },
      ],
    },
    en: {
      title: 'Cookie Policy',
      updated: LAST_UPDATED_EN,
      intro: [
        'This site uses cookies and similar technologies. Technical cookies needed for operation require no consent; analytics and marketing cookies are only set after you consent via the banner.',
      ],
      sections: [
        {
          heading: 'Technical & preference cookies (always on)',
          body: ['Needed for the site to work and to store your choices:'],
          list: [
            'sk-consent (local storage): records your cookie choice.',
            'sm-luxury-chauffeur.locale (local storage): remembers your selected language.',
            'Cloudflare Turnstile: may set a temporary technical cookie for form anti-spam, where enabled.',
          ],
        },
        {
          heading: 'Analytics & marketing cookies (with consent)',
          body: ['Only set if you accept via the banner:'],
          list: [
            'Google Analytics 4 (_ga, _ga_*): site usage statistics with anonymised IP. Starts in “consent denied” mode until you accept.',
            'Umami: cookieless statistical analytics with no identifying personal data — always on, no consent required.',
          ],
        },
        {
          heading: 'Managing consent',
          body: [
            'You can change or withdraw your choices at any time via the “Cookie preferences” link in the footer, or through your browser settings.',
          ],
        },
      ],
    },
  },

  terms: {
    it: {
      title: 'Termini e Condizioni',
      updated: LAST_UPDATED,
      intro: [
        `I presenti termini regolano l’uso del sito ${SITE.url} e la richiesta dei servizi di noleggio con conducente (NCC) offerti da ${SITE.legalName}.`,
      ],
      sections: [
        {
          heading: 'Natura del servizio',
          body: [
            'Il servizio è di noleggio con conducente (NCC). L’invio del modulo o un messaggio WhatsApp costituisce una richiesta di preventivo/prenotazione e non un contratto vincolante: la prenotazione si intende confermata solo a seguito di conferma esplicita da parte dell’operatore.',
          ],
        },
        {
          heading: 'Prezzi e preventivi',
          body: [
            'I prezzi indicati sul sito e nel calcolatore sono indicativi e possono variare in base a tratta, durata, orario, attese e condizioni del traffico. Il prezzo definitivo è quello confermato dall’operatore.',
          ],
        },
        {
          heading: 'Prenotazioni e cancellazioni',
          body: [
            'Eventuali condizioni di modifica e cancellazione sono comunicate al momento della conferma. Si invita a fornire dettagli accurati su orari e luoghi per garantire la qualità del servizio.',
          ],
        },
        {
          heading: 'Responsabilità',
          body: [
            `${SITE.legalName} non è responsabile per ritardi o disservizi dovuti a cause di forza maggiore, condizioni del traffico o informazioni inesatte fornite dal cliente.`,
          ],
        },
        {
          heading: 'Legge applicabile e foro competente',
          body: [
            'I presenti termini sono regolati dalla legge italiana. Per qualsiasi controversia è competente il foro del luogo di residenza/domicilio del consumatore ove previsto dalla normativa applicabile.',
          ],
        },
      ],
    },
    en: {
      title: 'Terms & Conditions',
      updated: LAST_UPDATED_EN,
      intro: [
        `These terms govern the use of ${SITE.url} and requests for the chauffeur (NCC) services offered by ${SITE.legalName}.`,
      ],
      sections: [
        {
          heading: 'Nature of the service',
          body: [
            'The service is chauffeur hire (NCC). Submitting the form or a WhatsApp message is a quote/booking request, not a binding contract: a booking is confirmed only upon the operator’s explicit confirmation.',
          ],
        },
        {
          heading: 'Prices and quotes',
          body: [
            'Prices shown on the site and in the calculator are indicative and may vary by route, duration, time, waiting and traffic. The final price is the one confirmed by the operator.',
          ],
        },
        {
          heading: 'Bookings and cancellations',
          body: [
            'Any change/cancellation conditions are communicated at confirmation. Please provide accurate times and locations to ensure service quality.',
          ],
        },
        {
          heading: 'Liability',
          body: [
            `${SITE.legalName} is not liable for delays or disruptions due to force majeure, traffic conditions, or inaccurate information provided by the client.`,
          ],
        },
        {
          heading: 'Governing law and jurisdiction',
          body: [
            'These terms are governed by Italian law. Any dispute is subject to the court of the consumer’s place of residence/domicile where provided by applicable law.',
          ],
        },
      ],
    },
  },
};
