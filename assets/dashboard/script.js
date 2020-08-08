var residentApp = new Vue({
  delimiters: ["[[", "]]"],
  el: "#residents-table",
  data: {
    records: [],
    recordsSize: 0,
    isLoading: true,
  },
  methods: {
    getNRecords: async function () {
      const res = await axios.get("/api/getNRecords");
      if (!res.error) {
        this.records = res.data;
        this.isLoading = false;
        this.recordsSize = this.records.length;
      }
    },
  },
});

const app = new Vue({
  delimiters: ["[[", "]]"],
  data: {
    records: [],
    checkbox: false,
    failure: false,
    info: {
      dob: "",
      firstName: "",
      householdNum: "",
      lastName: "",
    },
    noRecords: false,
    isLoading: false,
  },
  el: "#app",
  methods: {
    async postData() {
      const { dob, firstName, householdNum, lastName } = this.info;
      if (!this.checkbox && (!lastName || !firstName || !dob)) {
        alert("Please supply last name, first name and date of birth.");
        return;
      }
      if (this.checkbox && !householdNum) {
        alert("Please supply a household number.");
        return;
      }

      this.isLoading = true;

      const obj = { info: this.info, token };
      if (!this.checkbox) {
        delete obj.householdNum;
      }

      const res = await axios.post("/api/searchPerson", obj);
      if (res.error) {
        this.noRecords = false;
        this.failure = true;
        this.isLoading = false;
      } else if (res.data.length) {
        const fetchedRecords = res.data;
        fetchedRecords.forEach((data) => {
          data.link = "/modifyPerson?lastName=".concat(
            data.lastName,
            "&firstName=",
            data.firstName,
            "&dob=",
            data.dob,
            "&householdNum=",
            data.householdNum
          );
          this.records.push(data);
        });

        this.isLoading = false;
      } else {
        this.noRecords = true;
        this.failure = false;
        this.isLoading = false;
      }
    },
    uppercase(e) {
      e.target.value = e.target.value.toUpperCase();
    },
  },
});

const closeHighlight = () => {
  const highlight = document.getElementById("highlight");
  highlight.hidden = true;
};
