firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

firebase.auth().onAuthStateChanged(async user => {
  if (user) {
    const token = await user.getIdToken();
    try {
      const res = await axios.post('/api/newSession', {
        _csrf: document.getElementById('_csrf').value,
        token,
      });
      if (res.error) {
        await firebase.auth().signOut();
      }
      window.location.href = `${window.location.origin}/addPerson`;
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

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .catch(_e => {
      alert('Invalid email or password');
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
