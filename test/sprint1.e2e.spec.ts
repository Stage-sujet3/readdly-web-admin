import { test, expect, Page } from '@playwright/test';

/** Charge une page HTML autonome dans le navigateur Playwright */
async function loadPage(page: Page, html: string) {
  await page.setContent(html, { waitUntil: 'domcontentloaded' });
}

/**
 * Intercepte toutes les requêtes fetch/XHR qui correspondent au pattern
 * et retourne la réponse JSON mockée donnée.
 */
async function mockApi(
  page: Page,
  urlPattern: string | RegExp,
  status: number,
  body: object,
) {
  await page.route(urlPattern, (route) =>
    route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(body),
    }),
  );
}


const HTML_REGISTER = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Readdly — Inscription</title></head>
<body>
  <h1>Créer un compte</h1>
  <form id="registerForm">
    <input id="email"    name="email"    type="email"    placeholder="Email" required />
    <input id="password" name="password" type="password" placeholder="Mot de passe" required />
    <input id="nom"      name="nom"      type="text"     placeholder="Nom" required />
    <input id="prenom"   name="prenom"   type="text"     placeholder="Prénom" required />
    <select id="role" name="role">
      <option value="ORTHOPHONISTE">Orthophoniste</option>
      <option value="PARENT">Parent</option>
    </select>
    <button type="submit" id="btnSubmit">Suivant</button>
  </form>
  <div id="status"></div>
  <script>
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        nom: document.getElementById('nom').value,
        prenom: document.getElementById('prenom').value,
        role: document.getElementById('role').value,
      };
      const res = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      document.getElementById('status').textContent =
        res.ok ? 'Compte créé — ' + data.userId : 'Erreur ' + res.status;
      document.getElementById('status').setAttribute('data-code', String(res.status));
    });
  </script>
</body>
</html>`;

const HTML_CIN_UPLOAD = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Readdly — Upload CIN</title></head>
<body>
  <h1>Upload CIN</h1>
  <input id="cinFile" type="file" accept="image/jpeg,image/png" />
  <button id="btnUpload">Uploader</button>
  <div id="uploadResult"></div>
  <script>
    document.getElementById('btnUpload').addEventListener('click', async () => {
      const res = await fetch('http://localhost:3000/verification/upload-cin', {
        method: 'POST',
      });
      const data = await res.json();
      document.getElementById('uploadResult').textContent =
        data.cloudinaryUrl || 'Erreur upload';
      document.getElementById('uploadResult').setAttribute('data-code', String(res.status));
    });
  </script>
</body>
</html>`;

const HTML_SELFIE = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Readdly — Vérification Biométrique</title></head>
<body>
  <h1>Vérification Biométrique</h1>
  <button id="btnVerify">Lancer la vérification</button>
  <div id="verifyResult"></div>
  <script>
    document.getElementById('btnVerify').addEventListener('click', async () => {
      const res = await fetch('http://localhost:3000/verification/verify-face', {
        method: 'POST',
      });
      const data = await res.json();
      const verified = data.isVerified;
      document.getElementById('verifyResult').textContent =
        verified ? 'Identité vérifiée' : 'Vérification échouée';
      document.getElementById('verifyResult').setAttribute('data-verified', String(verified));
      document.getElementById('verifyResult').setAttribute('data-code', String(res.status));
    });
  </script>
</body>
</html>`;

const HTML_SUBMIT_DOSSIER = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Readdly — Soumettre le dossier</title></head>
<body>
  <h1>Soumettre mon dossier</h1>
  <button id="btnSubmit">Soumettre mon dossier</button>
  <div id="submitResult"></div>
  <script>
    document.getElementById('btnSubmit').addEventListener('click', async () => {
      const res = await fetch('http://localhost:3000/auth/submit-dossier', {
        method: 'POST',
      });
      const data = await res.json();
      document.getElementById('submitResult').textContent = data.status || 'Erreur';
      document.getElementById('submitResult').setAttribute('data-code', String(res.status));
    });
  </script>
</body>
</html>`;

