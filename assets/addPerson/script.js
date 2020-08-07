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
  el: '#app',
  methods: {
    async postData() {
      const {
        lastName, firstName, householdNum, dob,
      } = this.info;
      if (!lastName || !firstName || !householdNum || !dob
        || isNaN(new Date(dob))) {
        alert(`Missing one or more of the following information:

Last name
First name
Date of birth
Household Number`);
        return;
      }

      const res = await axios.post('/api/addPerson', {
        _csrf: document.getElementById('_csrf').value,
        info: this.info,
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
});
