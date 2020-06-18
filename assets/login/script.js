const frbs = firebase; // eslint-disable-line

frbs.initializeApp({
  apiKey: 'AIzaSyDQiIrJkE24EksendINj-X-F6Ei5LYxMe4',
  appId: '1:927585336513:web:93bdaca3cd10f62e87e840',
  authDomain: 'barangay-0000.firebaseapp.com',
  databaseURL: 'https://barangay-0000.firebaseio.com',
  messagingSenderId: '927585336513',
  projectId: 'barangay-0000',
  storageBucket: 'barangay-0000.appspot.com',
});

frbs.auth().setPersistence(frbs.auth.Auth.Persistence.LOCAL);

frbs.auth().onAuthStateChanged(async user => {
  if (user) {
    const token = await user.getIdToken();
    try {
      await axios.post('/api/newSession', { // eslint-disable-line
        _csrf: document.getElementById('_csrf').value,
        token,
      });
      window.location.href = window.location.origin;
    } catch (_e) {
      alert('Unable to sign in, please try again');
    }
  }
});

const passwordField = document.getElementById('password');

const signIn = () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (!email || !password) {
    alert('Missing email or password');
    return;
  }

  frbs
    .auth()
    .signInWithEmailAndPassword(email, password)
    .catch(_e => { // eslint-disable-line
      alert('Invalid email/password');
      passwordField.value = '';
    });
};

const bootstrapElements = () => {
  const enter = e => (e.keyCode === 13 ? signIn() : null);
  document.getElementById('sign-in').addEventListener('click', signIn);
  document.getElementById('email').addEventListener('keydown', enter);
  passwordField.addEventListener('keydown', enter);
};

bootstrapElements();
