let token = null;

firebase.auth().onAuthStateChanged(async user => {
  if (user) {
    token = await user.getIdToken(true);
  } else {
    await firebase.auth().signOut();
    window.location = window.location.origin;
  }
});

const app = new Vue({
  data: {
    checkbox: false,
    failure: false,
    info: {
      dob: '',
      firstName: '',
      householdNum: '',
      lastName: '',
    },
    noRecords: false,
  },
  methods: {
    async postData() {
      const {
        dob, firstName, householdNum, lastName,
      } = this.info;
      if (!dob || !firstName || !lastName || (this.checkbox && !householdNum)) {
        return;
      }

      const obj = { info: this.info, token };
      if (!this.checkbox) {
        delete obj.householdNum;
      }

      const res = await axios.post('/api/searchRecords', obj);
      if (res.error) {
        this.noRecords = false;
        this.failure = true;
      } else if (res.data.length) {
        console.log(res.data);
      } else {
        this.noRecords = true;
        this.failure = false;
      }
    },
    uppercase(e) {
      e.target.value = e.target.value.toUpperCase();
    },
  },
  el: '#app',
});
