// scratch/get-users.js
fetch('http://localhost/bpkadumuminfinity/scratch/db-test.php')
  .then(res => res.text())
  .then(text => {
    console.log("Users from Database:");
    console.log(text);
  })
  .catch(err => {
    console.error("Failed to fetch users:", err);
  });
