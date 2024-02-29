export default class CoreService {
  runSuperglue(file_name) {
    return fetch('http://127.0.0.1:5000/api/run_match?imageName='+file_name)
      .then((res) => res.json())
      .then((d) => d.code);
  }
  superGlueRes() {
    return fetch('http://127.0.0.1:5000/api/results')
      .then((res) => res.json())
      .then((d) => d.data);
  }
}