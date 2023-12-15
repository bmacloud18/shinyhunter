const crypto = require('crypto');

module.exports = class {
  id = null;
  first_name = null;
  last_name = null;
  username = null;
  avatar = null;
  stg_dark = null;
  stg_notify = null;
  stg_text = null;
  #passwordHash = null;
  #salt = null;

  constructor(data) {
    this.id = data.usr_id;
    this.first_name = data.usr_first_name;
    this.last_name = data.usr_last_name;
    this.username = data.usr_username;
    this.avatar = data.usr_avatar;
    this.stg_dark = data.usr_stg_dark[0];
    this.stg_notify = data.usr_stg_notify[0];
    this.stg_text = data.usr_stg_text[0];
    this.#salt = data.usr_salt;
    this.#passwordHash = data.usr_password;
  }

  validatePassword(password) {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, this.#salt, 100000, 64, 'sha512', (err, derivedKey) => {
        if (err) { //problem computing digest, like hash function not available
          reject("Error: " +err);
          return;
        }

        const digest = derivedKey.toString('hex');
        if (this.#passwordHash == digest) {
          resolve(this.toJSON());
        }
        else {
          reject("Invalid username or password");
        }
      });
    });
  }

  toJSON() {
    return {
      id: this.id,
      first_name: this.first_name,
      last_name: this.last_name,
      username: this.username,
      avatar: this.avatar,
      stg_dark: this.stg_dark,
      stg_notify: this.stg_notify,
      stg_text: this.stg_text,
    }
  }
};