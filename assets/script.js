let token = null;

firebase.auth().onAuthStateChanged(async (user) => {
  if (user) {
    token = await user.getIdToken(true);
  } else {
    await firebase.auth().signOut();
    window.location = window.location.origin;
  }
});

const signOut = async () => {
  window.localStorage.clear();
  firebase.auth().signOut();
  await axios.get("/api/logout");
  window.location.assign("/login");
};
