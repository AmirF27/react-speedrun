class User {
  constructor(user) {
    this.user = user;
  }

  getName() {
    return this.user.local
      ? this.user.local.name || this.user.local.email
      : this.user.twitter.displayName;
  }

  formatAddress() {
    if (!this.hasAddress()) return 'N/A';

    return `${this.user.address.city}, ` +
           `${this.user.address.state ? `${this.user.address.state}, ` : ''}` +
           `${this.user.address.country}`;
  }

  hasAddress() {
    return this.user.address && Object.keys(this.user.address).length > 0;
  }
}

export default User;
