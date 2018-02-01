class User {
    username: string
    password: string
    email: string
    _id: string
  
    constructor(username: string,
                password: string,
                email: string,
                _id: string) {
      this.username = username;
      this.password = password;
      this.email = email;
      this._id = _id;
    }
  }
  export = User;