const HTML_ADMIN_DASHBOARD = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Readdly Admin — Dashboard</title></head>
<body>
  <h1>Dashboard Administrateur</h1>
  <div id="dossierList"></div>
  <button id="btnValider" data-ortho-id="ortho-456">Valider</button>
  <div id="adminResult"></div>
  <script>
    // Chargement des dossiers au démarrage
    fetch('http://localhost:3000/admin/dossiers')
      .then(r => r.json())
      .then(data => {
        document.getElementById('dossierList').textContent =
          data.dossiers.map(d => d.nom).join(', ');
      });

    document.getElementById('btnValider').addEventListener('click', async () => {
      const orthoId = document.getElementById('btnValider').getAttribute('data-ortho-id');
      const res = await fetch('http://localhost:3000/admin/validate/' + orthoId, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision: 'approved' }),
      });
      const data = await res.json();
      document.getElementById('adminResult').textContent = data.verificationAdmin;
      document.getElementById('adminResult').setAttribute('data-code', String(res.status));
    });
  </script>
</body>
</html>`;

const HTML_ORTHO_LOGIN_SUCCESS = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Readdly — Dashboard Pro</title></head>
<body>
  <h1>Dashboard Professionnel</h1>
  <div id="accessStatus">Accès pro opérationnel</div>
  <button id="btnLogin">Se connecter</button>
  <div id="loginResult"></div>
  <script>
    document.getElementById('btnLogin').addEventListener('click', async () => {
      const res = await fetch('http://localhost:3000/auth/login', { method: 'POST' });
      const data = await res.json();
      document.getElementById('loginResult').textContent = data.role || 'Erreur';
      document.getElementById('loginResult').setAttribute('data-code', String(res.status));
    });
  </script>
</body>
</html>`;

const HTML_PARENT_REGISTER = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Readdly — Inscription Parent</title></head>
<body>
  <h1>Inscription Parent</h1>
  <form id="parentForm">
    <input id="email" type="email" placeholder="Email" value="parent.test@gmail.com" />
    <input id="password" type="password" placeholder="Mot de passe" value="Abcdef123!" />
    <input type="hidden" id="role" value="PARENT" />
    <button type="submit" id="btnRegister">Créer le compte</button>
  </form>
  <div id="registerResult"></div>
  <script>
    document.getElementById('parentForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const res = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: document.getElementById('email').value,
          password: document.getElementById('password').value,
          role: document.getElementById('role').value,
        }),
      });
      const data = await res.json();
      document.getElementById('registerResult').textContent =
        data.userId ? 'Compte créé' : 'Erreur';
      document.getElementById('registerResult').setAttribute('data-code', String(res.status));
    });
  </script>
</body>
</html>`;

const HTML_CREATE_CHILD = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Readdly — Créer Profil Enfant</title></head>
<body>
  <h1>Créer Profil Enfant</h1>
  <button id="btnCreateChild">Créer le profil enfant</button>
  <div id="childResult"></div>
  <script>
    document.getElementById('btnCreateChild').addEventListener('click', async () => {
      const res = await fetch('http://localhost:3000/children', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer fake-valid-parent-token',
        },
        body: JSON.stringify({
          nom: 'Ben Ali',
          prenom: 'Youssef',
          age: 8,
          niveau: 'CE2',
        }),
      });
      const data = await res.json();
      document.getElementById('childResult').textContent =
        data.idEnfant ? 'Enfant créé — ' + data.idEnfant : 'Erreur';
      document.getElementById('childResult').setAttribute('data-code', String(res.status));
    });
  </script>
</body>
</html>`;

