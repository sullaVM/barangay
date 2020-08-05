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
  el: '#app',
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

      const res = await axios.post('/api/searchPerson', obj);
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
});
