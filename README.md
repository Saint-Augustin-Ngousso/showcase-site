# Paroisse Saint Augustin de Ngousso

Site de la paroisse Saint Augustin de Ngousso (Archidiocèse de Yaoundé, zone pastorale de l’Omnisport). Stack : React, Vite, Tailwind CSS. Le contenu vient du backend [`showcase-site-back`](https://github.com/Saint-Augustin-Ngousso/showcase-site-back) (Django).

## Lancer le site

```bash
npm install
cp .env.example .env    # VITE_API_URL : adresse de l'API (http://localhost:8000/api par défaut)
npm run dev
```

Le serveur de développement s’ouvre sur `http://localhost:5173`. Démarrer aussi le backend (voir son README).

## Fonctionnement

- Tout le contenu public est chargé en **une seule requête** (`GET /api/site/`), puis gardé dans le navigateur : les visites suivantes s’affichent immédiatement, même sur une connexion lente.
- Si le backend est injoignable, `src/data/content.js` sert de contenu de secours.
- Les formulaires (secrétariat, sacrements, prêtre, bénévolat, prière, questions, témoignages) envoient au backend.
- **Mur de prière** (`/priere`) : chaque visiteur choisit si son intention est visible par tous ou réservée aux prêtres. Les prêtres et le curé peuvent la retirer.
- **Connexion** (`/connexion`) : avec Google, facultative pour consulter.
- **Administration** (`/espace`) : réservée au secrétariat, aux prêtres et au curé. Le code de l’administration n’est téléchargé qu’à l’ouverture de `/espace`, pour garder le site public léger.

## Rubriques

1. Accueil — slogan, thèmes, horaires, prochain événement, mot du curé
2. La paroisse — identité, histoire, programme pastoral
3. Nos prêtres — curé, vicaires, secteurs et aumôneries
4. Messes et sacrements — dimanche, semaine, confessions, démarches
5. Secteurs et CEV — Saint Luc, Saint Marc, Saint Jean
6. Mouvements et services — associations, chorales, jeunes, conseils, commissions
7. Agenda et actualités — annonces, calendrier, récollections par métier
8. Contact et soutien — adresse, plan, secrétariat, comptes pour les dons

Pages secondaires : enseignements, prière, galerie, recherche, confidentialité, connexion.