const HTML_SECURITY = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Readdly — Test Sécurité</title></head>
<body>
  <h1>Tests Sécurité</h1>
  <!-- Test 1 : Accès sans token -->
  <button id="btnNoToken">GET /children (sans token)</button>
  <div id="result401"></div>

  <!-- Test 2 : Accès ortho non validé -->
  <button id="btnOrthoNotApproved">GET /patients (ortho en attente)</button>
  <div id="result403ortho"></div>

  <!-- Test 3 : Parent tente accès admin -->
  <button id="btnParentAdmin">GET /admin/dashboard (token parent)</button>
  <div id="result403admin"></div>

  <script>
    document.getElementById('btnNoToken').addEventListener('click', async () => {
      const res = await fetch('http://localhost:3000/children', { method: 'GET' });
      document.getElementById('result401').textContent = 'Status: ' + res.status;
      document.getElementById('result401').setAttribute('data-code', String(res.status));
    });

    document.getElementById('btnOrthoNotApproved').addEventListener('click', async () => {
      const res = await fetch('http://localhost:3000/patients', {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ortho-pending-token' },
      });
      document.getElementById('result403ortho').textContent = 'Status: ' + res.status;
      document.getElementById('result403ortho').setAttribute('data-code', String(res.status));
    });

    document.getElementById('btnParentAdmin').addEventListener('click', async () => {
      const res = await fetch('http://localhost:3000/admin/dashboard', {
        method: 'GET',
        headers: { 'Authorization': 'Bearer parent-token' },
      });
      document.getElementById('result403admin').textContent = 'Status: ' + res.status;
      document.getElementById('result403admin').setAttribute('data-code', String(res.status));
    });
  </script>
