import axios from 'axios';

axios.post('http://localhost:1337/graphql', {
  query: `
    {
      versions {
            titulo
            fecha
            bugFixes
          }
        }
  `
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error('Error fetching data:', error);
});
