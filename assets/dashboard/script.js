var residentApp = new Vue({
  delimiters: ["[[","]]"],
  el: '#residentsTable',
  data: {
    records: [],
  },
  methods: {
    getNRecords: async function() {
      const res = await axios.get('/api/getNRecords');
      if (!res.error) {
        console.log(res.data);
        this.records = res.data;
      }
    }
  }
});

residentApp.getNRecords();