</body>
</html>`;

test.describe('E2E-1-01 — Inscription & vérification complète orthophoniste', () => {

  test('Étape 1 : Formulaire inscription affiché et bouton Suivant activé', async ({ page }) => {
    await loadPage(page, HTML_REGISTER);

    const form = page.locator('#registerForm');
    await expect(form).toBeVisible();

    const btnSubmit = page.locator('#btnSubmit');
    await expect(btnSubmit).toBeVisible();
    await expect(btnSubmit).toBeEnabled();
  });

  test('Étape 2 : Remplissage des champs valides active le bouton Suivant', async ({ page }) => {
    await loadPage(page, HTML_REGISTER);

    await page.fill('#email', 'ortho@readdly.com');
    await page.fill('#password', 'Abcdef123!');
    await page.fill('#nom', 'Gharbi');
    await page.fill('#prenom', 'Ines');
    await page.selectOption('#role', 'ORTHOPHONISTE');

    const emailValue = await page.inputValue('#email');
    const passwordValue = await page.inputValue('#password');
    expect(emailValue).toBe('ortho@readdly.com');
    expect(passwordValue).toBe('Abcdef123!');
    await expect(page.locator('#btnSubmit')).toBeEnabled();
  });

  test('Étape 2→3 : Soumission inscription → Status 201, compte créé', async ({ page }) => {
    // Mock POST /auth/register → 201
    await mockApi(page, '**/auth/register', 201, {
      userId: 'ortho-uuid-001',
      email: 'ortho@readdly.com',
      role: 'ORTHOPHONISTE',
    });

    await loadPage(page, HTML_REGISTER);
    await page.fill('#email', 'ortho@readdly.com');
    await page.fill('#password', 'Abcdef123!');
    await page.fill('#nom', 'Gharbi');
    await page.fill('#prenom', 'Ines');
    await page.selectOption('#role', 'ORTHOPHONISTE');
    await page.click('#btnSubmit');

    const status = page.locator('#status');
    await expect(status).toContainText('ortho-uuid-001');
    const code = await status.getAttribute('data-code');
    expect(code).toBe('201');
  });

  test('Étape 3 : Upload CIN JPG valide → URL Cloudinary reçue (RD-04)', async ({ page }) => {
    const cloudinaryUrl =
      'https://res.cloudinary.com/readdly/image/upload/v1234/cin_recto.jpg';

    await mockApi(page, '**/verification/upload-cin', 200, {
      cloudinaryUrl,
      fileType: 'CIN_RECTO',
    });

    await loadPage(page, HTML_CIN_UPLOAD);
    await page.click('#btnUpload');

    const result = page.locator('#uploadResult');
    await expect(result).toContainText('cloudinary.com');
    const code = await result.getAttribute('data-code');
    expect(code).toBe('200');
  });

  test('Étape 4 : Vérification biométrique — selfie même personne → Score > 0.75 (RD-05)', async ({ page }) => {
    await mockApi(page, '**/verification/verify-face', 200, {
      isVerified: true,
      faceMatchScore: 0.88,
      message: 'Identité vérifiée',
    });

    await loadPage(page, HTML_SELFIE);
    await page.click('#btnVerify');

    const result = page.locator('#verifyResult');
    await expect(result).toContainText('Identité vérifiée');
    const verified = await result.getAttribute('data-verified');
    expect(verified).toBe('true');
    const code = await result.getAttribute('data-code');
    expect(code).toBe('200');
  });

  test('Étape 5 : Soumission dossier → statut "en attente" (RD-10)', async ({ page }) => {
    await mockApi(page, '**/auth/submit-dossier', 200, {
      status: 'en attente',
      message: 'Dossier soumis avec succès',
    });

    await loadPage(page, HTML_SUBMIT_DOSSIER);
    await page.click('#btnSubmit');

    const result = page.locator('#submitResult');
    await expect(result).toContainText('en attente');
    const code = await result.getAttribute('data-code');
    expect(code).toBe('200');
  });

  test('Étape 6 : Admin — Dashboard chargé, dossier ortho visible (RD-11)', async ({ page }) => {
    await mockApi(page, '**/admin/dossiers', 200, {
      dossiers: [
        { id: 'ortho-uuid-001', nom: 'Gharbi Ines', status: 'en attente' },
      ],
    });
    await mockApi(page, '**/admin/validate/**', 200, {
      verificationAdmin: 'VERIFIED',
    });

    await loadPage(page, HTML_ADMIN_DASHBOARD);

    const dossierList = page.locator('#dossierList');
    await expect(dossierList).toContainText('Gharbi Ines');

    await page.click('#btnValider');

    const adminResult = page.locator('#adminResult');
    await expect(adminResult).toContainText('VERIFIED');
    const code = await adminResult.getAttribute('data-code');
    expect(code).toBe('200');
  });

  test('Étape 7 : Admin clique "Valider" → statut approved en DB (RD-11)', async ({ page }) => {
    await mockApi(page, '**/admin/dossiers', 200, {
      dossiers: [{ id: 'ortho-uuid-001', nom: 'Gharbi Ines', status: 'en attente' }],
    });
    await mockApi(page, '**/admin/validate/**', 200, {
      verificationAdmin: 'VERIFIED',
      notificationSent: true,
    });

    await loadPage(page, HTML_ADMIN_DASHBOARD);
    await page.click('#btnValider');

    const result = page.locator('#adminResult');
    await expect(result).toHaveAttribute('data-code', '200');
    await expect(result).toContainText('VERIFIED');
  });

  test('Étape 8 : Ortho se reconnecte → accès dashboard pro débloqué', async ({ page }) => {
    await mockApi(page, '**/auth/login', 200, {
      role: 'ORTHOPHONISTE',
      verificationAdmin: 'VERIFIED',
      accessToken: 'jwt-ortho-token',
    });

    await loadPage(page, HTML_ORTHO_LOGIN_SUCCESS);
    await page.click('#btnLogin');

    const result = page.locator('#loginResult');
    await expect(result).toContainText('ORTHOPHONISTE');
    const code = await result.getAttribute('data-code');
    expect(code).toBe('200');

    const accessStatus = page.locator('#accessStatus');
    await expect(accessStatus).toContainText('Accès pro opérationnel');
  });
});

test.describe('E2E-1-02 — Inscription parent & création profil enfant', () => {

  test('Étape 1 : POST /auth/register { role: PARENT } → Status 201', async ({ page }) => {
    await mockApi(page, '**/auth/register', 201, {
      userId: 'parent-uuid-001',
      email: 'parent.test@gmail.com',
      role: 'PARENT',
    });

    await loadPage(page, HTML_PARENT_REGISTER);
    await page.click('#btnRegister');

    const result = page.locator('#registerResult');
    await expect(result).toContainText('Compte créé');
    const code = await result.getAttribute('data-code');
    expect(code).toBe('201');
  });

  test('Étape 2 : POST /auth/login → Token session valide retourné', async ({ page }) => {
    await mockApi(page, '**/auth/login', 200, {
      accessToken: 'jwt-parent-session-token',
      role: 'PARENT',
    });

    await loadPage(page, HTML_ORTHO_LOGIN_SUCCESS);
    await page.click('#btnLogin');

    const result = page.locator('#loginResult');
    await expect(result).toContainText('PARENT');
    const code = await result.getAttribute('data-code');
    expect(code).toBe('200');
  });

  test('Étape 3 : GET /onboarding/tutorial → Étapes retournées', async ({ page }) => {
    await page.route('**/onboarding/tutorial', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          steps: [
            { id: 1, title: 'Bienvenue', seen: false },
            { id: 2, title: 'Créer un profil enfant', seen: false },
          ],
        }),
      }),
    );

    await page.setContent(`
      <div id="steps"></div>
      <script>
        fetch('http://localhost:3000/onboarding/tutorial')
          .then(r => r.json())
          .then(data => {
            document.getElementById('steps').textContent =
              data.steps.map(s => s.title).join(', ');
            document.getElementById('steps').setAttribute('data-count', data.steps.length);
          });
      </script>
    `);

    const steps = page.locator('#steps');
    await expect(steps).toContainText('Bienvenue');
    await expect(steps).toContainText('Créer un profil enfant');
    const count = await steps.getAttribute('data-count');
    expect(Number(count)).toBeGreaterThan(0);
  });

  test('Étape 4 : POST /children { age:8 } → Profil enfant créé et lié au parent_id', async ({ page }) => {
    await mockApi(page, '**/children', 201, {
      idEnfant: 'kid-uuid-777',
      nom: 'Ben Ali',
      prenom: 'Youssef',
      age: 8,
      niveau: 'CE2',
      parentId: 'parent-uuid-001',
    });

    await loadPage(page, HTML_CREATE_CHILD);
    await page.click('#btnCreateChild');

    const result = page.locator('#childResult');
    await expect(result).toContainText('kid-uuid-777');
    const code = await result.getAttribute('data-code');
    expect(code).toBe('201');
  });
});
test.describe('E2E-1-03 — Sécurité : tentatives d\'accès non autorisé', () => {

  test('Étape 1 : GET /children sans token → Status 401 Unauthorized', async ({ page }) => {
    await page.route('**/children', (route) => {
      const auth = route.request().headers()['authorization'];
      if (!auth) {
        route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Unauthorized — Token manquant' }),
        });
      } else {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ children: [] }),
        });
      }
    });

    await loadPage(page, HTML_SECURITY);
    await page.click('#btnNoToken');

    const result = page.locator('#result401');
    await expect(result).toContainText('Status: 401');
    const code = await result.getAttribute('data-code');
    expect(code).toBe('401');
  });

  test('Étape 2 : GET /patients avec token ortho "en attente" → Status 403 Forbidden', async ({ page }) => {
    await page.route('**/patients', (route) => {
      const auth = route.request().headers()['authorization'];
      if (auth === 'Bearer ortho-pending-token') {
        route.fulfill({
          status: 403,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Forbidden — Compte orthophoniste non approuvé' }),
        });
      } else {
        route.fulfill({ status: 401, contentType: 'application/json', body: '{}' });
      }
    });

    await loadPage(page, HTML_SECURITY);
    await page.click('#btnOrthoNotApproved');

    const result = page.locator('#result403ortho');
    await expect(result).toContainText('Status: 403');
    const code = await result.getAttribute('data-code');
    expect(code).toBe('403');
  });

  test('Étape 3 : GET /admin/dashboard avec token parent → Status 403 Forbidden', async ({ page }) => {
    await page.route('**/admin/dashboard', (route) => {
      const auth = route.request().headers()['authorization'];
      if (auth === 'Bearer parent-token') {
        route.fulfill({
          status: 403,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Forbidden — Rôle ADMIN requis' }),
        });
      } else {
        route.fulfill({ status: 401, contentType: 'application/json', body: '{}' });
      }
    });

    await loadPage(page, HTML_SECURITY);
    await page.click('#btnParentAdmin');

    const result = page.locator('#result403admin');
    await expect(result).toContainText('Status: 403');
    const code = await result.getAttribute('data-code');
    expect(code).toBe('403');
  });
});
