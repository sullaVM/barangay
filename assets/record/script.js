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
    failureSeen: false,
    info: {
      barangay: 'BOLOBOLO',
      citizenship: '',
      city: 'EL SALVADOR CITY',
      dob: '',
      extName: '',
      firstName: '',
      houseHeadRelation: '',
      householdNum: '',
      lastName: '',
      maritalStatus: '',
      middleName: '',
      occupation: '',
      placeOfBirth: '',
      province: 'MISAMIS ORIENTAL',
      purok: '',
      region: 'X',
      sex: '',
      sitio: '',
      street: '',
    },
    successSeen: false,
  },
  methods: {
    async postData() {
      if (Object.values(this.$data.info).some(e => !e)) {
        return;
      }

      const res = await axios.post('/api/addRecord', {
        _csrf: document.getElementById('_csrf').value,
        info: this.$data.info,
        token,
      });
      if (res.error) {
        this.successSeen = false;
        this.failureSeen = true;
      } else {
        this.successSeen = true;
        this.failureSeen = false;
      }
    },
    uppercase(e) {
      e.target.value = e.target.value.toUpperCase();
    },
  },
  el: '#app',
});

// bootstrapElements();