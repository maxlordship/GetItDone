# GetItDone — GTD Personal Productivity App

## Progetto
Applicazione web per la gestione personale secondo la metodologia **GTD (Getting Things Done)**.
Consultabile da desktop e mobile. Accesso protetto tramite autenticazione.

## Stack
- **Next.js 16** (App Router, `src/` directory) + TypeScript
- **Tailwind CSS v4**
- **Supabase** — PostgreSQL database + Auth (magic link)
- **Vercel** — deploy

## Architettura Auth
- Supabase Auth con **magic link** (niente password)
- **Row Level Security (RLS)** su tutte le tabelle: ogni utente vede solo i propri dati
- Middleware Next.js che reindirizza al login se non autenticato
- Progettato per multi-utente fin dall'inizio

## Schema Database

### `areas` — Aree di responsabilità
| colonna | tipo | note |
|---------|------|------|
| id | uuid PK | |
| user_id | uuid FK | auth.users |
| name | text | es. "Lavoro", "Personale" |
| color | text | hex color per UI |
| created_at | timestamptz | |

### `projects` — Progetti
| colonna | tipo | note |
|---------|------|------|
| id | uuid PK | |
| user_id | uuid FK | |
| area_id | uuid FK nullable | → areas |
| title | text | |
| description | text | |
| status | text | active \| completed \| someday |
| due_date | date nullable | |
| created_at | timestamptz | |

### `actions` — Tutte le azioni GTD
| colonna | tipo | note |
|---------|------|------|
| id | uuid PK | |
| user_id | uuid FK | |
| project_id | uuid FK nullable | → projects |
| area_id | uuid FK nullable | → areas |
| title | text | |
| notes | text | |
| type | text | next_action \| waiting_for \| someday_maybe \| scheduled |
| context | text nullable | @casa, @lavoro, @telefono, @computer... |
| scheduled_at | timestamptz nullable | per tipo scheduled |
| delegated_to | text nullable | per waiting_for |
| completed | boolean | default false |
| completed_at | timestamptz nullable | |
| created_at | timestamptz | |

### `inbox` — Cattura rapida
| colonna | tipo | note |
|---------|------|------|
| id | uuid PK | |
| user_id | uuid FK | |
| title | text | |
| notes | text | |
| created_at | timestamptz | |

## Viste dell'app
| Percorso | Descrizione |
|----------|-------------|
| `/` | Dashboard / redirect |
| `/inbox` | Cattura rapida, svuota inbox |
| `/projects` | Lista progetti per area |
| `/next-actions` | Azioni prossime, filtro contesto/area |
| `/calendar` | Vista mensile azioni schedulate |
| `/waiting` | In attesa / delegato |
| `/someday` | Prima o poi |
| `/weekly-review` | Checklist guidata GTD settimanale |
| `/settings` | Aree, contesti, profilo |
| `/login` | Magic link login |

## Principi UI/UX
- **Mobile-first**: navigazione bottom bar su mobile, sidebar su desktop
- Design pulito e minimalista, gradevole ma non sovraccarico
- Cattura rapida inbox accessibile ovunque (floating button su mobile)
- Ogni azione modificabile inline dove possibile

## Convenzioni codice
- Tutti i componenti in `src/components/`
- Le Server Actions in `src/app/actions/`
- Il client Supabase in `src/lib/supabase/`
- Tipi TypeScript generati da Supabase in `src/types/database.ts`
- Nessun commento salvo per logica non ovvia

## Aggiornamento CLAUDE.md
Aggiorna questo file ad ogni modifica significativa: nuove route, cambi schema, nuove dipendenze, decisioni architetturali rilevanti.
