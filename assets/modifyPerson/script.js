const app = new Vue({
  data: {
    failureSeen: false,
    info,
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

      const res = await axios.post('/api/modifyPerson', {
        _csrf: document.getElementById('_csrf').value,
        key: document.getElementById('_key').value,
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
